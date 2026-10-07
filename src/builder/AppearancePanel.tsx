"use client";
import { DESIGN_FAMILIES, MOTIONS } from "./visual-presets";
import { editProject, isLocked, type Project } from "./model";
import { BLOCK_PRESETS } from "./block-presets";
import MotionSettingsPanel from "./MotionSettingsPanel";
export default function AppearancePanel({
  project,
  ids,
  commit,
  onReplay,
  onSaveBlock,
  onStructure,
}: {
  project: Project;
  ids: string[];
  commit: (p: Project) => void;
  onReplay: () => void;
  onSaveBlock: () => void;
  onStructure: (component: string) => void;
}) {
  const nodes = ids.map((id) => project.nodes[id]).filter(Boolean);
  if (!nodes.length) return null;
  const disabled = nodes.some((n) => isLocked(project, n.id));
  const patch = (value: NonNullable<(typeof nodes)[number]["appearance"]>) =>
    commit(
      editProject(project, (next) => {
        for (const node of nodes)
          next.nodes[node.id].appearance = {
            renderer:
              node.appearance?.renderer ??
              (Object.keys(node.parts ?? {}).some((key) => key.startsWith("p."))
                ? "classic"
                : "shadcn"),
            ...node.appearance,
            ...value,
          };
      }),
    );
  return (
    <div className="builder-panel-content b-appearance-panel">
      <div className="b-section-title">디자인과 효과</div>
      <fieldset disabled={disabled} className="b-fieldset">
        {nodes.length === 1 && nodes[0].component.startsWith("block-") && (
          <label className="b-field">
            블록 구조
            <select
              aria-label="블록 구조"
              value={nodes[0].component}
              onChange={(e) => onStructure(e.target.value)}
            >
              {BLOCK_PRESETS.filter((def) =>
                def.id.startsWith(nodes[0].component.replace(/-\d+$/, "-")),
              ).map((def) => (
                <option key={def.id} value={def.id}>
                  {def.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <div className="b-design-families">
          {DESIGN_FAMILIES.map((f) => (
            <button
              key={f.id}
              className={
                nodes.every((n) => n.appearance?.family === f.id)
                  ? "active"
                  : ""
              }
              aria-pressed={nodes.every((n) => n.appearance?.family === f.id)}
              onClick={() => patch({ family: f.id })}
            >
              <i style={{ background: f.surface, borderColor: f.color }} />
              <span>{f.name}</span>
            </button>
          ))}
        </div>
        <button
          className="b-component-detail"
          onClick={() => patch({ family: "legacy" })}
        >
          프로젝트 테마 디자인
        </button>
        <label className="b-field">
          모션
          <select
            aria-label="모션 효과"
            value={nodes.every(node => node.appearance?.motion === nodes[0].appearance?.motion) ? nodes[0].appearance?.motion ?? "inherit" : "mixed"}
            onChange={(e) =>
              patch({
                motion:
                  e.target.value === "inherit"
                    ? undefined
                    : (e.target.value as (typeof MOTIONS)[number][0]),
              })
            }
          >
            <option value="mixed" disabled>혼합</option>
            <option value="inherit">테마 기본 모션</option>
            {MOTIONS.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <MotionSettingsPanel project={project} nodes={nodes} commit={commit} />
      </fieldset>
      <p className="b-help">
        내용과 배치를 유지하면서 외형을 바꿉니다. 효과는 미리보기에서
        재생됩니다.
      </p>
      <div className="design-quick-actions">
        <button className="b-button b-button-small" onClick={onReplay}>
          효과 재생
        </button>
        <button className="b-button b-button-small" onClick={onSaveBlock}>
          내 블록으로 저장
        </button>
      </div>
    </div>
  );
}
