import { parseProject, type Project } from "./model";

const PREFIX = "prompt-studio:recovery:";
export type Recovery = {
  key: string;
  project: Project;
  baseVersion: string | null;
  savedAt: string;
};

export function recoveryKey(projectId: string, sessionId: string) {
  return `${PREFIX}${projectId}:${sessionId}`;
}
export function writeRecovery(
  key: string,
  project: Project,
  baseVersion: string | null,
) {
  localStorage.setItem(
    key,
    JSON.stringify({ project, baseVersion, savedAt: new Date().toISOString() }),
  );
}
export function clearRecovery(key: string) {
  localStorage.removeItem(key);
}

export function recoveryBackup(): {
  records: Record<string, string>;
  error?: string;
} {
  const records: Record<string, string> = {};
  try {
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      if (key?.startsWith(PREFIX)) {
        const raw = localStorage.getItem(key);
        if (raw !== null) records[key] = raw;
      }
    }
    return { records };
  } catch {
    return {
      records,
      error: "복구 저장소에 접근하지 못해 일부 자료가 빠졌을 수 있습니다.",
    };
  }
}

// Each editor session owns one key. Listing also recognizes the first release's
// single-project key, so an upgrade never discards an unsaved older draft.
export function readRecoveries(projectId?: string): Recovery[] {
  const found: Recovery[] = [];
  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);
    if (!key?.startsWith(PREFIX)) continue;
    if (
      projectId &&
      key !== `${PREFIX}${projectId}` &&
      !key.startsWith(`${PREFIX}${projectId}:`)
    )
      continue;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const data = JSON.parse(raw);
      const project = parseProject(data.project);
      if (projectId && project.id !== projectId) continue;
      found.push({
        key,
        project,
        baseVersion:
          typeof data.baseVersion === "string" ? data.baseVersion : null,
        savedAt:
          typeof data.savedAt === "string" ? data.savedAt : project.updatedAt,
      });
    } catch {
      /* Leave malformed records untouched for storage backup. */
    }
  }
  return found.sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}
