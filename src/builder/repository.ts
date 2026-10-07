import { parseProject, type Project } from "./model";
import { recoveryBackup } from "./recovery";

export type StoredProject = { project: Project; version: string };
const DATABASE = "prompt-studio-projects-v2";
export class SaveConflict extends Error {
  constructor() {
    super(
      "다른 탭에서 저장한 변경 사항이 있습니다. 최신 버전을 열거나 현재 작업을 파일로 백업하세요.",
    );
  }
}
export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    let request: IDBOpenDBRequest;
    try {
      request = indexedDB.open(DATABASE, 3);
    } catch {
      reject(
        new Error(
          "브라우저 저장소를 사용할 수 없습니다. 저장소 접근 설정을 확인하세요.",
        ),
      );
      return;
    }
    let abandoned = false;
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains("projects"))
        request.result.createObjectStore("projects", { keyPath: "project.id" });
      if (!request.result.objectStoreNames.contains("checkpoints"))
        request.result.createObjectStore("checkpoints", { keyPath: "id" });
      if (!request.result.objectStoreNames.contains("assets"))
        request.result.createObjectStore("assets", { keyPath: "id" });
    };
    request.onsuccess = () => {
      if (abandoned) {
        request.result.close();
        return;
      }
      request.result.onversionchange = () => request.result.close();
      resolve(request.result);
    };
    request.onerror = () => {
      abandoned = true;
      reject(
        new Error("브라우저 저장소를 열 수 없습니다. 파일 백업을 사용하세요."),
      );
    };
    request.onblocked = () => {
      abandoned = true;
      reject(new Error("다른 탭을 닫고 다시 시도하세요."));
    };
  });
}
function transaction(
  db: IDBDatabase,
  stores: string | string[],
  mode: IDBTransactionMode,
) {
  try {
    return db.transaction(stores, mode);
  } catch {
    db.close();
    throw new Error(
      "브라우저 저장소를 사용할 수 없습니다. 파일 백업을 내려받고 저장 공간과 브라우저 설정을 확인하세요.",
    );
  }
}
export async function listProjects(): Promise<{
  records: StoredProject[];
  unreadable: number;
}> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = transaction(db, "projects", "readonly");
    const request = tx.objectStore("projects").getAll();
    tx.oncomplete = () => {
      db.close();
      const records: StoredProject[] = [];
      let unreadable = 0;
      for (const item of request.result) {
        try {
          if (typeof item.version !== "string")
            throw new Error("Invalid version");
          records.push({
            project: parseProject(item.project),
            version: item.version,
          });
        } catch {
          unreadable++;
        }
      }
      records.sort((a, b) =>
        b.project.updatedAt.localeCompare(a.project.updatedAt),
      );
      resolve({ records, unreadable });
    };
    tx.onabort = () => {
      db.close();
      reject(
        new Error("프로젝트 목록을 읽지 못했습니다. 잠시 후 다시 시도하세요."),
      );
    };
  });
}
export async function backupLibrary(): Promise<string> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = transaction(db, ["projects", "checkpoints"], "readonly");
    const projects = tx.objectStore("projects").getAll();
    const checkpoints = tx.objectStore("checkpoints").getAll();
    tx.oncomplete = () => {
      db.close();
      resolve(
        JSON.stringify(
          {
            format: "prompt-studio-library-backup",
            projects: projects.result,
            checkpoints: checkpoints.result,
            recovery: recoveryBackup(),
          },
          null,
          2,
        ),
      );
    };
    tx.onabort = () => {
      db.close();
      reject(new Error("저장소 백업을 만들지 못했습니다."));
    };
  });
}

export type Checkpoint = {
  id: string;
  projectId: string;
  name: string;
  createdAt: string;
  project: Project;
};
export async function listCheckpoints(
  projectId: string,
): Promise<Checkpoint[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = transaction(db, "checkpoints", "readonly");
    const request = tx.objectStore("checkpoints").getAll();
    tx.oncomplete = () => {
      db.close();
      resolve(
        (request.result as Checkpoint[])
          .filter((c) => c.projectId === projectId)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      );
    };
    tx.onabort = () => {
      db.close();
      reject(new Error("버전 목록을 불러오지 못했습니다."));
    };
  });
}
export async function saveCheckpoint(
  project: Project,
  name: string,
): Promise<void> {
  parseProject(project);
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = transaction(db, "checkpoints", "readwrite");
    const store = tx.objectStore("checkpoints");
    const request = store.getAll();
    let full = false;
    request.onsuccess = () => {
      if (
        request.result.filter((c: Checkpoint) => c.projectId === project.id)
          .length >= 20
      ) {
        full = true;
        tx.abort();
        return;
      }
      store.put({
        id: crypto.randomUUID(),
        projectId: project.id,
        project,
        name: name.trim().slice(0, 80) || "저장한 버전",
        createdAt: new Date().toISOString(),
      });
    };
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onabort = () => {
      db.close();
      reject(
        new Error(
          full
            ? "프로젝트당 20개 버전을 보관할 수 있습니다. 이전 버전을 삭제하고 다시 시도하세요."
            : "버전을 저장하지 못했습니다. 파일 백업을 사용하세요.",
        ),
      );
    };
  });
}
export async function deleteCheckpoint(id: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = transaction(db, "checkpoints", "readwrite");
    tx.objectStore("checkpoints").delete(id);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onabort = () => {
      db.close();
      reject(new Error("버전을 삭제하지 못했습니다."));
    };
  });
}
export async function saveProject(
  project: Project,
  expectedVersion: string | null,
): Promise<string> {
  parseProject(project);
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = transaction(db, ["projects", "checkpoints"], "readwrite");
    const store = tx.objectStore("projects");
    const request = store.get(project.id);
    const version = crypto.randomUUID();
    let conflict = false;
    request.onsuccess = () => {
      if ((request.result?.version ?? null) !== expectedVersion) {
        conflict = true;
        tx.abort();
      } else {
        // The backup and upgrade commit atomically; a failed write preserves v2.
        if ([2, 3, 4].includes(request.result?.project?.schemaVersion)) {
          tx.objectStore("checkpoints").put({
            id: `v${request.result.project.schemaVersion}-backup-${project.id}`,
            projectId: project.id,
            project: request.result.project,
            name: "디자인 확장 전 원본",
            createdAt: new Date().toISOString(),
          });
        }
        store.put({ project, version });
      }
    };
    tx.oncomplete = () => {
      db.close();
      resolve(version);
    };
    tx.onabort = () => {
      db.close();
      reject(
        conflict
          ? new SaveConflict()
          : new Error(
              "저장하지 못했습니다. 저장 공간과 브라우저 설정을 확인하세요.",
            ),
      );
    };
    tx.onerror = () => {
      /* onabort supplies a single actionable error. */
    };
  });
}
export async function deleteProject(
  id: string,
  expectedVersion: string,
): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = transaction(db, ["projects", "checkpoints"], "readwrite");
    const store = tx.objectStore("projects");
    const request = store.get(id);
    let conflict = false;
    request.onsuccess = () => {
      if (request.result?.version !== expectedVersion) {
        conflict = true;
        tx.abort();
      } else {
        store.delete(id);
        const checkpointStore = tx.objectStore("checkpoints");
        const checkpoints = checkpointStore.getAll();
        checkpoints.onsuccess = () => {
          for (const checkpoint of checkpoints.result as Checkpoint[])
            if (checkpoint.projectId === id)
              checkpointStore.delete(checkpoint.id);
        };
      }
    };
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onabort = () => {
      db.close();
      reject(conflict ? new SaveConflict() : new Error("삭제하지 못했습니다."));
    };
  });
}
