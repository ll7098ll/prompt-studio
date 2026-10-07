"use client";
import { useMemo, useState } from "react";
import {
  DESIGN_PACKS,
  SCOPE_LABELS,
  applyDesignPack,
  packOverrideImpact,
  type DesignPack,
} from "./design-packs";
import { PACK_SCOPES, type PackScope } from "./design-pack-schema";
import type { Project, Viewport } from "./model";
import Modal from "./Modal";
import PreviewFrame from "./PreviewFrame";
import { createTemplate } from "./templates";

export default function DesignPackPanel({
  project,
  commit,
}: {
  project: Project;
  commit: (project: Project) => void;
}) {
  const [chosen, setChosen] = useState<DesignPack | null>(null);
  return (
    <>
      <div className="b-section-title">
        디자인 팩 <span>{DESIGN_PACKS.length}종</span>
      </div>
      <p className="b-help">
        색상·서체·표면·모션을 골라 적용하고, 직접 수정한 부분은 유지하세요.
      </p>
      <div className="b-pack-grid">
        {DESIGN_PACKS.map((pack) => (
          <button
            key={pack.id}
            className="b-pack-card"
            onClick={() => setChosen(pack)}
            aria-label={`${pack.name} 미리보기`}
          >
            <span
              className="b-pack-cover"
              style={{
                background: pack.theme[project.theme.mode].background,
                color: pack.theme[project.theme.mode].foreground,
                borderRadius: pack.theme.radius / 2,
              }}
            >
              <small>{pack.code}</small>
              <strong
                style={{
                  fontFamily:
                    pack.theme.headingFont === "serif"
                      ? "Georgia,serif"
                      : pack.theme.headingFont === "mono"
                        ? "monospace"
                        : "sans-serif",
                  fontWeight: pack.theme.typography?.headingWeight,
                }}
              >
                Aa
                <span
                  style={{ background: pack.theme[project.theme.mode].primary }}
                />
              </strong>
            </span>
            <b>{pack.name}</b>
            <small>{pack.description}</small>
          </button>
        ))}
      </div>
      {chosen && (
        <PackPreview
          key={chosen.id}
          pack={chosen}
          project={project}
          commit={commit}
          onClose={() => setChosen(null)}
        />
      )}
    </>
  );
}
function PackPreview({
  pack,
  project,
  commit,
  onClose,
}: {
  pack: DesignPack;
  project: Project;
  commit: (project: Project) => void;
  onClose: () => void;
}) {
  const [scopes, setScopes] = useState<PackScope[]>([...PACK_SCOPES]),
    [reset, setReset] = useState(false),
    [viewport, setViewport] = useState<Viewport>("desktop"),
    [pageId, setPageId] = useState(project.pages[0].id),
    [before, setBefore] = useState(false),
    [showExample, setShowExample] = useState(false);
  const example = useMemo(() => createTemplate(`pack-${pack.id}`), [pack.id]);
  const candidate = useMemo(
    () => applyDesignPack(project, pack, scopes, reset),
    [project, pack, scopes, reset],
  );
  const impact = useMemo(
    () => packOverrideImpact(project, scopes),
    [project, scopes],
  );
  return (
    <Modal title={`${pack.name} 적용 미리보기`} onClose={onClose} wide>
      <div className="b-pack-options">
        <p>
          {pack.description} · {pack.use}
        </p>
        <fieldset>
          <legend>적용할 항목</legend>
          {PACK_SCOPES.map((scope) => (
            <label key={scope}>
              <input
                type="checkbox"
                checked={scopes.includes(scope)}
                onChange={(event) =>
                  setScopes((value) =>
                    event.target.checked
                      ? [...value, scope]
                      : value.filter((item) => item !== scope),
                  )
                }
              />
              {SCOPE_LABELS[scope]}
            </label>
          ))}
        </fieldset>
        <label className="b-pack-reset">
          <input
            type="checkbox"
            checked={reset}
            onChange={(event) => setReset(event.target.checked)}
          />
          선택 항목의 개별 외형도 초기화
        </label>
        {reset ? (
          <details className="b-notice">
            <summary>
              초기화 영향: {impact.length}개 요소
              {scopes.includes("typography") &&
              (project.theme.bodyFontAsset || project.theme.headingFontAsset)
                ? " · 업로드 서체 연결"
                : ""}
            </summary>
            <p>
              {impact.slice(0, 30).join(", ") || "초기화할 요소 외형 없음"}
              {impact.length > 30 ? " 외…" : ""}
            </p>
            <p>
              잠긴 요소는 유지합니다. 색상과 표면을 함께 선택하면 개별 디자인
              계열도 초기화합니다. 문구·위치·구조는 유지됩니다.
            </p>
          </details>
        ) : (
          <p className="b-help">
            문구·배치·부분 스타일·업로드 서체를 유지합니다. 화면 모드와 밀도도
            현재 값을 사용합니다.
          </p>
        )}
        <div className="b-pack-preview-tools">
          <select
            aria-label="팩 미리보기 페이지"
            value={pageId}
            onChange={(event) => setPageId(event.target.value)}
          >
            {project.pages.map((page) => (
              <option key={page.id} value={page.id}>
                {page.name}
              </option>
            ))}
          </select>
          {(["mobile", "tablet", "desktop"] as const).map((view, index) => (
            <button
              className="b-button b-button-small"
              key={view}
              aria-pressed={viewport === view}
              onClick={() => setViewport(view)}
            >
              {["390px", "768px", "1440px"][index]}
            </button>
          ))}
          <button
            className="b-button b-button-small"
            aria-pressed={before}
            disabled={showExample}
            onClick={() => setBefore(!before)}
          >
            {before ? "적용 후 보기" : "적용 전 보기"}
          </button>
          <button
            className="b-button b-button-small"
            aria-pressed={showExample}
            onClick={() => setShowExample(!showExample)}
          >
            {showExample ? "내 페이지 보기" : "대표 장면 보기"}
          </button>
        </div>
        <p className="b-help">
          모바일: {pack.mobile} · 기본 모션은 모바일에서 정지합니다. 새 장면의
          권장 간격 {pack.spacing}px
        </p>
        {showExample && (
          <p className="b-help">
            새 프로젝트의 프리셋 목록에서 이 대표 페이지로 시작할 수 있습니다.
            아래 적용 버튼은 현재 프로젝트의 디자인만 바꿉니다.
          </p>
        )}
      </div>
      <div className="b-pack-preview">
        <PreviewFrame
          project={showExample ? example : before ? project : candidate}
          pageId={showExample ? example.pages[0].id : pageId}
          viewport={viewport}
          width={
            viewport === "mobile" ? 390 : viewport === "tablet" ? 768 : 1440
          }
          selected={null}
          onSelect={() => {}}
          preview
          zoom={0}
          viewportHeight={500}
        />
      </div>
      <div className="b-pack-actions">
        <button className="b-button" onClick={onClose}>
          취소
        </button>
        <button
          className="b-button b-button-primary"
          disabled={!scopes.length}
          onClick={() => {
            commit(candidate);
            onClose();
          }}
        >
          선택 항목 적용
        </button>
      </div>
    </Modal>
  );
}
