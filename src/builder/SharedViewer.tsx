"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Layers,
  Monitor,
  Tablet,
  Smartphone,
  Copy,
  Download,
  LoaderCircle,
} from "lucide-react";
import { decodeShare } from "./share";
import { uid, type Project, type Viewport } from "./model";
import { saveProject } from "./repository";
import { downloadFile } from "./export";
import PreviewFrame from "./PreviewFrame";

export default function SharedViewer() {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState("");
  const [pageId, setPageId] = useState("");
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    let disposed = false;
    let sequence = 0;
    const read = () => {
      const request = ++sequence;
      setProject(null);
      setError("");
      void decodeShare(window.location.hash).then(
        (p) => {
          if (!disposed && request === sequence) {
            setProject(p);
            setPageId(p.pages[0].id);
            setError("");
          }
        },
        () => {
          if (!disposed && request === sequence)
            setError(
              "링크가 손상되었거나 지원하지 않는 버전입니다. 전체 링크를 다시 확인해주세요.",
            );
        },
      );
    };
    read();
    window.addEventListener("hashchange", read);
    return () => {
      disposed = true;
      window.removeEventListener("hashchange", read);
    };
  }, []);
  return (
    <main className="builder builder-shared">
      <header className="builder-topbar">
        <Link href="/" className="builder-wordmark">
          <span className="builder-logo">
            <Layers size={17} />
          </span>
          promptstudio
        </Link>
        <div className="builder-top-actions">
          {project && (
            <>
              <button
                className="b-button"
                onClick={() =>
                  downloadFile(
                    `${project.name}.json`,
                    JSON.stringify(project, null, 2),
                    "application/json",
                  )
                }
              >
                <Download size={15} />
                파일 백업
              </button>
              <button
                className="b-button b-button-primary"
                disabled={saving}
                onClick={async () => {
                  setSaving(true);
                  try {
                    const copy = {
                      ...structuredClone(project),
                      id: uid("project"),
                      name: `${project.name} 사본`.slice(0, 100),
                      revision: 0,
                      updatedAt: new Date().toISOString(),
                    };
                    await saveProject(copy, null);
                    router.push("/");
                  } catch {
                    setError(
                      "이 브라우저에 저장하지 못했습니다. 파일로 다운로드해 주세요.",
                    );
                    setSaving(false);
                  }
                }}
              >
                {saving ? <LoaderCircle size={15} /> : <Copy size={15} />}내
                브라우저에 복사
              </button>
            </>
          )}
        </div>
      </header>
      {error && (
        <div className="builder-error" role="alert">
          {error}
          <Link href="/">스튜디오 열기</Link>
        </div>
      )}
      {project ? (
        <section className="builder-canvas">
          <div className="builder-canvas-toolbar">
            <div className="b-canvas-breadcrumb">
              <b>{project.name}</b>
              <span>공유된 스냅샷 · 읽기 전용</span>
            </div>
            <select
              aria-label="공유 페이지 선택"
              value={pageId}
              onChange={(e) => setPageId(e.target.value)}
            >
              {project.pages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <div className="b-viewport-group">
              {(
                [
                  { id: "desktop", label: "데스크톱", Icon: Monitor },
                  { id: "tablet", label: "태블릿", Icon: Tablet },
                  { id: "mobile", label: "모바일", Icon: Smartphone },
                ] as const
              ).map(({ id, label, Icon }) => (
                <button
                  key={id}
                  aria-label={label}
                  aria-pressed={viewport === id}
                  className={viewport === id ? "active" : ""}
                  onClick={() => setViewport(id)}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
          <PreviewFrame
            project={project}
            pageId={pageId}
            viewport={viewport}
            selected={null}
            onSelect={() => {}}
            preview
            zoom={0}
          />
          <div className="builder-statusbar">
            링크를 만든 시점의 디자인입니다. 이후 원본 수정은 반영되지 않습니다.
          </div>
        </section>
      ) : (
        !error && (
          <div className="workspace-empty">
            <LoaderCircle className="b-spin" />
            공유된 디자인을 여는 중…
          </div>
        )
      )}
    </main>
  );
}
