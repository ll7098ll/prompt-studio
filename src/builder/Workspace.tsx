"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Download,
  Layers,
  LoaderCircle,
  MoreHorizontal,
  Plus,
  Search,
  Upload,
  X,
} from "lucide-react";
import { createTemplate, TEMPLATES } from "./templates";
import { parseProjectText, uid, type Project } from "./model";
import { readRecoveries, clearRecovery, type Recovery } from "./recovery";
import {
  deleteProject,
  backupLibrary,
  listProjects,
  saveProject,
  type StoredProject,
} from "./repository";
import { downloadFile } from "./export";
import Editor from "./Editor";
import Modal from "./Modal";
import TemplatePreview from "./TemplatePreview";
import TemplateThumbnail from "./TemplateThumbnail";
import type { TemplateInfo } from "./template-recipes";

export default function Workspace() {
  const [records, setRecords] = useState<StoredProject[]>([]);
  const [active, setActive] = useState<StoredProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [unreadable, setUnreadable] = useState(0);
  const [query, setQuery] = useState("");
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [templatePreview, setTemplatePreview] = useState<TemplateInfo | null>(
    null,
  );
  const [templateCategory, setTemplateCategory] = useState("전체");
  const [manage, setManage] = useState<StoredProject | null>(null);
  const [recovery, setRecovery] = useState<{
    stored: StoredProject | null;
    drafts: Recovery[];
    selected: number;
  } | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const refresh = async () => {
    try {
      const library = await listProjects();
      setRecords(library.records);
      setUnreadable(library.unreadable);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장소를 읽지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    let cancelled = false;
    void listProjects().then(
      (items) => {
        if (!cancelled) {
          setRecords(items.records);
          setUnreadable(items.unreadable);
          setLoading(false);
        }
      },
      (e) => {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "저장소를 읽지 못했습니다.",
          );
          setLoading(false);
        }
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);
  async function create(
    template: string,
    source?: Project,
    recoveredKey?: string,
  ) {
    setCreating(true);
    try {
      const project = source
        ? {
            ...structuredClone(source),
            id: uid("project"),
            name: `${source.name} 사본`.slice(0, 100),
            revision: 0,
            updatedAt: new Date().toISOString(),
          }
        : createTemplate(template);
      const version = await saveProject(project, null);
      if (recoveredKey) {
        try {
          clearRecovery(recoveredKey);
        } catch {
          /* The saved copy remains safe. */
        }
      }
      setActive({ project, version });
      setTemplatesOpen(false);
      setTemplatePreview(null);
      setRecovery(null);
      setManage(null);
      setError("");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "프로젝트를 만들지 못했습니다.",
      );
    } finally {
      setCreating(false);
    }
  }
  function open(record: StoredProject) {
    try {
      const drafts = readRecoveries(record.project.id).filter(
        (draft) =>
          JSON.stringify(draft.project) !== JSON.stringify(record.project),
      );
      if (drafts.length) {
        setRecovery({ stored: record, drafts, selected: 0 });
        return;
      }
    } catch {
      setError("복구 자료를 읽지 못했습니다. 마지막 저장 버전을 엽니다.");
    }
    setActive(record);
  }
  if (active)
    return (
      <Editor
        key={active.project.id}
        record={active}
        onHome={() => {
          setActive(null);
          void refresh();
        }}
      />
    );
  const filtered = records.filter((item) =>
    item.project.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <main className="builder-workspace">
      <header className="workspace-header">
        <div className="builder-wordmark">
          <span className="builder-logo">
            <Layers size={18} />
          </span>
          <span>
            prompt<span className="builder-wordmark-light">studio</span>
          </span>
          <span className="b-beta">PREVIEW</span>
        </div>
        <div className="workspace-header-right">
          <span>
            <Check size={13} />
            로그인 없이, 바로 시작
          </span>
          <button className="b-button" onClick={() => input.current?.click()}>
            <Upload size={15} />
            파일 열기
          </button>
          <button
            className="b-button"
            onClick={() => {
              try {
                setRecovery({
                  stored: null,
                  drafts: readRecoveries(),
                  selected: 0,
                });
                setError("");
              } catch {
                setError(
                  "브라우저의 복구 자료를 읽을 수 없습니다. 저장소 접근 설정을 확인하세요.",
                );
              }
            }}
          >
            복구 자료
          </button>
        </div>
      </header>
      <input
        type="file"
        accept="application/json,.json"
        hidden
        ref={input}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          try {
            if (file.size > 3_000_000)
              throw new Error("프로젝트 파일은 3MB 이하여야 합니다.");
            await create("blank", parseProjectText(await file.text()));
          } catch (err) {
            setError(
              err instanceof Error
                ? err.message
                : "올바른 프로젝트 파일이 아닙니다.",
            );
          } finally {
            e.target.value = "";
          }
        }}
      />
      <div className="workspace-content">
        {unreadable > 0 && (
          <div className="builder-error" role="alert">
            <span>
              읽을 수 없는 프로젝트 {unreadable}개가 있습니다. 원본은 보관되어
              있으며, 나머지 프로젝트는 계속 사용할 수 있습니다.
            </span>
            <button
              onClick={async () => {
                try {
                  downloadFile(
                    "studio-storage-recovery.json",
                    await backupLibrary(),
                    "application/json",
                  );
                } catch (e) {
                  setError(
                    e instanceof Error ? e.message : "백업하지 못했습니다.",
                  );
                }
              }}
            >
              원본 저장소 백업
            </button>
          </div>
        )}
        {error && (
          <div className="builder-error" role="alert">
            <span>{error}</span>
            <button onClick={() => void refresh()}>다시 시도</button>
            <button aria-label="오류 닫기" onClick={() => setError("")}>
              <X size={15} />
            </button>
          </div>
        )}
        <section className="workspace-intro">
          <div>
            <div className="workspace-eyebrow">
              <span />
              YOUR IDEAS, BEAUTIFULLY BUILT
            </div>
            <h1>
              생각하던 화면을,
              <br />
              <span>직접 만들어보세요.</span>
            </h1>
            <p>
              컴포넌트를 조립하고, 나만의 테마를 입히고.
              <br />
              완성한 디자인을 AI가 구현할 수 있는 설계로 전달하세요.
            </p>
            <button
              className="b-button b-button-primary workspace-start"
              onClick={() => setTemplatesOpen(true)}
            >
              <Plus size={16} />새 프로젝트
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="workspace-art" aria-hidden="true">
            <div className="workspace-art-dots" />
            <div className="workspace-art-back">
              <span />
              <span />
              <span />
            </div>
            <div className="workspace-art-front">
              <div className="workspace-art-bar">
                <i />
                <i />
                <i />
              </div>
              <div className="workspace-art-grid">
                <div className="workspace-art-menu">
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <div>
                  <div className="workspace-art-heading" />
                  <div className="workspace-art-line" />
                  <div className="workspace-art-cards">
                    <i />
                    <i />
                    <i />
                  </div>
                  <div className="workspace-art-chart">
                    {[25, 40, 32, 65, 52, 76, 88].map((n, i) => (
                      <i key={i} style={{ height: `${n}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="workspace-art-label">
              <PaletteDots />
              Your own design language
            </div>
          </div>
        </section>
        <section className="workspace-templates">
          <div className="workspace-section-heading">
            <div>
              <span className="workspace-kicker">A LITTLE HEAD START</span>
              <h2>좋은 시작을 골라보세요</h2>
            </div>
            <span>
              {TEMPLATES.length}가지 시작점 · 모든 요소를 바꿀 수 있어요
            </span>
          </div>
          <div className="workspace-template-filters" aria-label="프리셋 분류">
            {[
              "전체",
              "브랜드·소개",
              "앱·데이터",
              "스토어·콘텐츠",
              "빈 화면",
            ].map((category) => (
              <button
                key={category}
                aria-pressed={templateCategory === category}
                onClick={() => setTemplateCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="workspace-template-grid">
            {TEMPLATES.filter(
              (t) =>
                templateCategory === "전체" || t.category === templateCategory,
            ).map((template) => (
              <article className="workspace-template-card" key={template.id}>
                <button
                  className="workspace-template"
                  disabled={creating}
                  onClick={() => void create(template.id)}
                >
                  <div
                    className={`workspace-template-art template-${template.id}`}
                    style={{ background: template.color }}
                  >
                    <TemplateThumbnail id={template.id} name={template.name} />
                  </div>
                  <div className="workspace-template-copy">
                    <span>{template.tag}</span>
                    <h3>
                      {template.name}
                      <ArrowRight size={16} />
                    </h3>
                    <p>{template.description}</p>
                  </div>
                </button>
                <div className="workspace-template-detail">
                  <span>{template.trends.join(" · ") || "자유롭게 조립"}</span>
                  <button
                    onClick={() => setTemplatePreview(template)}
                    aria-label={`${template.name} 크게 보기`}
                  >
                    크게 보기
                  </button>
                </div>
              </article>
            ))}
          </div>
          <p className="workspace-trend-source">
            대형 타이포, 선명한 컬러, 다크 모드, 레트로와 콜라주까지.{" "}
            <a
              href="https://www.figma.com/ko-kr/resource-library/web-design-trends/"
              target="_blank"
              rel="noreferrer"
            >
              Figma의 웹 디자인 트렌드
            </a>
            에서 방향을 참고해 만든 편집 가능한 예시입니다.
          </p>
        </section>
        <section className="workspace-projects">
          <div className="workspace-section-heading">
            <div>
              <h2>
                내 프로젝트 <span>{records.length}</span>
              </h2>
              <p>이 브라우저에 저장됩니다. 중요한 작업은 파일로 백업하세요.</p>
            </div>
            <label className="b-search">
              <Search size={15} />
              <input
                aria-label="프로젝트 검색"
                placeholder="프로젝트 검색"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          </div>
          {loading ? (
            <div className="workspace-empty">
              <LoaderCircle className="b-spin" />
              <p>프로젝트를 불러오는 중…</p>
            </div>
          ) : filtered.length ? (
            <div className="workspace-project-grid">
              {filtered.map((record) => (
                <article className="workspace-project" key={record.project.id}>
                  <button
                    className="workspace-project-main"
                    onClick={() => open(record)}
                  >
                    <div
                      className="workspace-project-thumb"
                      style={{
                        background:
                          record.project.theme[record.project.theme.mode].soft,
                        color:
                          record.project.theme[record.project.theme.mode]
                            .primary,
                      }}
                    >
                      <MiniLayout
                        type={
                          Object.values(record.project.nodes).some(
                            (n) => n.component === "sidebar",
                          )
                            ? "dashboard"
                            : "landing"
                        }
                      />
                    </div>
                    <h3>{record.project.name}</h3>
                    <p>
                      {record.project.pages.length}개 페이지 ·{" "}
                      {new Intl.DateTimeFormat("ko-KR", {
                        month: "short",
                        day: "numeric",
                      }).format(new Date(record.project.updatedAt))}
                    </p>
                  </button>
                  <button
                    className="b-icon workspace-project-more"
                    aria-label={`${record.project.name} 관리`}
                    onClick={() => setManage(record)}
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="workspace-empty">
              <Layers size={28} />
              <h3>
                {query
                  ? "일치하는 프로젝트가 없어요"
                  : "첫 아이디어를 기다리고 있어요"}
              </h3>
              <p>
                {query
                  ? "다른 이름으로 검색해보세요."
                  : "위의 템플릿을 선택하면 바로 시작할 수 있습니다."}
              </p>
            </div>
          )}
        </section>
        <footer className="workspace-footer">
          <span>디자인의 결정은 당신이. 구현의 시작은 AI와 함께.</span>
          <span>Prompt Studio · 브라우저 작업 공간</span>
        </footer>
      </div>
      {templatesOpen && (
        <Modal
          title="어떤 화면을 만들까요?"
          onClose={() => setTemplatesOpen(false)}
        >
          <p className="b-dialog-intro">
            템플릿으로 시작하고, 모든 부분을 자유롭게 바꾸세요.
          </p>
          <div className="b-template-choices">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                disabled={creating}
                onClick={() => void create(t.id)}
              >
                <TemplateThumbnail id={t.id} name={t.name} />
                <span>
                  <strong>{t.name}</strong>
                  <small>{t.description}</small>
                </span>
                <ArrowRight size={17} />
              </button>
            ))}
          </div>
        </Modal>
      )}
      {templatePreview && (
        <TemplatePreview
          key={templatePreview.id}
          template={templatePreview}
          busy={creating}
          onClose={() => setTemplatePreview(null)}
          onStart={() => void create(templatePreview.id)}
        />
      )}
      {manage && (
        <Modal title="프로젝트 관리" onClose={() => setManage(null)}>
          <p className="b-dialog-intro">{manage.project.name}</p>
          <div className="b-template-choices">
            <button onClick={() => void create("blank", manage.project)}>
              <Plus size={19} />
              <span>
                <strong>사본 만들기</strong>
                <small>원본을 보존하고 다른 방향을 실험하세요</small>
              </span>
            </button>
            <button
              onClick={() =>
                downloadFile(
                  `${manage.project.name}.json`,
                  JSON.stringify(manage.project, null, 2),
                  "application/json",
                )
              }
            >
              <Download size={19} />
              <span>
                <strong>프로젝트 백업</strong>
                <small>JSON 파일로 보관하거나 다른 브라우저에서 열기</small>
              </span>
            </button>
          </div>
          <div className="b-delete-project">
            <p>프로젝트 삭제는 되돌릴 수 없습니다. 필요하면 먼저 백업하세요.</p>
            <button
              className="b-button b-danger"
              onClick={async () => {
                try {
                  await deleteProject(manage.project.id, manage.version);
                  setManage(null);
                  await refresh();
                } catch (e) {
                  setError(
                    e instanceof Error ? e.message : "삭제하지 못했습니다.",
                  );
                }
              }}
            >
              이 프로젝트 삭제
            </button>
          </div>
        </Modal>
      )}
      {recovery && (
        <Modal
          title={recovery.stored ? "저장되지 않은 작업이 있어요" : "복구 자료"}
          onClose={() => setRecovery(null)}
        >
          <p className="b-dialog-intro">
            {recovery.drafts.length
              ? "브라우저에 남은 미저장 작업입니다. 원본 프로젝트가 없어도 다운로드하거나 사본으로 복원할 수 있습니다."
              : "남아 있는 미저장 작업이 없습니다. 저장된 프로젝트는 목록에서 열 수 있습니다."}
          </p>
          {recovery.drafts.length > 0 && (
            <>
              <label className="b-field">
                복구본 선택
                <select
                  value={recovery.selected}
                  onChange={(event) =>
                    setRecovery({
                      ...recovery,
                      selected: Number(event.target.value),
                    })
                  }
                >
                  {recovery.drafts.map((draft, index) => (
                    <option key={draft.key} value={index}>
                      {draft.project.name} ·{" "}
                      {new Date(draft.savedAt).toLocaleString("ko-KR")}
                    </option>
                  ))}
                </select>
              </label>
              {error && (
                <p className="builder-error" role="alert">
                  {error}
                </p>
              )}
              <div className="b-dialog-actions">
                {recovery.stored && (
                  <button
                    className="b-button"
                    onClick={() => {
                      setActive(recovery.stored);
                      setRecovery(null);
                    }}
                  >
                    저장된 버전 열기
                  </button>
                )}
                <button
                  className="b-button"
                  onClick={() =>
                    downloadFile(
                      "recovery.json",
                      JSON.stringify(
                        recovery.drafts[recovery.selected].project,
                        null,
                        2,
                      ),
                      "application/json",
                    )
                  }
                >
                  복구본 다운로드
                </button>
                <button
                  className="b-button b-button-primary"
                  disabled={creating}
                  onClick={() =>
                    void create(
                      "blank",
                      recovery.drafts[recovery.selected].project,
                      recovery.drafts[recovery.selected].key,
                    )
                  }
                >
                  복구본을 사본으로 열기
                </button>
              </div>
            </>
          )}
        </Modal>
      )}
    </main>
  );
}
function PaletteDots() {
  return (
    <span className="workspace-palette">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}
function MiniLayout({ type }: { type: string }) {
  return type === "blank" ? (
    <div className="mini-blank">
      <Plus size={28} strokeWidth={1} />
    </div>
  ) : (
    <div className={`mini-layout mini-${type}`}>
      <div className="mini-nav">
        <i />
        <i />
        <i />
      </div>
      <div className="mini-body">
        {type !== "landing" && (
          <div className="mini-sidebar">
            <i />
            <i />
            <i />
            <i />
          </div>
        )}
        <div className="mini-main">
          <div className="mini-title" />
          <div className="mini-text" />
          {type === "settings" ? (
            <div className="mini-fields">
              <i />
              <i />
              <i />
            </div>
          ) : (
            <div className="mini-cards">
              <i />
              <i />
              <i />
            </div>
          )}
          <div className="mini-text" />
        </div>
      </div>
    </div>
  );
}
