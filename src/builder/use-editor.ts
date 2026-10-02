"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { uid, type Project } from "./model";
import { saveProject, type StoredProject } from "./repository";
import { clearRecovery, recoveryKey, writeRecovery } from "./recovery";

type History = {
  past: Project[];
  present: Project;
  future: Project[];
  group: string;
  at: number;
};
type Action =
  | { type: "commit"; document: Project; group: string; at: number }
  | { type: "undo" | "redo" };
function reducer(state: History, action: Action): History {
  if (action.type === "commit") {
    if (action.document === state.present) return state;
    const combine =
      !!action.group &&
      state.group === action.group &&
      action.at - state.at < 1000;
    return {
      past: combine ? state.past : [...state.past, state.present].slice(-60),
      present: action.document,
      future: [],
      group: action.group,
      at: action.at,
    };
  }
  const restore = (p: Project) => ({
    ...p,
    revision: state.present.revision + 1,
    updatedAt: new Date().toISOString(),
  });
  if (action.type === "undo" && state.past.length)
    return {
      past: state.past.slice(0, -1),
      present: restore(state.past.at(-1)!),
      future: [state.present, ...state.future],
      group: "",
      at: 0,
    };
  if (action.type === "redo" && state.future.length)
    return {
      past: [...state.past, state.present],
      present: restore(state.future[0]),
      future: state.future.slice(1),
      group: "",
      at: 0,
    };
  return state;
}
export function useEditor(record: StoredProject) {
  const [draftKey] = useState(() =>
    recoveryKey(record.project.id, crypto.randomUUID()),
  );
  const recoveryFailed = useRef(false);
  const [history, dispatch] = useReducer(reducer, {
    past: [],
    present: record.project,
    future: [],
    group: "",
    at: 0,
  });
  const [status, setStatus] = useState("브라우저에 저장됨");
  const [saveError, setSaveError] = useState("");
  const current = useRef(history.present);
  useLayoutEffect(() => {
    current.current = history.present;
  }, [history.present]);
  const version = useRef(record.version);
  const saved = useRef(record.project);
  const queue = useRef(Promise.resolve());
  const save = useCallback(async () => {
    const document = current.current;
    const operation = queue.current
      .catch(() => {})
      .then(async () => {
        if (saved.current === document) return;
        setStatus("저장 중…");
        try {
          version.current = await saveProject(document, version.current);
          saved.current = document;
          if (current.current === document) {
            setStatus("브라우저에 저장됨");
            setSaveError("");
            try {
              clearRecovery(draftKey);
            } catch {
              /* IndexedDB is the primary store. */
            }
          }
        } catch (error) {
          setStatus("저장되지 않음");
          setSaveError(
            (error instanceof Error ? error.message : "저장하지 못했습니다.") +
              (recoveryFailed.current
                ? " 임시 복구본도 저장하지 못했습니다. 창을 닫기 전에 파일 백업을 내려받으세요."
                : ""),
          );
          throw error;
        }
      });
    queue.current = operation;
    return operation;
  }, [draftKey]);
  useEffect(() => {
    if (saved.current === history.present) return;
    try {
      writeRecovery(draftKey, history.present, version.current);
      recoveryFailed.current = false;
    } catch {
      recoveryFailed.current = true;
    }
    const timer = setTimeout(() => {
      void save().catch(() => {});
    }, 450);
    return () => clearTimeout(timer);
  }, [history.present, save, draftKey]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (saved.current !== current.current) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);
  return {
    project: history.present,
    canUndo: !!history.past.length,
    canRedo: !!history.future.length,
    status,
    saveError,
    save,
    saveCopy: async () => {
      await queue.current.catch(() => {});
      const document = current.current;
      await saveProject(
        {
          ...document,
          id: uid("project"),
          name: `${document.name} 사본`.slice(0, 100),
          updatedAt: new Date().toISOString(),
        },
        null,
      );
      saved.current = document;
      try {
        clearRecovery(draftKey);
      } catch {
        /* Copy is committed to IndexedDB. */
      }
    },
    commit: (document: Project, group = "") => {
      if (document !== history.present) setStatus("저장 대기 중…");
      dispatch({ type: "commit", document, group, at: Date.now() });
    },
    undo: () => {
      if (history.past.length) setStatus("저장 대기 중…");
      dispatch({ type: "undo" });
    },
    redo: () => {
      if (history.future.length) setStatus("저장 대기 중…");
      dispatch({ type: "redo" });
    },
  };
}
