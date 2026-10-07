"use client";
import { replaceRichRun } from "./rich-text";

import {
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
  type KeyboardEvent,
} from "react";
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
  editProject,
  isLocked,
  parentId,
  resolvedLayout,
  type Project,
  type Layout,
} from "./model";
import DesignPanel, { type DesignAction } from "./DesignPanel";
import {
  alignBoxes,
  applyBoxes,
  convertLayout,
  copyNodes,
  deleteNodes,
  editableRoots,
  groupNodes,
  pasteNodes,
  patchLayouts,
  reorderSelection,
  selectionRoots,
  ungroupNode,
  writeLayout,
  type ClipboardNodes,
} from "./design-commands";
import {
  boxInParent,
  elementSize,
  measureChildren,
  unionBox,
} from "./geometry";
import { detachComposite } from "./detach-composite";
import { relocateNode } from "./design-dom";
import PartsPanel, { type PartSelection } from "./PartsPanel";
import { populateRecipe } from "./component-recipes";
import {
  resolvedPart,
  partElement,
  partPath,
  boundTextChange,
} from "./component-parts";
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
import LiveThumbnail from "./LiveThumbnail";
import AppearancePanel from "./AppearancePanel";
import AssetPanel from "./AssetPanel";
import { assetRef } from "./asset-model";
import { exportProjectArchive } from "./project-archive";
import { DESIGN_FAMILIES, MOTIONS, type DesignFamily } from "./visual-presets";
import type { DropTarget } from "./drop-target";
import { changeBlockStructure } from "./block-variants";
import { beginLibraryDrag } from "./library-drag";
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
  const latestProject = useRef(project);
  useLayoutEffect(() => {
    latestProject.current = project;
  }, [project]);
  const [pageId, setPageId] = useState(project.pages[0].id);
  const page = project.pages.find((p) => p.id === pageId) ?? project.pages[0];
  const [selection, setSelection] = useState<string[]>([]);
  const [partSelection, setPartSelection] = useState<PartSelection>(null);
  const selected = selection.filter((id) => project.nodes[id]).at(-1) ?? null;
  const setSelected = (id: string | null) => {
    setSelection(id ? [id] : []);
    setPartSelection(null);
  };
  const canvasDocument = useRef<Document | null>(null);
  const [surfaceDocument, setSurfaceDocument] = useState<Document | null>(null);
  const clipboard = useRef<ClipboardNodes | null>(null);
  const nudgeGroup = useRef("");
  const [tool, setTool] = useState<"select" | "hand">("select");
  const [layoutPreview, setLayoutPreview] = useState<Project | null>(null);
  const selectedNode = selected ? project.nodes[selected] : undefined;
  const [tab, setTab] = useState<"library" | "layers" | "theme" | "assets">("library");
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
  const libraryDrag = useRef<(() => void) | null>(null),
    skipLibraryClick = useRef(false);
  useEffect(() => () => libraryDrag.current?.(), []);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [showInspector, setShowInspector] = useState(false);
  const [libraryPreview, setLibraryPreview] = useState<string | null>(null);
  const [libraryMode, setLibraryMode] = useState("all");
  const [libraryFamily, setLibraryFamily] = useState<DesignFamily | "legacy">(
    "legacy",
  );
  const [librarySource, setLibrarySource] = useState("all");
  const [tileLimit, setTileLimit] = useState(24);
  const [replay, setReplay] = useState(0);
  const [libraryWidth, setLibraryWidth] = useState(768);
  const [libraryState, setLibraryState] = useState("default");
  const [structurePreview, setStructurePreview] = useState<Project | null>(
    null,
  );
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("studio-favorites") ?? "[]");
    } catch {
      return [];
    }
  });
  const [recent, setRecent] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("studio-recent") ?? "[]");
    } catch {
      return [];
    }
  });
  const [myBlocks, setMyBlocks] = useState<
    { id: string; name: string; data: ClipboardNodes }[]
  >(() => {
    try {
      return JSON.parse(localStorage.getItem("studio-my-blocks") ?? "[]");
    } catch {
      return [];
    }
  });
  const libraryExample = useMemo(
    () =>
      libraryPreview
        ? (() => {
            const p = componentExample(libraryPreview, project.theme);
            const state = DEFINITIONS[libraryPreview].fields.find(
              (field) => field.key === "state",
            );
            if (state?.options?.includes(libraryState))
              p.nodes[p.nodes[p.pages[0].rootId].children[0]].props.state =
                libraryState;
            p.nodes[p.nodes[p.pages[0].rootId].children[0]].appearance = {
              family: libraryFamily,
            };
            return p;
          })()
        : null,
    [libraryPreview, project.theme, libraryFamily, libraryState],
  );
  const filtered = CATALOG.filter(
    (d) =>
      d.id !== "page" &&
      (libraryMode === "all" ||
        (libraryMode === "basic" &&
          ["기본 요소", "구조"].includes(d.category)) ||
        (libraryMode === "components" &&
          !["기본 요소", "구조", "블록", "장면"].includes(d.category)) ||
        (libraryMode === "blocks" && d.category === "블록") ||
        (libraryMode === "scenes" && d.category === "장면") ||
        (libraryMode === "favorites" && favorites.includes(d.id)) ||
        (libraryMode === "recent" && recent.includes(d.id))) &&
      (librarySource === "all" ||
        (librarySource === "shadcn" && d.source?.includes("shadcn")) ||
        (librarySource === "studio" && !d.source?.includes("shadcn"))) &&
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
      setMessage("");
      operation();
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
  function add(def: Definition, drop?: DropTarget, props?: Definition["defaults"]) {
    safe(() => {
      const target =
        drop?.parent ??
        (selectedNode && DEFINITIONS[selectedNode.component].container
          ? selectedNode.id
          : selected
            ? (parentId(project, selected) ?? page.rootId)
            : page.rootId);
      if (isLocked(project, target))
        throw new Error("잠금을 해제하거나 다른 영역을 선택하세요.");
      const node = createNode(def.id);
      if (props) Object.assign(node.props, props);
      node.appearance = {
        family: libraryFamily,
        ...(libraryFamily === "legacy" ? {} : { renderer: "shadcn" as const }),
      };
      if (resolvedLayout(project.nodes[target], viewport).mode === "free") {
        const parentElement = canvasDocument.current?.getElementById(target);
        const size = parentElement
          ? elementSize(parentElement)
          : { width: 800, height: 480 };
        node.layout = {
          ...node.layout,
          x: drop?.x ?? 32 + (project.nodes[target].children.length % 8) * 24,
          y: drop?.y ?? 32 + (project.nodes[target].children.length % 8) * 24,
          widthMode: "fixed",
          width: def.id === "heading" ? 360 : 240,
          basisWidth: Math.max(1, size.width),
          basisHeight: Math.max(1, size.height),
        };
      }
      commit(
        editProject(project, (next) => {
          next.nodes[node.id] = node;
          populateRecipe(next, node);
          next.nodes[target].children.splice(
            drop?.index ?? next.nodes[target].children.length,
            0,
            node.id,
          );
        }),
      );
      select(node.id);
      const list = [def.id, ...recent.filter((id) => id !== def.id)].slice(
        0,
        24,
      );
      setRecent(list);
      try {
        localStorage.setItem("studio-recent", JSON.stringify(list));
      } catch {}
    });
  }
  function saveBlock() {
    safe(() => {
      if (!selection.length) return;
      const data = copyNodes(project, selectionRoots(project, selection));
      const list = [
        {
          id: crypto.randomUUID(),
          name: selectedNode?.name ?? "내 블록",
          data,
        },
        ...myBlocks,
      ].slice(0, 40);
      localStorage.setItem("studio-my-blocks", JSON.stringify(list));
      setMyBlocks(list);
      setMessage(
        "내 블록에 저장했습니다. 독립된 사본으로 다시 추가할 수 있습니다.",
      );
    });
  }
  function insertMyBlock(data: ClipboardNodes) {
    safe(() => {
      const target =
        selectedNode && DEFINITIONS[selectedNode.component].container
          ? selectedNode.id
          : page.rootId;
      const result = pasteNodes(project, data, target);
      commit(result.project);
      setSelection(result.ids);
    });
  }
  const duplicate = () => {
    if (!selected) return;
    safe(() => {
      const parent = parentId(project, selected);
      if (!parent) return;
      const result = pasteNodes(
        project,
        copyNodes(project, editableRoots(project, selection)),
        parent,
      );
      commit(result.project);
      setSelection(result.ids);
    });
  };
  const remove = () => {
    if (!selected) return;
    safe(() => {
      const parent = parentId(project, selected);
      commit(deleteNodes(project, selection));
      setSelected(parent ?? null);
    });
  };
  const move = (target: string, index: number) => {
    if (selected)
      safe(() =>
        commit(
          relocateNode(
            project,
            selected,
            target,
            index,
            viewport,
            canvasDocument.current,
          ),
        ),
      );
  };
  const selectMany = (ids: string[]) => {
    setSelection(ids);
    if (ids.length !== 1 || ids[0] !== partSelection?.id)
      setPartSelection(null);
    if (ids.length) setShowInspector(true);
  };
  const patchPart = (path: string, patch: import("./model").PartLayout, text?: string) =>
    safe(() => {
      const id = partSelection?.id ?? selected;
      if (!id || isLocked(project, id)) return;
      commit(
        editProject(project, (next) => {
          const node = next.nodes[id];
          node.parts ??= {};
          const part = node.parts[path] ?? { layout: {}, responsive: {} };
          if (viewport === "mobile") Object.assign(part.layout, patch);
          else
            part.responsive[viewport] = {
              ...part.responsive[viewport],
              ...patch,
            };
          if (text !== undefined) {
            const root = canvasDocument.current?.getElementById(id),
              target = root ? partElement(root, path) : null;
            const binding = target
              ? boundTextChange(project.nodes[id], target, text)
              : null;
            const contentKey = target?.getAttribute("data-content-key"), itemId = target?.getAttribute("data-content-item"), field = target?.getAttribute("data-content-field");
            const contentItem = contentKey && node.content?.[contentKey]?.find(item => item.id === itemId);
            if (contentItem && field && typeof contentItem.values[field] === "string") {
              const start = target?.getAttribute("data-rich-start"), end = target?.getAttribute("data-rich-end");
              contentItem.values[field] = start != null && end != null ? replaceRichRun(String(contentItem.values[field]), Number(start), Number(end), text) : text;
              delete part.text;
            } else if (binding) {
              node.props[binding.key] = binding.value;
              delete part.text;
            } else part.text = text;
          }
          node.parts[path] = part;
        }),
      );
    });
  const changeMode = (id: string, mode: "flow" | "free") =>
    safe(() => {
      const doc = canvasDocument.current,
        el = doc?.getElementById(id);
      if (!doc || !el) return;
      const next = convertLayout(
        project,
        id,
        viewport,
        mode,
        measureChildren(doc, id),
        elementSize(el),
      );
      if (mode === "flow") setLayoutPreview(next);
      else commit(next);
    });
  const patchDesign = (patch: Partial<Layout>) =>
    safe(() => {
      const doc = canvasDocument.current;
      if (!doc || !("anchorX" in patch || "anchorY" in patch)) {
        commit(patchLayouts(project, selection, viewport, patch));
        return;
      }
      commit(
        editProject(project, (next) => {
          for (const id of editableRoots(project, selection)) {
            const parent = parentId(project, id),
              el = doc.getElementById(id),
              parentEl = parent ? doc.getElementById(parent) : null;
            if (!el || !parentEl) continue;
            const box = boxInParent(el, parentEl),
              size = elementSize(parentEl);
            writeLayout(next.nodes[id], viewport, {
              ...box,
              ...patch,
              basisWidth: Math.max(1, size.width),
              basisHeight: Math.max(1, size.height),
            });
          }
        }),
      );
    });
  const designAction = (action: DesignAction) =>
    safe(() => {
      const ids = selectionRoots(project, selection),
        id = ids[0];
      const doc = canvasDocument.current;
      if (action === "copy") {
        clipboard.current = copyNodes(project, ids);
        setMessage(
          "요소를 복사했습니다. 같은 프로젝트나 다른 페이지에 붙여넣을 수 있습니다.",
        );
        return;
      }
      if (action === "paste") {
        if (!clipboard.current?.roots.length) {
          setMessage("먼저 요소를 복사하세요.");
          return;
        }
        const target =
          selectedNode && DEFINITIONS[selectedNode.component].container
            ? selectedNode.id
            : selected
              ? (parentId(project, selected) ?? page.rootId)
              : page.rootId;
        const result = pasteNodes(project, clipboard.current, target);
        commit(result.project);
        selectMany(result.ids);
        return;
      }
      if (!id || !doc) return;
      if (action === "focus") {
        doc.getElementById(id)?.scrollIntoView({
          block: "center",
          inline: "center",
          behavior: "instant",
        });
        return;
      }
      if (action === "detach") {
        void detachComposite(project, id)
          .then((result) => {
            if (latestProject.current !== project)
              throw new Error(
                "다른 편집이 반영되었습니다. 내부 요소 분리를 다시 실행하세요.",
              );
            commit(result);
          })
          .catch((error) => setMessage(String(error.message)));
        return;
      }
      if (["front", "back", "forward", "backward"].includes(action)) {
        commit(reorderSelection(project, ids, action as "front"));
        return;
      }
      if (action === "ungroup") {
        const result = ungroupNode(project, id);
        commit(result.project);
        selectMany(result.ids);
        return;
      }
      const parent = parentId(project, id);
      if (action === "fit-content") {
        const boxes = measureChildren(doc, id),
          bounds = unionBox(Object.values(boxes));
        commit(
          patchLayouts(project, [id], viewport, {
            height: Math.max(1, Math.ceil(bounds.y + bounds.height + 24)),
            heightMode: "fixed",
          }),
        );
        return;
      }
      if (
        !parent ||
        ids.some(
          (id) => parentId(project, id) !== parent || isLocked(project, id),
        )
      )
        return;
      const allBoxes = measureChildren(doc, parent),
        boxes = Object.fromEntries(
          ids.filter((id) => allBoxes[id]).map((id) => [id, allBoxes[id]]),
        );
      if (action === "group") {
        const result = groupNodes(project, ids, viewport, boxes);
        commit(result.project);
        selectMany(result.ids);
      } else if (
        resolvedLayout(project.nodes[parent], viewport).mode === "free"
      )
        commit(
          applyBoxes(
            project,
            viewport,
            alignBoxes(boxes, action as "left"),
            elementSize(doc.getElementById(parent)!),
          ),
        );
    });
  function keyboard(event: KeyboardEvent) {
    if (event.defaultPrevented) return;
    const target = event.target as HTMLElement;
    if (
      event.nativeEvent.isComposing ||
      target.closest("input,textarea,select,[contenteditable=true]")
    )
      return;
    if (preview || layoutPreview) return;
    const mod = event.ctrlKey || event.metaKey;
    if (mod && ["c", "v", "g"].includes(event.key.toLowerCase())) {
      event.preventDefault();
      designAction(
        event.key.toLowerCase() === "c"
          ? "copy"
          : event.key.toLowerCase() === "v"
            ? "paste"
            : event.shiftKey
              ? "ungroup"
              : "group",
      );
      return;
    }
    if (mod && event.key.toLowerCase() === "a") {
      event.preventDefault();
      const parent = selected
        ? (parentId(project, selected) ?? selected)
        : page.rootId;
      selectMany(
        project.nodes[parent].children.filter((id) => !isLocked(project, id)),
      );
      return;
    }
    if (
      ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key) &&
      selected
    ) {
      if (partSelection?.id === selected) {
        event.preventDefault();
        const l = resolvedPart(
            project.nodes[selected].parts?.[partSelection.path],
            viewport,
          ),
          step = event.shiftKey ? 10 : 1;
        patchPart(partSelection.path, {
          x: Math.max(
            -100000,
            Math.min(
              100000,
              l.x +
                (event.key === "ArrowLeft"
                  ? -step
                  : event.key === "ArrowRight"
                    ? step
                    : 0),
            ),
          ),
          y: Math.max(
            -100000,
            Math.min(
              100000,
              l.y +
                (event.key === "ArrowUp"
                  ? -step
                  : event.key === "ArrowDown"
                    ? step
                    : 0),
            ),
          ),
        });
        return;
      }
      const ids = editableRoots(project, selection).filter((id) => {
        const parent = parentId(project, id);
        return (
          parent &&
          resolvedLayout(project.nodes[parent], viewport).mode === "free"
        );
      });
      if (ids.length) {
        event.preventDefault();
        if (!nudgeGroup.current)
          nudgeGroup.current = `nudge-${crypto.randomUUID()}`;
        const step = event.shiftKey ? 10 : 1;
        commit(
          editProject(project, (next) => {
            for (const id of ids) {
              const l = resolvedLayout(project.nodes[id], viewport);
              writeLayout(next.nodes[id], viewport, {
                x: Math.max(
                  -100000,
                  Math.min(
                    100000,
                    l.x +
                      (event.key === "ArrowLeft"
                        ? -step
                        : event.key === "ArrowRight"
                          ? step
                          : 0),
                  ),
                ),
                y: Math.max(
                  -100000,
                  Math.min(
                    100000,
                    l.y +
                      (event.key === "ArrowUp"
                        ? -step
                        : event.key === "ArrowDown"
                          ? step
                          : 0),
                  ),
                ),
              });
            }
          }),
          nudgeGroup.current,
        );
      }
      return;
    }
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
          className={`b-layer ${selection.includes(id) ? "selected" : ""} ${dropTarget === id ? "drop-target" : ""}`}
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
                  relocateNode(
                    project,
                    dragging.current!,
                    target,
                    DEFINITIONS[node.component].container
                      ? node.children.length
                      : project.nodes[target].children.indexOf(id),
                    viewport,
                    canvasDocument.current,
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
            aria-pressed={selection.includes(id)}
            onClick={(event) =>
              event.shiftKey
                ? selectMany(
                    selection.includes(id)
                      ? selection.filter((item) => item !== id)
                      : selectionRoots(project, [...selection, id]),
                  )
                : select(id)
            }
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
      onKeyUp={() => {
        nudgeGroup.current = "";
      }}
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
              <button role="tab" aria-selected={tab === "assets"} tabIndex={tab === "assets" ? 0 : -1} className={tab === "assets" ? "active" : ""} onClick={() => setTab("assets")}>자산</button>
            </div>
            <div className="builder-panel-scroll">
              {tab === "library" ? (
                <div className="builder-panel-content">
                  <div className="b-library-modes">
                    {[
                      ["all", "전체"],
                      ["basic", "기본"],
                      ["components", "컴포넌트"],
                      ["blocks", "블록"],
                      ["scenes", "장면"],
                      ["effects", "효과"],
                      ["favorites", "즐겨찾기"],
                      ["recent", "최근"],
                      ["mine", "내 블록"],
                    ].map(([id, name]) => (
                      <button
                        key={id}
                        className={libraryMode === id ? "active" : ""}
                        onClick={() => {
                          setLibraryMode(id);
                          setCategory("전체");
                          setTileLimit(24);
                        }}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                  <div className="b-library-filters">
                    <label>
                      디자인
                      <select
                        aria-label="라이브러리 디자인"
                        value={libraryFamily}
                        onChange={(e) =>
                          setLibraryFamily(
                            e.target.value as DesignFamily | "legacy",
                          )
                        }
                      >
                        <option value="legacy">기존 디자인</option>
                        {DESIGN_FAMILIES.map((f) => (
                          <option value={f.id} key={f.id}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      출처
                      <select
                        aria-label="라이브러리 출처"
                        value={librarySource}
                        onChange={(e) => setLibrarySource(e.target.value)}
                      >
                        <option value="all">전체</option>
                        <option value="shadcn">shadcn/ui 기반</option>
                        <option value="studio">Prompt Studio</option>
                      </select>
                    </label>
                  </div>
                  {libraryMode === "effects" && (
                    <div className="b-effect-library">
                      <p className="b-help">
                        캔버스에서 요소를 선택하고 효과를 적용하세요.
                        미리보기에서 재생됩니다.
                      </p>
                      {MOTIONS.filter(([id]) => id !== "none").map(
                        ([id, name]) => (
                          <button
                            className="b-button"
                            key={id}
                            disabled={!selection.length}
                            onClick={() =>
                              commit(
                                editProject(project, (next) => {
                                  for (const nodeId of editableRoots(
                                    project,
                                    selection,
                                  ))
                                    next.nodes[nodeId].appearance = {
                                      ...next.nodes[nodeId].appearance,
                                      motion: id,
                                    };
                                }),
                              )
                            }
                          >
                            {name}
                          </button>
                        ),
                      )}
                    </div>
                  )}
                  {libraryMode === "mine" && (
                    <div className="b-my-blocks">
                      {!myBlocks.length && (
                        <p className="b-help">
                          요소를 선택한 뒤 오른쪽에서 ‘내 블록으로 저장’을
                          누르세요.
                        </p>
                      )}
                      {myBlocks.map((block) => (
                        <div key={block.id}>
                          <button
                            className="b-button"
                            onClick={() => insertMyBlock(block.data)}
                          >
                            {block.name} 추가
                          </button>
                          <button
                            className="b-icon"
                            aria-label={`${block.name} 저장본 삭제`}
                            onClick={() =>
                              safe(() => {
                                const list = myBlocks.filter(
                                  (b) => b.id !== block.id,
                                );
                                localStorage.setItem(
                                  "studio-my-blocks",
                                  JSON.stringify(list),
                                );
                                setMyBlocks(list);
                              })
                            }
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
                    {filtered.slice(0, tileLimit).map((def) => {
                      const help = componentHelp(def.id);
                      return (
                        <div className="b-component-card" key={def.id}>
                          <button
                            className="b-component-tile"
                            title={`${def.name} · ${help.summary}`}
                            aria-label={`${help.label} 추가`}
                            onClick={() => {
                              if (!skipLibraryClick.current) add(def);
                            }}
                            onPointerDown={(event) => {
                              libraryDrag.current?.();
                              libraryDrag.current = beginLibraryDrag(
                                event,
                                project,
                                canvasDocument.current,
                                viewport,
                                def.name,
                                (drop) => {
                                  if (latestProject.current === project)
                                    add(def, drop);
                                },
                                () => {
                                  skipLibraryClick.current = true;
                                  setTimeout(() => {
                                    skipLibraryClick.current = false;
                                  }, 0);
                                },
                              );
                            }}
                          >
                            <span
                              className={`b-tile-visual b-tile-${def.category === "구조" ? "structure" : def.category === "화면 구역" ? "section" : "component"}`}
                            >
                              <LiveThumbnail
                                id={def.id}
                                theme={project.theme}
                                family={libraryFamily}
                              />
                              <Plus size={12} className="b-tile-plus" />
                            </span>
                            <span>{help.label}</span>
                          </button>
                          <p className="b-component-summary">{help.summary}</p>
                          <button
                            className="b-tile-favorite"
                            aria-label={`${help.label} 즐겨찾기`}
                            aria-pressed={favorites.includes(def.id)}
                            onClick={() =>
                              safe(() => {
                                const list = favorites.includes(def.id)
                                  ? favorites.filter((id) => id !== def.id)
                                  : [...favorites, def.id];
                                localStorage.setItem(
                                  "studio-favorites",
                                  JSON.stringify(list),
                                );
                                setFavorites(list);
                              })
                            }
                          >
                            {favorites.includes(def.id) ? "★" : "☆"}
                          </button>
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
                  {filtered.length > tileLimit && (
                    <button
                      className="b-button"
                      onClick={() => setTileLimit(tileLimit + 24)}
                    >
                      더 보기 · {filtered.length - tileLimit}개
                    </button>
                  )}
                  {!filtered.length &&
                    !["effects", "mine"].includes(libraryMode) && (
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
                      끌어서 원하는 위치에 놓을 수도 있어요.
                    </p>
                  </div>
                </div>
              ) : tab === "theme" ? (
                <ThemePanel project={project} commit={commit} />
              ) : tab === "assets" ? (
                <AssetPanel project={project} commit={commit} onInsert={asset => add(DEFINITIONS[asset.kind === "image" ? "image" : asset.kind === "video" ? "video-player" : "audio-player"], undefined, { src: assetRef(asset.id), ...(asset.kind === "image" ? { alt: asset.description || asset.name } : { title: asset.name }) })} />
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
                <option value={1.5}>150%</option>
                <option value={2}>200%</option>
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
          {!preview && (
            <div className="design-toolbar" aria-label="디자인 도구">
              <div className="b-segment">
                <button
                  aria-pressed={tool === "select"}
                  className={tool === "select" ? "active" : ""}
                  onClick={() => setTool("select")}
                >
                  선택
                </button>
                <button
                  aria-pressed={tool === "hand"}
                  className={tool === "hand" ? "active" : ""}
                  onClick={() => setTool("hand")}
                >
                  화면 이동
                </button>
              </div>
              <button
                className="b-button b-button-small"
                onClick={() => add(DEFINITIONS.frame)}
              >
                + 자유 배치 영역
              </button>
              <button
                className="b-button b-button-small"
                onClick={() => add(DEFINITIONS.text)}
              >
                텍스트
              </button>
              <button
                className="b-button b-button-small"
                onClick={() => add(DEFINITIONS.shape)}
              >
                도형
              </button>
              <button
                className="b-button b-button-small"
                onClick={() => select(page.rootId)}
              >
                페이지 설정
              </button>
              <span>Shift 다중 선택 · Space 화면 이동</span>
              <button
                className="b-button b-button-small"
                onClick={() => {
                  const target =
                    selectedNode &&
                    DEFINITIONS[selectedNode.component].container
                      ? selectedNode.id
                      : selected
                        ? (parentId(project, selected) ?? page.rootId)
                        : page.rootId;
                  changeMode(
                    target,
                    resolvedLayout(project.nodes[target], viewport).mode ===
                      "free"
                      ? "flow"
                      : "free",
                  );
                }}
              >
                {(() => {
                  const target =
                    selectedNode &&
                    DEFINITIONS[selectedNode.component].container
                      ? selectedNode.id
                      : selected
                        ? (parentId(project, selected) ?? page.rootId)
                        : page.rootId;
                  return resolvedLayout(project.nodes[target], viewport)
                    .mode === "free"
                    ? "자유 배치 ⇄ 자동 배치"
                    : "자동 배치 ⇄ 자유 배치";
                })()}
              </button>
              {selectedNode &&
                !DEFINITIONS[selectedNode.component].container && (
                  <button
                    className="b-button b-button-small"
                    onClick={() => {
                      setShowInspector(true);
                      const root = surfaceDocument?.getElementById(
                        selectedNode.id,
                      );
                      const child = root?.querySelector(
                        "[data-part-id],button,h1,h2,h3,p,svg,input",
                      );
                      if (child && root) {
                        const path = partPath(child, root, selectedNode.parts);
                        if (path)
                          setPartSelection({ id: selectedNode.id, path });
                      }
                    }}
                  >
                    내부 편집
                  </button>
                )}
            </div>
          )}
          {layoutPreview && (
            <div className="design-conversion-preview" role="status">
              <span>자동 배치 미리보기 · 레이어 순서대로 정렬됩니다.</span>
              <button
                className="b-button"
                onClick={() => {
                  commit(layoutPreview);
                  setLayoutPreview(null);
                }}
              >
                이 배치 적용
              </button>
              <button
                className="b-button"
                onClick={() => setLayoutPreview(null)}
              >
                취소
              </button>
            </div>
          )}
          <PreviewFrame
            key={replay}
            fitViewport
            project={layoutPreview ?? project}
            pageId={page.id}
            viewport={viewport}
            width={canvasWidth}
            selected={selected}
            onSelect={select}
            preview={preview || !!layoutPreview}
            zoom={zoom}
            selection={selection}
            onSelection={selectMany}
            commit={commit}
            onReady={(doc) => {
              canvasDocument.current = doc;
              setSurfaceDocument(doc);
            }}
            onMessage={setMessage}
            tool={tool}
            partSelection={partSelection}
            onPartSelection={setPartSelection}
            onPartPatch={patchPart}
            onLibraryDrop={(id, drop) => {
              if (DEFINITIONS[id]) add(DEFINITIONS[id], drop);
            }}
          />
          <div className="builder-statusbar">
            <span>
              <span className="b-status-dot" />
              {preview
                ? "미리보기 · UI를 직접 조작해보세요"
                : `편집 모드 · ${selection.length ? `${selection.length}개 선택 · ` : ""}드래그 이동 · 더블클릭 텍스트 편집`}
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
              {selection.length === 1 && !layoutPreview && (
                <PartsPanel
                  project={project}
                  commit={commit}
                  id={selected}
                  doc={surfaceDocument}
                  viewport={viewport}
                  selected={partSelection}
                  onSelect={setPartSelection}
                  onPatch={patchPart}
                  onReset={(path, key) => {
                    if (selected && !isLocked(project, selected))
                      commit(
                        editProject(project, (next) => {
                          const part = next.nodes[selected].parts?.[path];
                          if (part) {
                            if (key) {
                              const values = viewport === "mobile" ? part.layout : part.responsive[viewport];
                              if (values) {
                                delete values[key];
                                if (key === "width") delete values.widthMode;
                                if (key === "height") delete values.heightMode;
                              }
                            } else {
                              part.layout = {};
                              part.responsive = {};
                            }
                          }
                        }),
                      );
                  }}
                />
              )}
              {!layoutPreview && (
                <AppearancePanel
                  project={project}
                  ids={selection}
                  commit={commit}
                  onReplay={() => {
                    setPreview(true);
                    setReplay(replay + 1);
                  }}
                  onSaveBlock={saveBlock}
                  onStructure={(component) =>
                    safe(() => {
                      if (selected)
                        setStructurePreview(
                          changeBlockStructure(project, selected, component),
                        );
                    })
                  }
                />
              )}
              {!layoutPreview && (
                <DesignPanel
                  project={project}
                  ids={selection}
                  viewport={viewport}
                  commit={commit}
                  onMode={changeMode}
                  onAction={designAction}
                  onPatch={patchDesign}
                  document={surfaceDocument}
                />
              )}
              {selection.length <= 1 && !layoutPreview && (
                <Inspector
                  project={project}
                  node={selectedNode}
                  viewport={viewport}
                  commit={commit}
                  onDuplicate={duplicate}
                  onDelete={remove}
                  onMove={move}
                />
              )}
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
      {structurePreview && (
        <Modal
          title="블록 구조 미리보기"
          wide
          onClose={() => setStructurePreview(null)}
        >
          <p className="b-help">
            내부 문구·속성·부분 수정을 유지한 결과입니다. 적용하면 한 번의 실행
            취소로 되돌릴 수 있습니다.
          </p>
          <PreviewFrame
            project={structurePreview}
            pageId={page.id}
            viewport={viewport}
            width={canvasWidth}
            selected={null}
            onSelect={() => {}}
            preview
            zoom={0}
            viewportHeight={520}
          />
          <div className="b-modal-actions">
            <button
              className="b-button"
              onClick={() => setStructurePreview(null)}
            >
              취소
            </button>
            <button
              className="b-button b-button-primary"
              onClick={() => {
                commit(structurePreview);
                setStructurePreview(null);
              }}
            >
              이 구조 적용
            </button>
          </div>
        </Modal>
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
            <div className="b-library-filters">
              <label>
                미리보기 폭
                <select
                  aria-label="라이브러리 미리보기 폭"
                  value={libraryWidth}
                  onChange={(e) => setLibraryWidth(Number(e.target.value))}
                >
                  <option value={390}>모바일 · 390px</option>
                  <option value={768}>태블릿 · 768px</option>
                  <option value={1440}>데스크톱 · 1440px</option>
                </select>
              </label>
              <label>
                디자인
                <select
                  aria-label="미리보기 디자인"
                  value={libraryFamily}
                  onChange={(e) =>
                    setLibraryFamily(e.target.value as DesignFamily | "legacy")
                  }
                >
                  <option value="legacy">기존 디자인</option>
                  {DESIGN_FAMILIES.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <PreviewFrame
              width={libraryWidth}
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
            <div className="b-variant-gallery">
              {DESIGN_FAMILIES.map((f) => (
                <button
                  key={f.id}
                  aria-pressed={libraryFamily === f.id}
                  onClick={() => setLibraryFamily(f.id)}
                >
                  <LiveThumbnail
                    id={libraryPreview}
                    theme={project.theme}
                    family={f.id}
                  />
                  <span>{f.name}</span>
                </button>
              ))}
            </div>
            {DEFINITIONS[libraryPreview].fields.find(
              (field) => field.key === "state",
            )?.options && (
              <label className="b-field">
                컴포넌트 상태
                <select
                  aria-label="미리보기 상태"
                  value={libraryState}
                  onChange={(e) => setLibraryState(e.target.value)}
                >
                  {DEFINITIONS[libraryPreview].fields
                    .find((field) => field.key === "state")!
                    .options!.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                </select>
              </label>
            )}
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
            <button className="b-button" disabled={exporting} onClick={async () => { setExporting(true); try { downloadFile(`${project.name}.studio.zip`, await exportProjectArchive(project)); setExportStatus("설계와 자산 원본을 함께 백업했습니다."); } catch (error) { setExportStatus(error instanceof Error ? error.message : "백업하지 못했습니다."); } finally { setExporting(false); } }}>자산 포함 ZIP 백업</button>
            {Object.keys(project.assets).length > 0 && <p className="b-help">JSON과 공유 링크에는 자산 원본이 포함되지 않습니다. 다른 기기에는 자산 포함 ZIP을 전달하세요.</p>}
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
