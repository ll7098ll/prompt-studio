"use client";
import { useEffect, useRef, useState } from "react";
import type { Node } from "./model";

const value = (n: Node, key: string) => String(n.props[key] ?? "");
const lines = (n: Node) =>
  value(n, "items")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
const pct = (n: Node) => Math.max(0, Math.min(100, Number(n.props.value) || 0));
const button = (label: string) => (
  <button className="ui-button" type="button">
    {label}
  </button>
);

function Search({ node }: { node: Node }) {
  const [query, setQuery] = useState("");
  const found = lines(node).filter((s) =>
    s.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  );
  return (
    <div className="ui-x-search">
      <label className="ui-field">
        {value(node, "label")}
        <input
          type="search"
          placeholder={value(node, "placeholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <ul>
        {found.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
      {!found.length && <p role="status">검색 결과가 없습니다.</p>}
    </div>
  );
}
function Range({ node }: { node: Node }) {
  const [current, setCurrent] = useState(pct(node));
  return (
    <label className="ui-x-range">
      <span>
        {value(node, "label")}{" "}
        <output>
          {current}
          {value(node, "unit")}
        </output>
      </span>
      <input
        type="range"
        min="0"
        max="100"
        value={current}
        onChange={(e) => setCurrent(Number(e.target.value))}
      />
    </label>
  );
}
function Pagination({ node }: { node: Node }) {
  const pages = Math.min(20, Math.max(1, Math.floor(Number(node.props.pages))));
  const [current, setCurrent] = useState(
    Math.min(pages, Math.max(1, Math.floor(Number(node.props.current)))),
  );
  return (
    <nav className="ui-x-pagination" aria-label="목록 페이지">
      <button
        disabled={current === 1}
        onClick={() => setCurrent(current - 1)}
        aria-label="이전 페이지"
      >
        ‹
      </button>
      {Array.from({ length: pages }, (_, i) => (
        <button
          key={i}
          aria-current={current === i + 1 ? "page" : undefined}
          onClick={() => setCurrent(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button
        disabled={current === pages}
        onClick={() => setCurrent(current + 1)}
        aria-label="다음 페이지"
      >
        ›
      </button>
    </nav>
  );
}
function Dropdown({ node }: { node: Node }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const [selected, setSelected] = useState("");
  return (
    <div className="ui-x-dropdown-wrap">
      <details
        ref={ref}
        className="ui-x-dropdown"
        onKeyDown={(e) => {
          if (e.key === "Escape" && ref.current) {
            ref.current.open = false;
            ref.current.querySelector("summary")?.focus();
          }
        }}
      >
        <summary>
          {value(node, "label")} <span>⌄</span>
        </summary>
        <div>
          {lines(node).map((s, i) => (
            <button
              key={i}
              onClick={() => {
                setSelected(s);
                if (ref.current) {
                  ref.current.open = false;
                  ref.current.querySelector("summary")?.focus();
                }
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </details>
      <p role="status">{selected ? `선택: ${selected}` : ""}</p>
    </div>
  );
}
function Dialog({ node }: { node: Node }) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const dialog = ref.current;
    const trigger = opener.current;
    if (open) dialog?.showModal();
    else dialog?.close();
    return () => {
      if (dialog?.open) dialog.close();
      if (open && trigger?.isConnected) trigger.focus();
    };
  }, [open]);
  return (
    <>
      <button ref={opener} className="ui-button" onClick={() => setOpen(true)}>
        {value(node, "label")}
      </button>
      <dialog
        className="ui-x-dialog"
        ref={ref}
        aria-label={value(node, "title")}
        onClose={() => {
          const trigger = opener.current;
          trigger?.focus({ preventScroll: true });
        }}
        onCancel={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(false);
        }}
      >
        <h2>{value(node, "title")}</h2>
        <p>{value(node, "body")}</p>
        <button className="ui-button" onClick={() => setOpen(false)}>
          {value(node, "confirm")}
        </button>
      </dialog>
    </>
  );
}
function Toast({ node }: { node: Node }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ui-x-toast-demo">
      <button className="ui-button" onClick={() => setOpen(true)}>
        {value(node, "label")}
      </button>
      <div role="status">
        {open && (
          <div className="ui-x-toast">
            <span>✓</span>
            <div>
              <strong>{value(node, "title")}</strong>
              <p>{value(node, "body")}</p>
            </div>
            <button aria-label="알림 닫기" onClick={() => setOpen(false)}>
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
function Tooltip({ node }: { node: Node }) {
  const [dismissed, setDismissed] = useState(false);
  return (
    <span
      className="ui-x-tooltip"
      data-dismissed={dismissed}
      onMouseEnter={() => setDismissed(false)}
      onFocus={() => setDismissed(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          setDismissed(true);
        }
      }}
    >
      <button
        className="ui-button ui-button-secondary"
        aria-describedby={`${node.id}-tip`}
      >
        {value(node, "label")} ⓘ
      </button>
      <span role="tooltip" id={`${node.id}-tip`}>
        {value(node, "body")}
      </span>
    </span>
  );
}
function Form({ node, contact = false }: { node: Node; contact?: boolean }) {
  const [sent, setSent] = useState(false);
  return (
    <section className="ui-x-form">
      <h2>{value(node, "title")}</h2>
      <p>{value(node, "body")}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        {contact && (
          <label className="ui-field">
            이름
            <input
              name="name"
              required
              autoComplete="name"
              placeholder="이름을 알려주세요"
            />
          </label>
        )}
        <label className="ui-field">
          이메일
          <input
            name="email"
            required
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
          />
        </label>
        {contact && (
          <label className="ui-field">
            문의 내용
            <textarea
              name="message"
              required
              rows={4}
              placeholder="어떤 프로젝트를 생각하고 계신가요?"
            />
          </label>
        )}
        <button className="ui-button" type="submit">
          {value(node, "label")}
        </button>
        <p className="ui-x-form-note" role="status">
          {sent
            ? "입력이 완료됐습니다. 미리보기이므로 실제 전송되지는 않습니다."
            : "입력과 완료 화면을 체험하는 미리보기입니다."}
        </p>
      </form>
    </section>
  );
}
function Chat({ node }: { node: Node }) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<{ user: boolean; text: string }[]>(
    [],
  );
  return (
    <section className="ui-x-chat">
      <h3>{value(node, "title")}</h3>
      <div role="log" aria-label="대화 내용">
        <p className="ui-x-chat-bubble">{value(node, "greeting")}</p>
        {messages.map((message, i) => (
          <p
            key={i}
            className={`ui-x-chat-bubble ${message.user ? "is-user" : ""}`}
          >
            {message.text}
          </p>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.trim()) return;
          setMessages(
            [
              ...messages,
              { user: true, text: draft.trim() },
              { user: false, text: value(node, "reply") },
            ].slice(-20),
          );
          setDraft("");
        }}
      >
        <input
          aria-label="보낼 메시지"
          placeholder="메시지를 입력하세요"
          value={draft}
          maxLength={1000}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button className="ui-button" type="submit" disabled={!draft.trim()}>
          보내기
        </button>
      </form>
      <small>샘플 대화 · 실제 AI 연결은 별도입니다.</small>
    </section>
  );
}
function Calendar({ node }: { node: Node }) {
  const input = value(node, "month");
  const valid =
    /^\d{4}-(0[1-9]|1[0-2])$/.test(input) &&
    Number(input.slice(0, 4)) >= 1900 &&
    Number(input.slice(0, 4)) <= 2100;
  const [month, setMonth] = useState(valid ? input : "2026-10");
  const [selected, setSelected] = useState("");
  const [year, m] = month.split("-").map(Number);
  const start = new Date(year, m - 1, 1).getDay();
  const days = new Date(year, m, 0).getDate();
  const move = (delta: number) => {
    const date = new Date(year, m - 1 + delta, 1);
    setMonth(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
    );
  };
  if (!valid)
    return (
      <p className="ui-alert">
        시작 월을 1900-01~2100-12 사이의 YYYY-MM 형식으로 입력하세요.
      </p>
    );
  return (
    <section className="ui-x-calendar">
      <h3>{value(node, "title")}</h3>
      <header>
        <button
          aria-label="이전 달"
          disabled={month === "1900-01"}
          onClick={() => move(-1)}
        >
          ‹
        </button>
        <strong aria-live="polite">
          {year}년 {m}월
        </strong>
        <button
          aria-label="다음 달"
          disabled={month === "2100-12"}
          onClick={() => move(1)}
        >
          ›
        </button>
      </header>
      <div className="ui-x-calendar-grid">
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <span key={day}>{day}</span>
        ))}
        {Array.from({ length: start }, (_, i) => (
          <span key={`empty-${i}`} />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const key = `${month}-${String(i + 1).padStart(2, "0")}`;
          return (
            <button
              key={key}
              aria-label={`${year}년 ${m}월 ${i + 1}일`}
              aria-pressed={selected === key}
              onClick={() => setSelected(key)}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <p role="status">
        {selected ? `선택한 날짜: ${selected}` : "날짜를 선택하세요"}
      </p>
    </section>
  );
}

export function ExtendedContent({ node }: { node: Node }) {
  const p = node.props;
  switch (node.component) {
    case "avatar":
      return (
        <div className="ui-x-avatar">
          <span>{value(node, "initials").slice(0, 3)}</span>
          <div>
            <strong>{value(node, "name")}</strong>
            <small>{value(node, "role")}</small>
          </div>
        </div>
      );
    case "avatar-group":
      return (
        <div className="ui-x-avatar-group">
          <div>
            {lines(node)
              .slice(0, 5)
              .map((name, i) => (
                <span key={i} title={name}>
                  {name.slice(-2)}
                </span>
              ))}
            {lines(node).length > 5 && <span>+{lines(node).length - 5}</span>}
          </div>
          <small>{value(node, "label")}</small>
        </div>
      );
    case "breadcrumbs":
      return (
        <nav className="ui-x-breadcrumbs" aria-label="현재 위치">
          {lines(node).map((item, i, all) => (
            <span
              key={i}
              aria-current={i === all.length - 1 ? "page" : undefined}
            >
              {i > 0 && <b aria-hidden="true">/</b>}
              {item}
            </span>
          ))}
        </nav>
      );
    case "search":
      return <Search node={node} />;
    case "textarea":
      return (
        <label className="ui-field">
          {value(node, "label")}
          <textarea
            rows={Number(p.rows)}
            placeholder={value(node, "placeholder")}
          />
        </label>
      );
    case "radio":
      return (
        <fieldset className="ui-x-radio">
          <legend>{value(node, "label")}</legend>
          {lines(node).map((item, i) => (
            <label key={i}>
              <input type="radio" name={node.id} defaultChecked={i === 0} />
              {item}
            </label>
          ))}
        </fieldset>
      );
    case "range":
      return <Range node={node} key={String(p.value)} />;
    case "progress":
      return (
        <div className="ui-x-progress">
          <div>
            <strong>{value(node, "label")}</strong>
            <b>{pct(node)}%</b>
          </div>
          <progress
            aria-label={value(node, "label")}
            max="100"
            value={pct(node)}
          />
          <p>{value(node, "body")}</p>
        </div>
      );
    case "steps":
      return (
        <ol className="ui-x-steps">
          {lines(node).map((s, i) => (
            <li
              key={i}
              aria-current={
                i + 1 === Math.min(Number(p.current), lines(node).length)
                  ? "step"
                  : undefined
              }
            >
              <span>{i + 1 < Number(p.current) ? "✓" : i + 1}</span>
              <strong>{s}</strong>
            </li>
          ))}
        </ol>
      );
    case "pagination":
      return <Pagination node={node} key={`${p.pages}-${p.current}`} />;
    case "skeleton":
      return (
        <div
          className="ui-x-skeleton"
          role="status"
          aria-label="콘텐츠를 불러오는 중"
        >
          <div />
          <section>
            {Array.from({ length: Number(p.lines) }, (_, i) => (
              <span key={i} style={{ width: i % 2 ? "65%" : "100%" }} />
            ))}
          </section>
        </div>
      );
    case "tooltip":
      return <Tooltip node={node} />;
    case "dropdown":
      return <Dropdown node={node} />;
    case "dialog":
      return <Dialog node={node} />;
    case "toast":
      return <Toast node={node} />;
    case "timeline":
      return (
        <section className="ui-x-timeline">
          <h3>{value(node, "title")}</h3>
          <ol>
            {lines(node).map((s, i) => {
              const [time, title, body] = s.split("|");
              return (
                <li key={i}>
                  <small>{time}</small>
                  <strong>{title}</strong>
                  <p>{body}</p>
                </li>
              );
            })}
          </ol>
        </section>
      );
    case "bar-chart": {
      const data = lines(node).map((row) => {
        const [name, raw] = row.split("|");
        const amount = Number(raw);
        return {
          name,
          value: Number.isFinite(amount) ? Math.max(0, amount) : 0,
        };
      });
      const max = Math.max(1, ...data.map((item) => item.value));
      return (
        <figure className="ui-x-chart">
          <figcaption>{value(node, "title")}</figcaption>
          <div className="ui-x-bars">
            {data.map((item, i) => (
              <div key={i}>
                <span>
                  {item.value}
                  {value(node, "unit")}
                </span>
                <i
                  style={{
                    height: `${Math.max(2, (item.value / max) * 135)}px`,
                  }}
                />
                <strong>{item.name}</strong>
              </div>
            ))}
          </div>
        </figure>
      );
    }
    case "donut-chart":
      return (
        <figure className="ui-x-chart">
          <figcaption>{value(node, "title")}</figcaption>
          <div className="ui-x-donut">
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle
                cx="60"
                cy="60"
                r="46"
                fill="none"
                stroke="var(--ui-soft)"
                strokeWidth="12"
              />
              <circle
                cx="60"
                cy="60"
                r="46"
                fill="none"
                stroke="var(--ui-primary)"
                strokeWidth="12"
                pathLength="100"
                strokeDasharray={`${pct(node)} 100`}
                transform="rotate(-90 60 60)"
                strokeLinecap="round"
              />
            </svg>
            <strong>{pct(node)}%</strong>
          </div>
          <p>{value(node, "label")}</p>
        </figure>
      );
    case "logos":
      return (
        <section className="ui-x-logos">
          <p>{value(node, "title")}</p>
          <div>
            {lines(node).map((name, i) => (
              <b key={i}>{name}</b>
            ))}
          </div>
        </section>
      );
    case "team":
      return (
        <article className="ui-x-team">
          <div>{value(node, "initials").slice(0, 3)}</div>
          <h3>{value(node, "name")}</h3>
          <small>{value(node, "role")}</small>
          <p>{value(node, "body")}</p>
        </article>
      );
    case "product":
      return (
        <article className="ui-x-product">
          <div className="ui-x-product-art">
            <span>{value(node, "badge")}</span>
            <div
              className="ui-x-chair"
              role="img"
              aria-label="상품 이미지 자리"
            />
          </div>
          <h3>{value(node, "title")}</h3>
          <p>{value(node, "body")}</p>
          <strong>{value(node, "price")}</strong>
          {button(value(node, "label"))}
        </article>
      );
    case "newsletter":
      return <Form node={node} />;
    case "contact":
      return <Form node={node} contact />;
    case "marquee":
      return (
        <div className="ui-x-marquee" data-animate={Boolean(p.animate)}>
          <div>
            {lines(node).map((s, i) => (
              <span key={i}>
                {s}
                <b aria-hidden="true">✦</b>
              </span>
            ))}
          </div>
        </div>
      );
    case "spotlight":
      return (
        <section
          className="ui-x-spotlight"
          data-treatment={value(node, "treatment")}
        >
          <div className="ui-x-spotlight-orb" aria-hidden="true" />
          <span>{value(node, "eyebrow")}</span>
          <h1>{value(node, "title")}</h1>
          <p>{value(node, "body")}</p>
          {button(value(node, "label"))}
        </section>
      );
    case "gallery":
      return (
        <section className="ui-x-gallery">
          <h2>{value(node, "title")}</h2>
          <div>
            {lines(node).map((s, i) => {
              const [title, category] = s.split("|");
              return (
                <article key={i}>
                  <div
                    className={`ui-x-gallery-art art-${i % 3}`}
                    role="img"
                    aria-label="작품 이미지 자리"
                  >
                    <i />
                    <b>{String(i + 1).padStart(2, "0")}</b>
                  </div>
                  <small>{category}</small>
                  <h3>{title}</h3>
                </article>
              );
            })}
          </div>
        </section>
      );
    case "chat":
      return <Chat node={node} />;
    case "calendar":
      return <Calendar node={node} key={value(node, "month")} />;
    default:
      return null;
  }
}
