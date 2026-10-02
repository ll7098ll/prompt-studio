"use client";
import { useState } from "react";
import { createTemplate } from "./templates";
import type { TemplateInfo } from "./template-recipes";
import type { Viewport } from "./model";
import Modal from "./Modal";
import PreviewFrame from "./PreviewFrame";

export default function TemplatePreview({
  template,
  busy,
  onClose,
  onStart,
}: {
  template: TemplateInfo;
  busy: boolean;
  onClose: () => void;
  onStart: () => void;
}) {
  const [project] = useState(() => createTemplate(template.id));
  const [viewport, setViewport] = useState<Viewport>("desktop");
  return (
    <Modal title={`${template.name} 미리보기`} onClose={onClose} wide>
      <p className="b-dialog-intro">
        {template.description}. 마음에 드는 구성으로 시작한 뒤 글, 색, 배치를
        자유롭게 바꾸세요.
      </p>
      <div className="b-preset-preview-toolbar">
        <span className="b-preset-tags">{template.trends.join(" · ")}</span>
        <div className="b-viewport-group" aria-label="프리셋 화면 크기">
          {(["desktop", "tablet", "mobile"] as const).map((v, i) => (
            <button
              key={v}
              aria-pressed={viewport === v}
              onClick={() => setViewport(v)}
            >
              {["데스크톱", "태블릿", "모바일"][i]}
            </button>
          ))}
        </div>
      </div>
      <div className="b-preset-preview">
        <PreviewFrame
          project={project}
          pageId={project.pages[0].id}
          viewport={viewport}
          selected={null}
          onSelect={() => {}}
          preview
          zoom={0}
          viewportHeight={760}
        />
      </div>
      <div className="b-dialog-actions">
        <span className="b-preset-note">
          버튼과 입력창을 체험할 수 있어요. 내용과 데이터는 예시입니다.
        </span>
        <button
          className="b-button b-button-primary"
          disabled={busy}
          onClick={onStart}
        >
          이 프리셋으로 시작
        </button>
      </div>
    </Modal>
  );
}
