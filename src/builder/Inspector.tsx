"use client";
import {
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  LockKeyhole,
  UnlockKeyhole,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import { DEFINITIONS } from "./catalog";
import {
  descendants,
  editProject,
  isLocked,
  parentId,
  resolvedLayout,
  type Layout,
  type Node,
  type Project,
  type Viewport,
} from "./model";
import { THEME_PRESETS, type Colors } from "./theme";
import NumberInput from "./NumberInput";
import { AssetField } from "./AssetPanel";
import ContentItemsPanel from "./ContentItemsPanel";
import DesignPackPanel from "./DesignPackPanel";

export function ThemePanel({
  project,
  commit,
}: {
  project: Project;
  commit: (p: Project, group?: string) => void;
}) {
  const theme = project.theme;
  const colors = theme[theme.mode];
  const labels: Record<keyof Colors, string> = {
    primary: "브랜드",
    onPrimary: "브랜드 위 텍스트",
    background: "배경",
    surface: "카드 표면",
    foreground: "주 텍스트",
    muted: "보조 텍스트",
    border: "경계선",
    soft: "강조 배경",
  };
  return (
    <div className="builder-panel-content">
      <DesignPackPanel project={project} commit={commit} />
      <div className="b-section-title">
        테마 컬렉션 <span>{THEME_PRESETS.length}</span>
      </div>
      <p className="b-help">
        같은 화면, 새로운 분위기.
        <br />
        테마를 고르고 내 스타일로 다듬어보세요.
      </p>
      <div className="b-theme-grid">
        {THEME_PRESETS.map((preset) => (
          <button
            key={preset.name}
            className={`b-theme-card ${theme.name === preset.name ? "active" : ""}`}
            onClick={() =>
              commit(
                editProject(project, (next) => {
                  next.theme = { ...structuredClone(preset), mode: theme.mode };
                }),
              )
            }
          >
            <span
              className="b-theme-preview"
              style={{
                background: preset[theme.mode].background,
                borderColor: preset[theme.mode].border,
              }}
            >
              <i style={{ background: preset[theme.mode].primary }} />
              <i style={{ background: preset[theme.mode].soft }} />
              <i style={{ background: preset[theme.mode].foreground }} />
            </span>
            <span>{preset.name}</span>
          </button>
        ))}
      </div>
      <div className="b-section-title">화면 모드</div>
      <div className="b-segment">
        <button
          className={theme.mode === "light" ? "active" : ""}
          onClick={() =>
            commit(
              editProject(project, (next) => {
                next.theme.mode = "light";
              }),
            )
          }
        >
          라이트
        </button>
        <button
          className={theme.mode === "dark" ? "active" : ""}
          onClick={() =>
            commit(
              editProject(project, (next) => {
                next.theme.mode = "dark";
              }),
            )
          }
        >
          다크
        </button>
      </div>
      <div className="b-section-title">
        컬러 팔레트 <span>직접 편집</span>
      </div>
      {(Object.keys(labels) as (keyof Colors)[]).map((key) => (
        <label className="b-color-row" key={key}>
          <span>{labels[key]}</span>
          <span className="b-color-input">
            <input
              type="color"
              aria-label={labels[key]}
              value={colors[key]}
              onChange={(e) =>
                commit(
                  editProject(project, (next) => {
                    next.theme[theme.mode][key] = e.target.value;
                  }),
                  `color-${key}`,
                )
              }
            />
            <code>{colors[key].toUpperCase()}</code>
          </span>
        </label>
      ))}
      <div className="b-section-title">형태와 타이포그래피</div>
      <label className="b-field">
        모서리 <span>{theme.radius}px</span>
        <input
          type="range"
          min="0"
          max="32"
          value={theme.radius}
          onChange={(e) =>
            commit(
              editProject(project, (next) => {
                next.theme.radius = Number(e.target.value);
              }),
              "radius",
            )
          }
        />
      </label>
      <label className="b-field">
        화면 밀도 <span>{Math.round(theme.density * 100)}%</span>
        <input
          type="range"
          min="0.6"
          max="1.4"
          step="0.05"
          value={theme.density}
          onChange={(e) =>
            commit(
              editProject(project, (next) => {
                next.theme.density = Number(e.target.value);
              }),
              "density",
            )
          }
        />
      </label>
      <label className="b-field">
        서체
        <select
          value={theme.font}
          onChange={(e) =>
            commit(
              editProject(project, (next) => {
                next.theme.font = e.target.value as typeof theme.font;
              }),
            )
          }
        >
          <option value="sans">산세리프 · 깔끔하게</option>
          <option value="serif">세리프 · 우아하게</option>
          <option value="mono">모노 · 정교하게</option>
        </select>
      </label>
      <label className="b-field">제목 서체<select aria-label="제목 서체" value={theme.headingFont ?? theme.font} onChange={e => commit(editProject(project, next => { next.theme.headingFont = e.target.value as typeof theme.font; }))}><option value="sans">산세리프</option><option value="serif">세리프</option><option value="mono">모노</option></select></label>
      {([['bodyFontAsset', '본문 사용자 서체'], ['headingFontAsset', '제목 사용자 서체']] as const).map(([key, label]) => <label key={key} className="b-field">{label}<select aria-label={label} value={theme[key] ?? ""} onChange={e => commit(editProject(project, next => { if (e.target.value) next.theme[key] = e.target.value; else delete next.theme[key]; }))}><option value="">기본 서체 사용</option>{Object.values(project.assets).filter(a => a.kind === "font").map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></label>)}
      <p className="b-help">자산 탭에서 WOFF2 파일을 등록하면 제목과 본문에 각각 적용할 수 있습니다. 없는 한글 글자는 기본 서체로 표시됩니다.</p>
    </div>
  );
}

export default function Inspector({
  project,
  node,
  viewport,
  commit,
  onDuplicate,
  onDelete,
  onMove,
}: {
  project: Project;
  node?: Node;
  viewport: Viewport;
  commit: (p: Project, group?: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMove: (target: string, index: number) => void;
}) {
  if (!node)
    return (
      <div className="b-inspector-empty">
        <SlidersHorizontal size={27} />
        <h3>세부 사항을 다듬어보세요</h3>
        <p>
          캔버스 또는 레이어에서
          <br />
          편집할 요소를 선택하세요.
        </p>
        <div>내용 · 레이아웃 · 반응형</div>
      </div>
    );
  const definition = DEFINITIONS[node.component];
  const parent = parentId(project, node.id);
  const locked = isLocked(project, node.id);
  const inheritedLock = parent ? isLocked(project, parent) : false;
  const resolved = resolvedLayout(node, viewport);
  const setLayout = (key: keyof Layout, value: number | string | boolean) =>
    commit(
      editProject(project, (next) => {
        if (viewport === "mobile")
          next.nodes[node.id].layout = { ...node.layout, [key]: value };
        else
          next.nodes[node.id].responsive[viewport] = {
            ...node.responsive[viewport],
            [key]: value,
          };
      }),
      `${node.id}-layout-${key}`,
    );
  const candidates = Object.values(project.nodes).filter(
    (n) =>
      DEFINITIONS[n.component].container &&
      !descendants(project, node.id).includes(n.id) &&
      !isLocked(project, n.id),
  );
  return (
    <div className="builder-panel-content">
      <div className="b-selected-title">
        <span className="b-selected-icon">
          <SlidersHorizontal size={17} />
        </span>
        <div>
          <strong>{node.name}</strong>
          <small>
            {definition.category} · {definition.id}
          </small>
        </div>
      </div>
      <div className="b-node-actions">
        <button
          className="b-icon"
          disabled={!parent || locked}
          aria-label="위로 이동"
          onClick={() =>
            onMove(
              parent!,
              Math.max(0, project.nodes[parent!].children.indexOf(node.id) - 1),
            )
          }
        >
          <ArrowUp size={16} />
        </button>
        <button
          className="b-icon"
          disabled={!parent || locked}
          aria-label="아래로 이동"
          onClick={() =>
            onMove(
              parent!,
              project.nodes[parent!].children.indexOf(node.id) + 1,
            )
          }
        >
          <ArrowDown size={16} />
        </button>
        <button
          className="b-icon"
          disabled={!parent || locked}
          aria-label="요소 복제"
          onClick={onDuplicate}
        >
          <Copy size={16} />
        </button>
        <button
          className="b-icon"
          disabled={locked}
          aria-label={node.hidden ? "요소 표시" : "요소 숨기기"}
          onClick={() =>
            commit(
              editProject(project, (next) => {
                next.nodes[node.id].hidden = !node.hidden;
              }),
            )
          }
        >
          {node.hidden ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
        <button
          className="b-icon"
          disabled={inheritedLock}
          aria-label={node.locked ? "잠금 해제" : "요소 잠금"}
          onClick={() =>
            commit(
              editProject(project, (next) => {
                next.nodes[node.id].locked = !node.locked;
              }),
            )
          }
        >
          {node.locked ? (
            <LockKeyhole size={16} />
          ) : (
            <UnlockKeyhole size={16} />
          )}
        </button>
        <button
          className="b-icon b-danger"
          disabled={!parent || locked}
          aria-label="요소 삭제"
          onClick={onDelete}
        >
          <Trash2 size={16} />
        </button>
      </div>
      {locked && (
        <p className="b-notice">
          {inheritedLock
            ? "부모 요소가 잠겨 있습니다."
            : "잠금을 해제하면 편집할 수 있습니다."}
        </p>
      )}
      <fieldset disabled={locked} className="b-fieldset">
        <label className="b-field">
          레이어 이름
          <input
            value={node.name}
            maxLength={100}
            onChange={(e) => {
              if (e.target.value.trim())
                commit(
                  editProject(project, (next) => {
                    next.nodes[node.id].name = e.target.value;
                  }),
                  `${node.id}-name`,
                );
            }}
          />
        </label>
        {definition.fields.length > 0 && (
          <div className="b-section-title">콘텐츠</div>
        )}
        {Object.entries(definition.collections ?? {}).map(([key, collection]) => <ContentItemsPanel key={key} project={project} nodeId={node.id} collectionKey={key} collection={collection} commit={commit}/>)}
        {definition.fields.filter(field => !Object.entries(definition.collections ?? {}).some(([key, collection]) => node.content?.[key] && collection.legacy?.prop === field.key)).map((field) => field.type === "asset" ? (
          <AssetField key={field.key} project={project} nodeId={node.id} field={field} commit={commit} />
        ) : (
          <label
            className={`b-field ${field.type === "toggle" ? "b-field-toggle" : ""}`}
            key={field.key}
          >
            {field.label}
            {field.type === "select" ? (
              <select
                value={String(node.props[field.key])}
                onChange={(e) =>
                  commit(
                    editProject(project, (next) => {
                      next.nodes[node.id].props[field.key] = e.target.value;
                    }),
                  )
                }
              >
                {field.options?.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            ) : field.type === "toggle" ? (
              <input
                type="checkbox"
                checked={Boolean(node.props[field.key])}
                onChange={(e) =>
                  commit(
                    editProject(project, (next) => {
                      next.nodes[node.id].props[field.key] = e.target.checked;
                    }),
                  )
                }
              />
            ) : field.type === "textarea" ? (
              <textarea
                aria-label={field.label}
                rows={4}
                value={String(node.props[field.key])}
                maxLength={20000}
                onChange={(e) =>
                  commit(
                    editProject(project, (next) => {
                      next.nodes[node.id].props[field.key] = e.target.value;
                    }),
                    `${node.id}-${field.key}`,
                  )
                }
              />
            ) : field.type === "number" &&
              field.min !== undefined &&
              field.max !== undefined ? (
              <NumberInput
                aria-label={field.label}
                value={Number(node.props[field.key])}
                min={field.min}
                max={field.max}
                onChange={(value) =>
                  commit(
                    editProject(project, (next) => {
                      next.nodes[node.id].props[field.key] = value;
                    }),
                    `${node.id}-${field.key}`,
                  )
                }
              />
            ) : (
              <input
                type={field.type === "number" ? "number" : "text"}
                value={String(node.props[field.key])}
                maxLength={20000}
                onChange={(e) =>
                  commit(
                    editProject(project, (next) => {
                      next.nodes[node.id].props[field.key] =
                        field.type === "number"
                          ? Number(e.target.value)
                          : e.target.value;
                    }),
                    `${node.id}-${field.key}`,
                  )
                }
              />
            )}
          </label>
        ))}
        {parent && (
          <>
            <div className="b-section-title">배치 위치</div>
            <label className="b-field">
              부모 영역
              <select
                aria-label="부모 영역"
                value={parent}
                onChange={(e) =>
                  onMove(
                    e.target.value,
                    project.nodes[e.target.value].children.length,
                  )
                }
              >
                {candidates.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
        <div className="b-section-title">
          반응형{" "}
          <span>
            {viewport === "mobile"
              ? "기본값"
              : viewport === "tablet"
                ? "768px 이상"
                : "1024px 이상"}
          </span>
        </div>
        <p className="b-help">
          상단에서 화면 크기를 선택하세요. 큰 화면은 작은 화면의 설정을
          이어받습니다.
        </p>
        {definition.container && (
          <>
            <div className="b-field-pair">
              <label className="b-field">
                간격
                <input
                  type="number"
                  aria-label="요소 간격"
                  min={0}
                  max={160}
                  value={resolved.gap}
                  onChange={(e) =>
                    setLayout(
                      "gap",
                      Math.min(160, Math.max(0, Number(e.target.value))),
                    )
                  }
                />
              </label>
              <label className="b-field">
                안쪽 여백
                <input
                  type="number"
                  aria-label="안쪽 여백"
                  min={0}
                  max={240}
                  value={resolved.padding}
                  onChange={(e) =>
                    setLayout(
                      "padding",
                      Math.min(240, Math.max(0, Number(e.target.value))),
                    )
                  }
                />
              </label>
            </div>
            {node.component === "grid" ? (
              <label className="b-field">
                열 수
                <select
                  value={resolved.columns}
                  onChange={(e) => setLayout("columns", Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </label>
            ) : (
              <label className="b-field">
                배치 방향
                <select
                  value={resolved.direction}
                  onChange={(e) => setLayout("direction", e.target.value)}
                >
                  <option value="column">세로</option>
                  <option value="row">가로</option>
                </select>
              </label>
            )}
            <label className="b-field">
              정렬
              <select
                value={resolved.align}
                onChange={(e) => setLayout("align", e.target.value)}
              >
                <option value="stretch">너비 채우기</option>
                <option value="start">시작</option>
                <option value="center">가운데</option>
                <option value="end">끝</option>
              </select>
            </label>
            {node.component !== "grid" && (
              <>
                <label className="b-field">
                  진행 방향 정렬
                  <select
                    value={resolved.justify}
                    onChange={(e) => setLayout("justify", e.target.value)}
                  >
                    <option value="start">시작</option>
                    <option value="center">가운데</option>
                    <option value="end">끝</option>
                    <option value="space-between">양쪽 끝 · 균등 간격</option>
                    <option value="space-around">요소 둘레 균등 간격</option>
                  </select>
                </label>
                <label className="b-field b-field-toggle">
                  넘치면 다음 줄로
                  <input
                    type="checkbox"
                    checked={resolved.wrap}
                    onChange={(e) => setLayout("wrap", e.target.checked)}
                  />
                </label>
              </>
            )}
            {node.component === "section" && (
              <label className="b-field">
                최대 너비
                <input
                  type="number"
                  min={240}
                  max={2400}
                  value={resolved.maxWidth}
                  onChange={(e) =>
                    setLayout(
                      "maxWidth",
                      Math.max(240, Math.min(2400, Number(e.target.value))),
                    )
                  }
                />
              </label>
            )}
          </>
        )}
        <div className="b-section-title">요소 크기와 바깥 여백</div>
        {parent && (
          <>
            <label className="b-field">
              요소 너비
              <select
                value={resolved.widthMode}
                onChange={(e) => setLayout("widthMode", e.target.value)}
              >
                <option value="auto">컴포넌트 기본값</option>
                <option value="content">내용에 맞춤</option>
                <option value="fill">남은 너비 채우기</option>
                <option value="fixed">고정 너비</option>
              </select>
            </label>
            {resolved.widthMode === "fixed" && (
              <label className="b-field">
                고정 너비 (px)
                <NumberInput
                  aria-label="고정 너비"
                  min={1}
                  max={2400}
                  value={resolved.width}
                  onChange={(value) => setLayout("width", value)}
                />
              </label>
            )}
            {project.nodes[parent].component === "grid" && (
              <label className="b-field">
                차지할 열 수
                <select
                  value={resolved.span}
                  onChange={(e) => setLayout("span", Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
                <small>부모 그리드의 열 수가 작으면 그 수에 맞춥니다.</small>
              </label>
            )}
            <label className="b-field">
              바깥 여백 (px)
              <NumberInput
                aria-label="바깥 여백"
                min={0}
                max={240}
                value={resolved.margin}
                onChange={(value) => setLayout("margin", value)}
              />
            </label>
          </>
        )}
        <label className="b-field">
          최소 높이 (px)
          <NumberInput
            aria-label="최소 높이"
            min={0}
            max={2000}
            value={resolved.minHeight}
            onChange={(value) => setLayout("minHeight", value)}
          />
          <small>0은 컴포넌트의 기본 높이를 사용합니다.</small>
        </label>
        <label className="b-field b-field-toggle">
          이 화면에서 숨기기
          <input
            type="checkbox"
            checked={resolved.hidden}
            onChange={(e) =>
              commit(
                editProject(project, (next) => {
                  if (viewport === "mobile")
                    next.nodes[node.id].hidden = e.target.checked;
                  else
                    next.nodes[node.id].responsive[viewport] = {
                      ...node.responsive[viewport],
                      hidden: e.target.checked,
                    };
                }),
              )
            }
          />
        </label>
        {viewport !== "mobile" && node.responsive[viewport] && (
          <button
            className="b-button b-button-small"
            onClick={() =>
              commit(
                editProject(project, (next) => {
                  delete next.nodes[node.id].responsive[viewport];
                }),
              )
            }
          >
            <RotateCcw size={13} />이 화면의 변경 초기화
          </button>
        )}
      </fieldset>
    </div>
  );
}
