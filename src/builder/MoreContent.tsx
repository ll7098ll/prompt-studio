"use client";
import { useState } from "react";
import {
  ArrowRight,
  Bell,
  Calendar,
  Check,
  Globe,
  Heart,
  Mail,
  Search,
  ShoppingCart,
  Sparkles,
  Star,
  User,
} from "lucide-react";
import type { Node } from "./model";
const icons = {
  sparkles: Sparkles,
  heart: Heart,
  star: Star,
  search: Search,
  mail: Mail,
  user: User,
  check: Check,
  arrow: ArrowRight,
  cart: ShoppingCart,
  bell: Bell,
  calendar: Calendar,
  globe: Globe,
};
const value = (node: Node, key: string) => String(node.props[key] ?? "");
export default function MoreContent({ node }: { node: Node }) {
  const p = node.props;
  const initialItems = value(node, "items")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const [number, setNumber] = useState(Number(p.value) || 0);
  const [current, setCurrent] = useState(
    Math.min(initialItems.length - 1, Math.max(0, Number(p.current) || 0)),
  );
  const [tags, setTags] = useState(initialItems),
    [draft, setDraft] = useState("");
  const [files, setFiles] = useState<string[]>([]),
    [color, setColor] = useState(
      /^#[0-9a-f]{6}$/i.test(String(p.value)) ? String(p.value) : "#7060cf",
    );
  switch (node.component) {
    case "icon": {
      const Icon = icons[p.name as keyof typeof icons] ?? Sparkles;
      return (
        <Icon
          className="ui-more-icon"
          aria-label={value(node, "label")}
          role="img"
        />
      );
    }
    case "spacer":
      return <div aria-hidden="true" className="ui-more-spacer" />;
    case "quantity": {
      const min = Number(p.min),
        max = Math.max(min, Number(p.max)),
        safe = Math.max(min, Math.min(max, number));
      return (
        <div className="ui-more-quantity">
          <span>{value(node, "label")}</span>
          <div>
            <button
              aria-label="수량 줄이기"
              disabled={safe <= min}
              onClick={() => setNumber(safe - 1)}
            >
              −
            </button>
            <output aria-live="polite">{safe}</output>
            <button
              aria-label="수량 늘리기"
              disabled={safe >= max}
              onClick={() => setNumber(safe + 1)}
            >
              +
            </button>
          </div>
        </div>
      );
    }
    case "rating":
      return (
        <fieldset className="ui-more-rating">
          <legend>{value(node, "label")}</legend>
          <div>
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n}>
                <input
                  type="radio"
                  name={`rating-${node.id}`}
                  aria-label={`${n}점`}
                  checked={number === n}
                  onChange={() => setNumber(n)}
                />
                <span aria-hidden="true" data-active={n <= number}>
                  ★
                </span>
              </label>
            ))}
            <output>{number}/5</output>
          </div>
        </fieldset>
      );
    case "segmented":
      return (
        <div
          className="ui-more-segmented"
          role="group"
          aria-label={value(node, "label")}
        >
          {initialItems.map((label, i) => (
            <button
              key={i}
              aria-pressed={current === i}
              onClick={() => setCurrent(i)}
            >
              {label}
            </button>
          ))}
        </div>
      );
    case "tag-input":
      return (
        <div className="ui-more-tags">
          <label htmlFor={`${node.id}-tags`}>{value(node, "label")}</label>
          <div>
            {tags.map((tag, i) => (
              <span key={`${tag}-${i}`}>
                {tag}
                <button
                  aria-label={`${tag} 삭제`}
                  onClick={() =>
                    setTags(tags.filter((_, index) => index !== i))
                  }
                >
                  ×
                </button>
              </span>
            ))}
            <input
              id={`${node.id}-tags`}
              placeholder={value(node, "placeholder")}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.nativeEvent.isComposing || e.key !== "Enter") return;
                e.preventDefault();
                if (draft.trim() && tags.length < 30) {
                  setTags([...tags, draft.trim().slice(0, 80)]);
                  setDraft("");
                }
              }}
            />
          </div>
        </div>
      );
    case "date-input":
      return (
        <label className="ui-field">
          {value(node, "label")}
          <input
            type="date"
            defaultValue={
              /^\d{4}-\d{2}-\d{2}$/.test(String(p.value)) ? String(p.value) : ""
            }
          />
        </label>
      );
    case "color-input":
      return (
        <label className="ui-more-color">
          {value(node, "label")}
          <span>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <output>{color.toUpperCase()}</output>
          </span>
        </label>
      );
    case "file-upload":
      return (
        <div className="ui-more-upload">
          <label htmlFor={`${node.id}-file`}>{value(node, "label")}</label>
          <p>{value(node, "body")}</p>
          <input
            id={`${node.id}-file`}
            type="file"
            multiple={!!p.multiple}
            onChange={(e) =>
              setFiles(Array.from(e.target.files ?? []).map((f) => f.name))
            }
          />
          <ul aria-live="polite">
            {files.map((name, i) => (
              <li key={i}>{name}</li>
            ))}
          </ul>
          <small>선택한 파일은 서버에 전송되지 않습니다.</small>
        </div>
      );
    case "meter": {
      const max = Math.max(1, Number(p.max)),
        amount = Math.max(0, Math.min(max, Number(p.value)));
      return (
        <div className="ui-more-meter">
          <label htmlFor={`${node.id}-meter`}>{value(node, "title")}</label>
          <strong>
            {amount}{" "}
            <small>
              / {max} {value(node, "unit")}
            </small>
          </strong>
          <meter id={`${node.id}-meter`} min={0} max={max} value={amount} />
          <p>{Math.round((amount / max) * 100)}% 사용 중</p>
        </div>
      );
    }
    default:
      return null;
  }
}
