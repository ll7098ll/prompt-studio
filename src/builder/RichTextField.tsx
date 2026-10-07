"use client";
import { useRef, useState } from "react";
import { safeRichLink } from "./rich-text";
export default function RichTextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null),
    selection = useRef({ start: 0, end: 0 });
  const [link, setLink] = useState(false),
    [url, setURL] = useState("https://"),
    [error, setError] = useState("");
  const wrap = (before: string, after = before) => {
    const { start, end } = selection.current,
      text = value.slice(start, end) || "문구";
    const next =
      value.slice(0, start) + before + text + after + value.slice(end);
    if (next.length > 20000) {
      setError("본문은 20,000자까지 입력할 수 있습니다.");
      return;
    }
    onChange(next);
    setError("");
    requestAnimationFrame(() => {
      ref.current?.focus();
      ref.current?.setSelectionRange(
        start + before.length,
        start + before.length + text.length,
      );
    });
  };
  return (
    <div className="b-field">
      <span>{label}</span>
      <div
        role="group"
        aria-label={`${label} 서식`}
        style={{ display: "flex", gap: 4, flexWrap: "wrap" }}
      >
        {[
          ["굵게", "**"],
          ["기울임", "*"],
          ["코드", "`"],
        ].map(([name, marker]) => (
          <button
            key={name}
            className="b-button"
            type="button"
            aria-label={`${label} ${name}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => wrap(marker)}
          >
            {name}
          </button>
        ))}
        <button
          className="b-button"
          type="button"
          aria-label={`${label} 링크`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setLink(!link)}
        >
          링크
        </button>
      </div>
      {link && (
        <div>
          <label className="b-field">
            링크 주소
            <input
              aria-label={`${label} 링크 주소`}
              value={url}
              onChange={(e) => setURL(e.target.value)}
            />
          </label>
          <button
            className="b-button"
            type="button"
            onClick={() => {
              if (!safeRichLink(url)) {
                setError(
                  "웹 주소, 이메일 링크 또는 페이지 내 경로를 입력하세요.",
                );
                return;
              }
              wrap("[", `](${url})`);
              setLink(false);
            }}
          >
            링크 적용
          </button>
        </div>
      )}
      <textarea
        ref={ref}
        aria-label={label}
        value={value}
        maxLength={20000}
        rows={5}
        onChange={(e) => onChange(e.target.value)}
        onSelect={(e) => {
          selection.current = {
            start: e.currentTarget.selectionStart,
            end: e.currentTarget.selectionEnd,
          };
        }}
        onKeyDown={(e) => {
          if (!(e.ctrlKey || e.metaKey)) return;
          if (e.key.toLowerCase() === "b" || e.key.toLowerCase() === "i") {
            e.preventDefault();
            e.stopPropagation();
            wrap(e.key.toLowerCase() === "b" ? "**" : "*");
          } else if (e.key.toLowerCase() === "k") {
            e.preventDefault();
            e.stopPropagation();
            setLink(true);
          }
        }}
      />
      <small className="b-help">
        문구를 선택해 서식을 적용하세요. **굵게**, *기울임*, `코드`,
        [문구](주소)를 지원합니다. HTML은 문자로 표시합니다.
      </small>
      {error && (
        <p className="b-notice" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
