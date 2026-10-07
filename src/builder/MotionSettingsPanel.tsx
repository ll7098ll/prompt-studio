"use client";
import { editProject, type Node, type Project } from "./model";
import { resolveMotion, type MotionSettings } from "./motion-settings";

export default function MotionSettingsPanel({
  project,
  nodes,
  commit,
}: {
  project: Project;
  nodes: Node[];
  commit: (project: Project) => void;
}) {
  const motions = nodes.map((node) => resolveMotion(node, project.theme));
  if (motions.every((motion) => motion.preset === "none")) return null;
  const mixed = (key: keyof MotionSettings) =>
    motions.some((motion) => motion[key] !== motions[0][key]);
  const patch = (
    key: keyof MotionSettings,
    value: MotionSettings[typeof key],
  ) =>
    commit(
      editProject(project, (next) => {
        for (const node of nodes) {
          const appearance = (next.nodes[node.id].appearance ??= {});
          const settings = (appearance.motionSettings ??= {});
          if (value === undefined) delete settings[key];
          else Object.assign(settings, { [key]: value });
          // Keep dependent bounds valid as a single undoable edit.
          if (
            key === "scrollStart" &&
            (settings.scrollEnd ?? 100) <= Number(value)
          )
            settings.scrollEnd = Math.min(100, Number(value) + 1);
          if (
            key === "scrollEnd" &&
            (settings.scrollStart ?? 0) >= Number(value)
          )
            settings.scrollStart = Math.max(0, Number(value) - 1);
          if (!Object.keys(settings).length) delete appearance.motionSettings;
        }
      }),
    );
  const origin = (key: keyof MotionSettings) => (
    <span className="parts-property-source">
      <small>
        {nodes.every(
          (node) => node.appearance?.motionSettings?.[key] !== undefined,
        )
          ? "개별 설정"
          : nodes.some(
                (node) => node.appearance?.motionSettings?.[key] !== undefined,
              )
            ? "설정 혼합"
            : "효과·테마 기본값"}
      </small>
      <button
        type="button"
        className="b-text-button"
        aria-label={`모션 ${key} 기본값 복원`}
        disabled={nodes.every(
          (node) => node.appearance?.motionSettings?.[key] === undefined,
        )}
        onClick={() => patch(key, undefined)}
      >
        ↺
      </button>
    </span>
  );
  const numeric = (
    key: keyof MotionSettings,
    label: string,
    min: number,
    max: number,
    step: number,
  ) => (
    <div className="parts-property" key={key}>
      <label className="b-field">
        {label}
        <input
          type="number"
          aria-label={label}
          min={min}
          max={max}
          step={step}
          key={`${nodes.map((node) => node.id).join("-")}-${key}-${mixed(key) ? "mixed" : motions[0][key]}`}
          defaultValue={mixed(key) ? "" : String(motions[0][key])}
          placeholder={mixed(key) ? "혼합" : undefined}
          onBlur={(event) => {
            if (!event.currentTarget.value.trim()) return;
            const value = Number(event.currentTarget.value);
            if (!mixed(key) && value === motions[0][key]) return;
            if (Number.isFinite(value))
              patch(
                key,
                Math.max(
                  min,
                  Math.min(
                    max,
                    key === "iterations" ? Math.round(value) : value,
                  ),
                ),
              );
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
          }}
        />
      </label>
      {origin(key)}
    </div>
  );
  const choice = (
    key: keyof MotionSettings,
    label: string,
    options: [string, string][],
  ) => (
    <div className="parts-property" key={key}>
      <label className="b-field">
        {label}
        <select
          aria-label={label}
          value={mixed(key) ? "mixed" : String(motions[0][key])}
          onChange={(event) =>
            patch(key, event.target.value as MotionSettings[typeof key])
          }
        >
          {mixed(key) && (
            <option value="mixed" disabled>
              혼합
            </option>
          )}
          {options.map(([value, text]) => (
            <option key={value} value={value}>
              {text}
            </option>
          ))}
        </select>
      </label>
      {origin(key)}
    </div>
  );
  const scroll = motions.some((motion) => motion.trigger === "scroll");
  return (
    <details className="b-motion-settings" open>
      <summary>모션 세부 조절</summary>
      {choice("trigger", "모션 시작 조건", [
        ["load", "페이지 열기"],
        ["view", "화면에 들어오기"],
        ["hover", "호버·키보드 포커스"],
        ["press", "클릭·Enter·Space"],
        ["scroll", "스크롤 진행에 연결"],
      ])}
      <div className="b-field-pair">
        {numeric("duration", "모션 시간 · 초", 0.1, 20, 0.1)}
        {numeric("delay", "모션 지연 · 초", 0, 10, 0.1)}
        {numeric("intensity", "모션 강도", 0, 2, 0.1)}
        {!scroll &&
          numeric("iterations", "모션 반복 횟수 · 0은 계속", 0, 100, 1)}
      </div>
      {choice("easing", "모션 속도 곡선", [
        ["ease", "자연스럽게"],
        ["linear", "일정하게"],
        ["ease-in", "천천히 시작"],
        ["ease-out", "천천히 종료"],
        ["ease-in-out", "양 끝을 부드럽게"],
      ])}
      {choice("mobile", "모바일 모션", [
        ["inherit", "재생"],
        ["still", "정지 상태"],
      ])}
      {motions.some((motion) => motion.preset === "words") &&
        numeric("stagger", "단어 사이 지연 · 초", 0, 0.5, 0.01)}
      {motions.some((motion) => motion.preset === "words") && (
        <p className="b-help">
          제목·본문·인용의 고정 문구를 단어별로 재생합니다. 버튼·입력·실시간
          숫자는 분리하지 않습니다.
        </p>
      )}
      {motions.some((motion) => motion.trigger === "view") && (
        <>
          {numeric("threshold", "화면에 보이는 비율 · 0–1", 0, 1, 0.05)}
          <label className="b-field b-field-toggle">
            처음 들어올 때만 실행
            <input
              type="checkbox"
              aria-label="처음 들어올 때만 실행"
              checked={motions.every((motion) => motion.once)}
              ref={(element) => {
                if (element) element.indeterminate = mixed("once");
              }}
              onChange={(event) => patch("once", event.target.checked)}
            />
          </label>
          {origin("once")}
        </>
      )}
      {scroll && (
        <>
          <div className="b-field-pair">
            {numeric("scrollStart", "스크롤 시작 · %", 0, 99, 1)}
            {numeric("scrollEnd", "스크롤 종료 · %", 1, 100, 1)}
          </div>
          <p className="b-help">
            요소가 화면 아래에 도착하면 0%, 위로 완전히 지나가면 100%입니다.
            시간·지연은 탐색할 모션 구간이며, 스크롤이 한 번의 진행을
            조절합니다.
          </p>
        </>
      )}
      <p className="b-help">
        편집·이미지 출력·기기의 움직임 감소 설정에서는 정지합니다. 새 효과는
        내부 콘텐츠에 적용되어 바깥 배치 좌표를 유지합니다.
      </p>
    </details>
  );
}
