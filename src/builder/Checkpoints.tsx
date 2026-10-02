"use client";

import { useEffect, useState } from "react";
import { Download, History, Plus, Trash2 } from "lucide-react";
import {
  deleteCheckpoint,
  listCheckpoints,
  saveCheckpoint,
  type Checkpoint,
} from "./repository";
import { editProject, parseProject, type Project } from "./model";
import { downloadFile } from "./export";
import Modal from "./Modal";

export default function Checkpoints({
  project,
  onRestore,
  onClose,
}: {
  project: Project;
  onRestore: (project: Project) => void;
  onClose: () => void;
}) {
  const [items, setItems] = useState<Checkpoint[]>([]);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    void listCheckpoints(project.id).then(
      (records) => {
        if (!cancelled) setItems(records);
      },
      (e) => {
        if (!cancelled) setError(e.message);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [project.id]);
  async function change(action: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await action();
      setItems(await listCheckpoints(project.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "작업을 완료하지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal title="저장한 버전" onClose={onClose}>
      <p className="b-dialog-intro">
        중요한 시점의 디자인을 최대 20개 보관합니다. 복원 후에도 실행 취소로
        돌아갈 수 있습니다. 버전은 이 브라우저에만 저장됩니다.
      </p>
      <form
        className="b-checkpoint-form"
        onSubmit={(event) => {
          event.preventDefault();
          void change(async () => {
            await saveCheckpoint(project, name);
            setName("");
          });
        }}
      >
        <label className="b-field">
          버전 이름
          <input
            placeholder="예: 첫 번째 테마 시안"
            maxLength={80}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <button className="b-button b-button-primary" disabled={busy}>
          <Plus size={15} />
          현재 버전 저장
        </button>
      </form>
      {error && (
        <p className="builder-error" role="alert">
          {error}
        </p>
      )}
      <div className="b-checkpoints">
        {!items.length && (
          <p className="b-help">저장한 버전이 아직 없습니다.</p>
        )}
        {items.map((item) => (
          <article className="b-checkpoint" key={item.id}>
            <History size={17} />
            <div>
              <strong>{item.name}</strong>
              <small>
                {new Date(item.createdAt).toLocaleString("ko-KR")} ·{" "}
                {item.project.pages.length}개 페이지
              </small>
            </div>
            <button
              className="b-button"
              disabled={busy}
              onClick={() => {
                try {
                  const saved = parseProject(item.project);
                  onRestore(
                    editProject(project, (next) => {
                      next.name = saved.name;
                      next.pages = saved.pages;
                      next.nodes = saved.nodes;
                      next.theme = saved.theme;
                    }),
                  );
                  onClose();
                } catch (e) {
                  setError(
                    e instanceof Error ? e.message : "복원하지 못했습니다.",
                  );
                }
              }}
            >
              복원
            </button>
            <button
              className="b-icon"
              aria-label={`${item.name} 파일 백업`}
              onClick={() =>
                downloadFile(
                  `${item.name}.json`,
                  JSON.stringify(item.project, null, 2),
                  "application/json",
                )
              }
            >
              <Download size={16} />
            </button>
            <button
              className="b-icon"
              disabled={busy}
              aria-label={`${item.name} 버전 삭제`}
              onClick={() => void change(() => deleteCheckpoint(item.id))}
            >
              <Trash2 size={16} />
            </button>
          </article>
        ))}
      </div>
    </Modal>
  );
}
