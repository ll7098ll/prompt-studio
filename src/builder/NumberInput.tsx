"use client";
import { useState } from "react";

// Keep incomplete typing locally; only valid values enter the saved document.
export default function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  ...props
}: {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  "aria-label": string;
}) {
  const [draft, setDraft] = useState({ source: value, text: String(value) });
  if (draft.source !== value) setDraft({ source: value, text: String(value) });
  const valid = (text: string) =>
    text.trim() !== "" &&
    Number.isFinite(Number(text)) &&
    Number(text) >= min &&
    Number(text) <= max &&
    (step !== 1 || Number.isInteger(Number(text)));
  return (
    <input
      {...props}
      type="number"
      inputMode="decimal"
      min={min}
      max={max}
      step={step}
      value={draft.text}
      onChange={(event) => {
        const text = event.target.value;
        setDraft({ source: value, text });
        if (valid(text)) onChange(Number(text));
      }}
      onBlur={() => {
        const candidate =
          draft.text.trim() !== "" && Number.isFinite(Number(draft.text))
            ? Number(draft.text)
            : value;
        const next = Math.min(
          max,
          Math.max(min, step === 1 ? Math.round(candidate) : candidate),
        );
        setDraft({ source: next, text: String(next) });
        if (next !== value) onChange(next);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") event.currentTarget.blur();
      }}
    />
  );
}
