"use client";

import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Code2,
  Download,
  Eye,
  File,
  FolderOpen,
  Grid2X2,
  Layers,
  LayoutTemplate,
  LoaderCircle,
  Monitor,
  MousePointer2,
  Palette,
  Plus,
  Redo2,
  Search,
  Smartphone,
  Tablet,
  Undo2,
  X,
  GripVertical,
  Type,
  Square,
  Columns3,
  Sparkles,
  LockKeyhole,
  EyeOff,
  Share2,
  History,
  Image as ImageIcon,
} from "lucide-react";
import { CATALOG, CATEGORIES, DEFINITIONS, type Definition } from "./catalog";
import {
  createNode,
  descendants,
  duplicateNode,
  editProject,
  isLocked,
  moveNode,
  parentId,
  removeNode,
} from "./model";
import { appendPage, TEMPLATES } from "./templates";
import TemplateThumbnail from "./TemplateThumbnail";
import type { StoredProject } from "./repository";
import { downloadFile, exportBundle, generatePrompt } from "./export";
import { encodeShare } from "./share";
import { useEditor } from "./use-editor";
import PreviewFrame from "./PreviewFrame";
import Inspector, { ThemePanel } from "./Inspector";
import Modal from "./Modal";
import Checkpoints from "./Checkpoints";
import NumberInput from "./NumberInput";
import ComponentThumbnail from "./ComponentThumbnail";
import { componentHelp, componentExample } from "./library";
import {
  VIEWPORT_WIDTH,
  viewportForWidth,
  MIN_VIEWPORT_WIDTH,
  MAX_VIEWPORT_WIDTH,
} from "./viewport";

const tileIcon = (def: Definition) =>
  def.category === "구조"
    ? Columns3
    : def.id === "heading" || def.id === "text"
      ? Type
      : def.category === "화면 구역"
        ? LayoutTemplate
        : def.category === "패턴"
          ? Grid2X2
          : Square;

export default function Editor({
  record,
  onHome,
}: {
  record: StoredProject;
  onHome: () => void;
}) {
  const {
    project,
    commit,
    canUndo,
    canRedo,
    undo,
    redo,
    status,
    saveError,
    save,
    saveCopy,
  } = useEditor(record);
  const [pageId, setPageId] = useState(project.pages[0].id);
  const page = project.pages.find((p) => p.id === pageId) ?? project.pages[0];
  const [selected, setSelected] = useState<string | null>(null);
  const selectedNode = selected ? project.nodes[selected] : undefined;
  const [tab, setTab] = useState<"library" | "layers" | "theme">("library");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("전체");
  const [canvasWidth, setCanvasWidth] = useState<number>(
    VIEWPORT_WIDTH.desktop,
  );
  const viewport = viewportForWidth(canvasWidth);
  const [preview, setPreview] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [exportOpen, setExportOpen] = useState(false);
  const [checkpointsOpen, setCheckpointsOpen] = useState(false);
  const [pageModal, setPageModal] = useState(false);
  const [deletePageOpen, setDeletePageOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState("");
  const cancelExport = useRef(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const dragging = useRef<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [showInspector, setShowInspector] = useState(false);
  const [libraryPreview, setLibraryPreview] = useState<string | null>(null);
  const libraryExample = useMemo(
    () =>
      libraryPreview ? componentExample(libraryPreview, project.theme) : null,
    [libraryPreview, project.theme],
  );
  const filtered = CATALOG.filter(
    (d) =>
      d.id !== "page" &&
      (category === "전체" || d.category === category) &&
      `${d.name} ${d.id} ${d.description} ${componentHelp(d.id).label} ${componentHelp(d.id).summary}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const count = descendants(project, page.rootId).length - 1;
  const prompt = useMemo(
    () => (exportOpen ? generatePrompt(project) : ""),
    [exportOpen, project],
  );
  const safe = (operation: () => void) => {
    try {
      operation();
      setMessage("");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "작업을 완료하지 못했습니다.",
      );
    }
  };
  const select = (id: string) => {
    setSelected(id);
    setShowInspector(true);
  };
  function add(def: Definition) {
    safe(() => {
      const target =
        selectedNode && DEFINITIONS[selectedNode.component].container
          ? selectedNode.id
          : selected
            ? (parentId(project, selected) ?? page.rootId)
            : page.rootId;
      if (isLocked(project, target))
        throw new Error("잠금을 해제하거나 다른 영역을 선택하세요.");
      const node = createNode(def.id);
      commit(
        editProject(project, (next) => {
          next.nodes[node.id] = node;
          next.nodes[target].children.push(node.id);
        }),
      );
      select(node.id);
    });
  }
  const duplicate = () => {
    if (!selected) return;
    safe(() => {
      const result = duplicateNode(project, selected);
      commit(result.project);
      select(result.id);
    });
  };
  const remove = () => {
    if (!selected) return;
    safe(() => {
      const parent = parentId(project, selected);
      commit(removeNode(project, selected));
      setSelected(parent ?? null);
    });
  };
  const move = (target: string, index: number) => {
    if (selected)
      safe(() => commit(moveNode(project, selected, target, index)));
  };
  function keyboard(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (
      event.nativeEvent.isComposing ||
      target.closest("input,textarea,select,[contenteditable=true]")
    )
      return;
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
      event.preventDefault();
      if (event.shiftKey) redo();
      else undo();
    }
    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "d" &&
      selected
    ) {
      event.preventDefault();
      duplicate();
    }
    if (
      (event.key === "Delete" || event.key === "Backspace") &&
      selected &&
      !preview
    ) {
      event.preventDefault();
      remove();
    }
    if (event.key === "Escape") {
      setSelected(null);
      setShowInspector(false);
    }
  }
  function layer(id: string, depth = 0) {
    const node = project.nodes[id];
    const closed = collapsed.has(id);
    const Icon = tileIcon(DEFINITIONS[node.component]);
    return (
      <div key={id}>
        <div
          className={`b-layer ${selected === id ? "selected" : ""} ${dropTarget === id ? "drop-target" : ""}`}
          style={{ paddingLeft: 8 + depth * 13 }}
          draggable={id !== page.rootId && !isLocked(project, id)}
          onDragStart={(e) => {
            dragging.current = id;
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", id);
          }}
          onDragOver={(e) => {
            if (dragging.current && dragging.current !== id) {
              e.preventDefault();
              setDropTarget(id);
            }
          }}
          onDragLeave={() => setDropTarget(null)}
          onDragEnd={() => {
            dragging.current = null;
            setDropTarget(null);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setDropTarget(null);
            if (!dragging.current) return;
            const target = DEFINITIONS[node.component].container
              ? id
              : parentId(project, id);
            if (target)
              safe(() =>
                commit(
                  moveNode(
                    project,
                    dragging.current!,
                    target,
                    DEFINITIONS[node.component].container
                      ? node.children.length
                      : project.nodes[target].children.indexOf(id),
                  ),
                ),
              );
            dragging.current = null;
          }}
        >
          {node.children.length ? (
            <button
              className="b-layer-expand"
              aria-label={`${node.name} ${closed ? "펼치기" : "접기"}`}
              onClick={() =>
                setCollapsed((prev) => {
                  const next = new Set(prev);
                  if (next.has(id)) next.delete(id);
                  else next.add(id);
                  return next;
                })
              }
            >
              {closed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
            </button>
          ) : (
            <span className="b-layer-spacer" />
          )}
          <button
            className="b-layer-select"
            aria-pressed={selected === id}
            onClick={() => select(id)}
          >
            <Icon size={14} />
            <span>{node.name}</span>
            {node.locked && <LockKeyhole size={11} />}
            {node.hidden && <EyeOff size={11} />}
          </button>
          {id !== page.rootId && (
            <GripVertical size={11} className="b-layer-grip" />
          )}
        </div>
        {!closed && node.children.map((child) => layer(child, depth + 1))}
      </div>
    );
  }
  return (
    <main
      className={`builder ${preview ? "builder-preview-mode" : ""}`}
      onKeyDown={keyboard}
    >
      <header className="builder-topbar">
        <div className="builder-top-left">
          <button
            className="b-icon"
            aria-label="프로젝트 목록"
            onClick={() => {
              void save()
                .then(onHome)
                .catch(() => {});
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <a
            className="builder-wordmark"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              void save()
                .then(onHome)
                .catch(() => {});
            }}
          >
            <span className="builder-logo">
              <Layers size={17} />
            </span>
            <span>
              prompt<span className="builder-wordmark-light">studio</span>
            </span>
          </a>
          <span className="b-top-divider" />
          <input
            className="b-project-name"
            aria-label="프로젝트 이름"
            value={project.name}
            maxLength={100}
            onChange={(e) => {
              if (e.target.value.trim())
                commit(
                  editProject(project, (next) => {
                    next.name = e.target.value;
                  }),
                  "project-name",
                );
            }}
          />
          <span className={`b-save-state ${saveError ? "error" : ""}`}>
            <span />
            {status}
          </span>
        </div>
        <div className="builder-top-actions">
          <button
            className="b-icon"
            aria-label="저장한 버전"
            title="저장한 버전"
            onClick={() => setCheckpointsOpen(true)}
          >
            <History size={17} />
          </button>
          <button
            className="b-icon"
            disabled={!canUndo}
            onClick={undo}
            aria-label="실행 취소"
            title="실행 취소 · Ctrl+Z"
          >
            <Undo2 size={17} />
          </button>
          <button
            className="b-icon"
            disabled={!canRedo}
            onClick={redo}
            aria-label="다시 실행"
            title="다시 실행 · Ctrl+Shift+Z"
          >
            <Redo2 size={17} />
          </button>
          <span className="b-top-divider" />
          <button
            className="b-button b-share-button"
            onClick={async () => {
              try {
                setShareUrl(
                  `${window.location.origin}/view/${await encodeShare(project)}`,
                );
              } catch (error) {
                setMessage(
                  error instanceof Error
                    ? error.message
                    : "공유 링크를 만들지 못했습니다.",
                );
              }
            }}
          >
            <Share2 size={15} />
            공유
          </button>
          <button
            className={`b-button ${preview ? "b-button-selected" : ""}`}
            onClick={() => setPreview(!preview)}
          >
            {preview ? <MousePointer2 size={15} /> : <Eye size={15} />}
            {preview ? "편집으로 돌아가기" : "미리보기"}
          </button>
          <button
            className="b-button b-button-primary"
            onClick={() => setExportOpen(true)}
          >
            <Sparkles size={15} />
            AI에 전달
            <ArrowRight size={14} />
          </button>
        </div>
      </header>
      {(message || saveError) && (
        <div className="builder-error" role="alert">
          <span>{message || saveError}</span>
          {saveError && (
            <>
              <button
                onClick={() => {
                  void save().catch(() => {});
                }}
              >
                다시 저장
              </button>
              <button
                onClick={() => {
                  void saveCopy()
                    .then(onHome)
                    .catch((error) =>
                      setMessage(
                        error instanceof Error
                          ? error.message
                          : "사본을 저장하지 못했습니다.",
                      ),
                    );
                }}
              >
                사본 저장 후 목록으로
              </button>
              <button
                onClick={() =>
                  downloadFile(
                    `${project.name}.json`,
                    JSON.stringify(project, null, 2),
                    "application/json",
                  )
                }
              >
                파일 백업
              </button>
            </>
          )}
          {message && (
            <button aria-label="안내 닫기" onClick={() => setMessage("")}>
              <X size={14} />
            </button>
          )}
        </div>
      )}
      <div className="builder-body">
        {!preview && (
          <aside className="builder-library" aria-label="라이브러리">
            <div className="builder-page-selector">
              <File size={15} />
              <select
                aria-label="페이지 선택"
                value={page.id}
                onChange={(e) => {
                  setPageId(e.target.value);
                  setSelected(null);
                }}
              >
                {project.pages.map((p) => (
                  <option value={p.id} key={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <button
                className="b-icon"
                aria-label="페이지 추가"
                onClick={() => setPageModal(true)}
              >
                <Plus size={16} />
              </button>
            </div>
            <div
              className="builder-tabs"
              role="tablist"
              aria-label="편집 패널"
              onKeyDown={(event) => {
                const buttons = [
                  ...event.currentTarget.querySelectorAll<HTMLButtonElement>(
                    '[role="tab"]',
                  ),
                ];
                const index = buttons.indexOf(
                  event.target as HTMLButtonElement,
                );
                if (index < 0) return;
                const next =
                  event.key === "ArrowRight"
                    ? (index + 1) % buttons.length
                    : event.key === "ArrowLeft"
                      ? (index + buttons.length - 1) % buttons.length
                      : event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? buttons.length - 1
                          : -1;
                if (next >= 0) {
                  event.preventDefault();
                  buttons[next].focus();
                  buttons[next].click();
                }
              }}
            >
              <button
                role="tab"
                aria-selected={tab === "library"}
                tabIndex={tab === "library" ? 0 : -1}
                className={tab === "library" ? "active" : ""}
                onClick={() => setTab("library")}
              >
                <Grid2X2 size={14} />
                컴포넌트
              </button>
              <button
                role="tab"
                aria-selected={tab === "layers"}
                tabIndex={tab === "layers" ? 0 : -1}
                className={tab === "layers" ? "active" : ""}
                onClick={() => setTab("layers")}
              >
                <Layers size={14} />
                레이어
              </button>
              <button
                role="tab"
                aria-selected={tab === "theme"}
                tabIndex={tab === "theme" ? 0 : -1}
                className={tab === "theme" ? "active" : ""}
                onClick={() => setTab("theme")}
              >
                <Palette size={14} />
                테마
              </button>
            </div>
            <div className="builder-panel-scroll">
              {tab === "library" ? (
                <div className="builder-panel-content">
                  <div className="b-search">
                    <Search size={15} />
                    <input
                      placeholder="컴포넌트 검색…"
                      aria-label="컴포넌트 검색"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                      <button
                        className="b-icon"
                        aria-label="검색 지우기"
                        onClick={() => setQuery("")}
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                  <div className="b-categories">
                    {CATEGORIES.map((item) => (
                      <button
                        key={item}
                        className={category === item ? "active" : ""}
                        onClick={() => setCategory(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  <div className="b-library-heading">
                    <span>
                      {category === "전체" ? "컴포넌트 라이브러리" : category}
                    </span>
                    <span>{filtered.length}</span>
                  </div>
                  <div className="b-component-grid">
                    {filtered.map((def) => {
                      const help = componentHelp(def.id);
                      return (
                        <div className="b-component-card" key={def.id}>
                          <button
                            className="b-component-tile"
                            title={`${def.name} · ${help.summary}`}
                            aria-label={`${help.label} 추가`}
                            onClick={() => add(def)}
                          >
                            <span
                              className={`b-tile-visual b-tile-${def.category === "구조" ? "structure" : def.category === "화면 구역" ? "section" : "component"}`}
                            >
                              <ComponentThumbnail id={def.id} />
                              <Plus size={12} className="b-tile-plus" />
                            </span>
                            <span>{help.label}</span>
                          </button>
                          <p className="b-component-summary">{help.summary}</p>
                          <button
                            className="b-component-detail"
                            aria-label={`${help.label} 미리보기`}
                            onClick={() => setLibraryPreview(def.id)}
                          >
                            <Eye size={12} />
                            크게 보기
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  {!filtered.length && (
                    <div className="b-no-results">
                      <Search size={24} />
                      <p>검색 결과가 없어요.</p>
                      <button
                        onClick={() => {
                          setQuery("");
                          setCategory("전체");
                        }}
                      >
                        전체 컴포넌트 보기
                      </button>
                    </div>
                  )}
                  <div className="b-library-tip">
                    <Plus size={14} />
                    <p>
                      클릭하면 선택한 영역에 추가됩니다.
                      <br />
                      레이어에서 위치를 바꿀 수 있어요.
                    </p>
                  </div>
                </div>
              ) : tab === "theme" ? (
                <ThemePanel project={project} commit={commit} />
              ) : (
                <div className="b-layers-panel">
                  <div className="b-library-heading">
                    <span>페이지 구조</span>
                    <span>{count}개 요소</span>
                  </div>
                  {layer(page.rootId)}
                  <div className="b-layer-help">
                    끌어서 다른 영역에 넣거나
                    <br />
                    속성 패널에서 배치 위치를 선택하세요.
                  </div>
                  <div className="b-page-settings">
                    <label className="b-field">
                      페이지 이름
                      <input
                        value={page.name}
                        maxLength={100}
                        onChange={(e) => {
                          if (e.target.value.trim())
                            commit(
                              editProject(project, (next) => {
                                next.pages.find((p) => p.id === page.id)!.name =
                                  e.target.value;
                              }),
                              `page-name-${page.id}`,
                            );
                        }}
                      />
                    </label>
                    <label className="b-field">
                      페이지 경로
                      <input
                        key={page.id}
                        defaultValue={page.slug}
                        onBlur={(e) => {
                          if (e.target.value !== page.slug)
                            safe(() =>
                              commit(
                                editProject(project, (next) => {
                                  next.pages.find(
                                    (p) => p.id === page.id,
                                  )!.slug = e.target.value;
                                }),
                              ),
                            );
                        }}
                      />
                    </label>
                    <button
                      className="b-button b-button-small b-danger"
                      disabled={project.pages.length === 1}
                      onClick={() => setDeletePageOpen(true)}
                    >
                      페이지 삭제
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="builder-local-note">
              <Check size={12} />
              로그인 없이 · 이 브라우저에 저장
            </div>
          </aside>
        )}
        <section className="builder-canvas" aria-label="캔버스">
          <div className="builder-canvas-toolbar">
            <div className="b-canvas-breadcrumb">
              <FolderOpen size={14} />
              <span>{project.name}</span>
              <ChevronRight size={12} />
              <b>{page.name}</b>
            </div>
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
                  className={canvasWidth === VIEWPORT_WIDTH[id] ? "active" : ""}
                  aria-label={label}
                  aria-pressed={canvasWidth === VIEWPORT_WIDTH[id]}
                  onClick={() => setCanvasWidth(VIEWPORT_WIDTH[id])}
                >
                  <Icon size={16} />
                </button>
              ))}
              <label className="b-viewport-width">
                <NumberInput
                  aria-label="미리보기 너비"
                  value={canvasWidth}
                  min={MIN_VIEWPORT_WIDTH}
                  max={MAX_VIEWPORT_WIDTH}
                  onChange={setCanvasWidth}
                />
                <span>px</span>
              </label>
            </div>
            <div className="b-canvas-right">
              <select
                aria-label="캔버스 배율"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
              >
                <option value={0}>화면 맞춤</option>
                <option value={0.5}>50%</option>
                <option value={0.75}>75%</option>
                <option value={1}>100%</option>
              </select>
              {!preview && (
                <button
                  className="b-inspector-toggle b-icon"
                  aria-label="속성 패널"
                  onClick={() => setShowInspector(!showInspector)}
                >
                  <Columns3 size={17} />
                </button>
              )}
            </div>
          </div>
          <PreviewFrame
            project={project}
            pageId={page.id}
            viewport={viewport}
            width={canvasWidth}
            selected={selected}
            onSelect={select}
            preview={preview}
            zoom={zoom}
          />
          <div className="builder-statusbar">
            <span>
              <span className="b-status-dot" />
              {preview
                ? "미리보기 · UI를 직접 조작해보세요"
                : "편집 모드 · 요소를 클릭해 다듬어보세요"}
            </span>
            <span>
              {count}개 요소 · {project.pages.length}개 페이지
            </span>
          </div>
        </section>
        {!preview && (
          <aside
            className={`builder-inspector ${showInspector ? "is-open" : ""}`}
            aria-label="속성"
          >
            <div className="builder-inspector-heading">
              <strong>속성</strong>
              <span>{selectedNode ? "선택한 요소" : "선택 없음"}</span>
              <button
                className="b-icon b-inspector-close"
                aria-label="속성 패널 닫기"
                onClick={() => setShowInspector(false)}
              >
                <X size={16} />
              </button>
            </div>
            <div className="builder-panel-scroll">
              <Inspector
                project={project}
                node={selectedNode}
                viewport={viewport}
                commit={commit}
                onDuplicate={duplicate}
                onDelete={remove}
                onMove={move}
              />
            </div>
          </aside>
        )}
      </div>
      {checkpointsOpen && (
        <Checkpoints
          project={project}
          onRestore={commit}
          onClose={() => setCheckpointsOpen(false)}
        />
      )}
      {libraryPreview && libraryExample && (
        <Modal
          title={componentHelp(libraryPreview).label}
          wide
          onClose={() => setLibraryPreview(null)}
        >
          <p className="b-dialog-intro">
            {componentHelp(libraryPreview).summary} ·{" "}
            {DEFINITIONS[libraryPreview].name}
          </p>
          <div className="b-component-demo">
            <PreviewFrame
              project={libraryExample}
              pageId={libraryExample.pages[0].id}
              viewport={
                DEFINITIONS[libraryPreview].category === "화면 구역"
                  ? "desktop"
                  : "mobile"
              }
              selected={null}
              onSelect={() => {}}
              preview
              zoom={0}
              viewportHeight={380}
            />
          </div>
          <p className="b-help">
            실제로 눌러보세요. 추가한 뒤 문구·배치·테마를 바꿀 수 있습니다.
          </p>
          <div className="b-dialog-actions">
            <button
              className="b-button b-button-primary"
              onClick={() => {
                add(DEFINITIONS[libraryPreview]);
                setLibraryPreview(null);
              }}
            >
              <Plus size={15} />이 요소 추가
            </button>
          </div>
        </Modal>
      )}
      {exportOpen && (
        <Modal
          title="디자인을 AI에 전달하세요"
          onClose={() => {
            cancelExport.current = true;
            setExportOpen(false);
          }}
          wide
        >
          <p className="b-dialog-intro">
            직접 정한 구조와 디자인 값을 담았습니다. 외부 코딩 AI에 전달해 실제
            프론트엔드를 구현하세요.
          </p>
          <div className="b-export-summary">
            <span>
              <File size={16} />
              {project.pages.length}개 페이지
            </span>
            <span>
              <Layers size={16} />
              {Object.keys(project.nodes).length}개 요소
            </span>
            <span>
              <Palette size={16} />
              {project.theme.name}
            </span>
          </div>
          <label className="b-field">
            구현 프롬프트
            <textarea
              aria-label="구현 프롬프트"
              className="b-prompt-text"
              readOnly
              value={prompt}
              rows={12}
            />
          </label>
          <p className="b-help">
            ZIP에는 모든 페이지의 모바일·태블릿·데스크톱 기준 이미지와 디자인
            명세가 포함됩니다. 실제 앱 코드는 아니며, 목적지가 없는 버튼과 메뉴
            연결은 AI 구현 시 결정해야 합니다.
          </p>
          {exportStatus && (
            <p className="b-notice" role="status">
              {exportStatus}
            </p>
          )}
          <div className="b-dialog-actions">
            <button
              className="b-button"
              disabled={exporting}
              onClick={async () => {
                setExporting(true);
                setExportStatus("선택한 페이지의 이미지를 만들고 있어요…");
                try {
                  const { capturePage } = await import("./capture");
                  const data = await capturePage(project, page.id, canvasWidth);
                  const link = document.createElement("a");
                  link.href = data;
                  link.download = `${page.name}-${canvasWidth}px.png`;
                  link.click();
                  setExportStatus("이미지를 저장했습니다.");
                } catch (error) {
                  setExportStatus(
                    error instanceof Error
                      ? error.message
                      : "이미지를 만들지 못했습니다.",
                  );
                } finally {
                  setExporting(false);
                }
              }}
            >
              <ImageIcon size={15} />
              현재 화면 PNG
            </button>
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
              프로젝트 백업
            </button>
            <button
              className="b-button"
              disabled={exporting}
              onClick={async () => {
                setExporting(true);
                cancelExport.current = false;
                try {
                  const { capturePage } = await import("./capture");
                  const screenshots: Record<string, string> = {};
                  const started = Date.now();
                  let bytes = 0;
                  for (const targetPage of project.pages)
                    for (const view of [
                      "mobile",
                      "tablet",
                      "desktop",
                    ] as const) {
                      if (cancelExport.current)
                        throw new Error("내보내기를 취소했습니다.");
                      if (Date.now() - started > 120000 || bytes > 50_000_000)
                        throw new Error(
                          "전달 자료가 큽니다. 페이지를 나누거나 프로젝트 백업으로 전달하세요.",
                        );
                      setExportStatus(
                        `${targetPage.name} · ${view} 기준 이미지를 만드는 중…`,
                      );
                      const capture = await capturePage(
                        project,
                        targetPage.id,
                        view,
                      );
                      screenshots[`${targetPage.id}-${view}.png`] = capture;
                      bytes += capture.length * 0.75;
                    }
                  if (cancelExport.current)
                    throw new Error("내보내기를 취소했습니다.");
                  downloadFile(
                    `${project.name}-handoff.zip`,
                    await exportBundle(project, screenshots),
                  );
                  setExportStatus("이미지와 설계 자료를 저장했습니다.");
                } catch (error) {
                  setExportStatus(
                    error instanceof Error
                      ? error.message
                      : "전달 자료를 만들지 못했습니다. 다시 시도하세요.",
                  );
                } finally {
                  setExporting(false);
                }
              }}
            >
              {exporting ? (
                <LoaderCircle size={15} className="b-spin" />
              ) : (
                <Code2 size={15} />
              )}
              설계 파일 ZIP
            </button>
            <button
              className="b-button b-button-primary"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(prompt);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {
                  downloadFile("PROMPT.md", prompt);
                }
              }}
            >
              {copied ? <Check size={15} /> : <Sparkles size={15} />}
              {copied ? "복사했어요" : "프롬프트 복사"}
            </button>
          </div>
        </Modal>
      )}
      {shareUrl && (
        <Modal title="디자인 링크 공유" onClose={() => setShareUrl("")}>
          <p className="b-dialog-intro">
            현재 디자인을 읽기 전용으로 공유합니다. 링크를 받은 사람은 미리보고
            자신의 브라우저에 사본을 저장할 수 있습니다.
          </p>
          <label className="b-field">
            공유 링크
            <input
              aria-label="공유 링크"
              readOnly
              value={shareUrl}
              onFocus={(event) => event.target.select()}
            />
          </label>
          <p className="b-help">
            설계 내용이 링크 자체에 포함됩니다. 원본을 수정해도 이 링크는 바뀌지
            않으며, 이미 전달한 링크를 회수할 수 없습니다. 비공개 정보가 없는지
            확인해주세요.
          </p>
          <div className="b-dialog-actions">
            <a
              className="b-button"
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              공유 화면 열기
            </a>
            <button
              className="b-button b-button-primary"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(shareUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {
                  downloadFile("share-link.txt", shareUrl);
                }
              }}
            >
              {copied ? "복사했어요" : "링크 복사"}
            </button>
          </div>
        </Modal>
      )}
      {pageModal && (
        <Modal title="페이지 추가" onClose={() => setPageModal(false)}>
          <p className="b-dialog-intro">
            현재 프로젝트의 테마가 그대로 적용됩니다.
          </p>
          <div className="b-template-choices">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() =>
                  safe(() => {
                    const next = editProject(project, (p) =>
                      Object.assign(p, appendPage(p, t.id)),
                    );
                    commit(next);
                    setPageId(next.pages.at(-1)!.id);
                    setSelected(null);
                    setPageModal(false);
                  })
                }
              >
                <TemplateThumbnail id={t.id} name={t.name} />
                <span>
                  <strong>{t.name}</strong>
                  <small>{t.description}</small>
                </span>
                <Plus size={17} />
              </button>
            ))}
          </div>
        </Modal>
      )}
      {deletePageOpen && (
        <Modal
          title="이 페이지를 삭제할까요?"
          onClose={() => setDeletePageOpen(false)}
        >
          <p className="b-dialog-intro">
            {page.name} 페이지와 안의 요소가 삭제됩니다. 실행 취소로 되돌릴 수
            있습니다.
          </p>
          <div className="b-dialog-actions">
            <button
              className="b-button"
              onClick={() => setDeletePageOpen(false)}
            >
              취소
            </button>
            <button
              className="b-button b-button-primary"
              onClick={() => {
                const remaining = project.pages.filter((p) => p.id !== page.id);
                commit(
                  editProject(project, (next) => {
                    descendants(project, page.rootId).forEach(
                      (id) => delete next.nodes[id],
                    );
                    next.pages = remaining;
                  }),
                );
                setPageId(remaining[0].id);
                setSelected(null);
                setDeletePageOpen(false);
              }}
            >
              페이지 삭제
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
}
