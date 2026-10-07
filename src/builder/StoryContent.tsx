"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Node } from "./model";
import { itemSlot, type ContentItem } from "./content-items";
import { fieldsForStep, fieldError } from "./form-content";
import { inlineRuns } from "./rich-text";

const binding = (collection: string, item: ContentItem, field: string) => ({
  "data-part-id": itemSlot(item.id, field),
  "data-content-key": collection,
  "data-content-item": item.id,
  "data-content-field": field,
});
const EMPTY_ITEMS: ContentItem[] = [];
function Chapters({ node }: { node: Node }) {
  const focusCleanup = useRef<(() => void) | null>(null);
  useEffect(() => () => focusCleanup.current?.(), []);
  const ref = useRef<HTMLElement>(null),
    [active, setActive] = useState(""),
    [progress, setProgress] = useState(0),
    [available, setAvailable] = useState<string[]>([]);
  const chapters = node.content?.chapters ?? EMPTY_ITEMS;
  const target = (id: string) => {
    const root = ref.current?.closest(".ui-root"),
      el = ref.current?.ownerDocument.getElementById(id);
    return el &&
      el.classList.contains("ui-node") &&
      root?.contains(el) &&
      !el.contains(ref.current) &&
      el.getClientRects().length
      ? el
      : null;
  };
  useEffect(() => {
    const nav = ref.current,
      doc = nav?.ownerDocument,
      win = doc?.defaultView,
      root = nav?.closest(".ui-root");
    if (!nav || !doc || !win || !root) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const entries = chapters.flatMap((chapter) => {
        const el = target(String(chapter.values.target));
        return el
          ? [{ id: chapter.id, el, rect: el.getBoundingClientRect() }]
          : [];
      });
      const ids = entries.map((e) => e.id);
      setAvailable((old) => (old.join("|") === ids.join("|") ? old : ids));
      const threshold =
        Number(node.props.offset) + nav.getBoundingClientRect().height + 12;
      const ordered = [...entries].sort((a, b) => a.rect.top - b.rect.top);
      setActive(
        ordered.filter((e) => e.rect.top <= threshold).at(-1)?.id ??
          ordered[0]?.id ??
          "",
      );
      const first = ordered[0]?.rect.top ?? 0,
        last = ordered.at(-1)?.rect.bottom ?? 0;
      setProgress(
        !entries.length
          ? 0
          : Math.round(
              Math.max(
                0,
                Math.min(
                  1,
                  (threshold - first) /
                    Math.max(
                      1,
                      last - first - Math.max(0, win.innerHeight - threshold),
                    ),
                ),
              ) * 100,
            ),
      );
    };
    const schedule = () => {
      if (!frame) frame = win.requestAnimationFrame(update);
    };
    const resize = new win.ResizeObserver(schedule);
    resize.observe(root);
    resize.observe(nav);
    for (const chapter of chapters) {
      const el = target(String(chapter.values.target));
      if (el) resize.observe(el);
    }
    const mutation = new win.MutationObserver(schedule);
    mutation.observe(root, { childList: true, subtree: true });
    doc.addEventListener("scroll", schedule, true);
    win.addEventListener("resize", schedule);
    schedule();
    return () => {
      if (frame) win.cancelAnimationFrame(frame);
      resize.disconnect();
      mutation.disconnect();
      doc.removeEventListener("scroll", schedule, true);
      win.removeEventListener("resize", schedule);
    };
  }, [chapters, node.props.offset]);
  return (
    <nav
      ref={ref}
      className="ui-chapters"
      aria-label={String(node.props.title)}
    >
      <strong data-part-id="chapter-title">{String(node.props.title)}</strong>
      <ol data-part-id="chapter-list">
        {chapters.map((chapter, index) => (
          <li key={chapter.id} data-part-id={itemSlot(chapter.id)}>
            <button
              type="button"
              disabled={!available.includes(chapter.id)}
              aria-current={active === chapter.id ? "location" : undefined}
              title={
                !available.includes(chapter.id)
                  ? "표시할 페이지 요소를 연결하세요"
                  : undefined
              }
              onClick={() => {
                const el = target(String(chapter.values.target)),
                  win = el?.ownerDocument.defaultView;
                if (!el || !win) return;
                const old = el.style.scrollMarginTop;
                el.style.scrollMarginTop = `${Number(node.props.offset) + (ref.current?.getBoundingClientRect().height ?? 0) + 12}px`;
                el.scrollIntoView({
                  behavior: win.matchMedia("(prefers-reduced-motion: reduce)")
                    .matches
                    ? "auto"
                    : "smooth",
                  block: "start",
                });
                el.style.scrollMarginTop = old;
                const focus =
                  el.querySelector<HTMLElement>(
                    "h1,h2,h3,h4,a,button,input,textarea,select",
                  ) ?? el;
                focusCleanup.current?.();
                const tabindex = focus.getAttribute("tabindex");
                focus.setAttribute("tabindex", "-1");
                focus.focus({ preventScroll: true });
                const restore = () => {
                  if (tabindex === null) focus.removeAttribute("tabindex");
                  else focus.setAttribute("tabindex", tabindex);
                  focus.removeEventListener("blur", restore);
                  focusCleanup.current = null;
                };
                focus.addEventListener("blur", restore, { once: true });
                focusCleanup.current = restore;
              }}
            >
              <span
                data-part-id={itemSlot(chapter.id, "number")}
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span {...binding("chapters", chapter, "label")}>
                {String(chapter.values.label)}
              </span>
            </button>
          </li>
        ))}
      </ol>
      {node.props.progress && (
        <progress
          data-part-id="chapter-progress"
          aria-label="챕터 읽기 진행"
          value={progress}
          max={100}
        />
      )}
    </nav>
  );
}
function StepForm({ node }: { node: Node }) {
  const steps = node.content?.steps ?? [],
    fields = node.content?.fields ?? [],
    initial =
      steps[
        Math.min(
          steps.length - 1,
          Math.max(0, Number(node.props.initialStep) - 1),
        )
      ];
  const [stepId, setStep] = useState(initial?.id ?? ""),
    [values, setValues] = useState<Record<string, string | boolean>>({}),
    [errors, setErrors] = useState<Record<string, string>>({}),
    [complete, setComplete] = useState(false);
  const root = useRef<HTMLDivElement>(null),
    form = useRef<HTMLFormElement>(null);
  const index = Math.max(
      0,
      steps.findIndex((s) => s.id === stepId),
    ),
    step = steps[index];
  const current = step ? fieldsForStep(fields, steps, step.id) : [];
  const focusHeading = () =>
    root.current?.ownerDocument.defaultView?.requestAnimationFrame(() =>
      root.current?.querySelector<HTMLElement>("[data-step-heading]")?.focus(),
    );
  const go = (id: string) => {
    setStep(id);
    setErrors({});
    focusHeading();
  };
  const validate = (list: ContentItem[]) =>
    Object.fromEntries(
      list.flatMap((field) => {
        const error = fieldError(field, values[field.id]);
        return error ? [[field.id, error]] : [];
      }),
    );
  return (
    <div ref={root} className="ui-step-form">
      <header data-part-id="form-header">
        <h2 data-part-id="form-title">{String(node.props.title)}</h2>
        <p data-part-id="form-description">{String(node.props.description)}</p>
      </header>
      {!steps.length ? (
        <p role="status">폼 단계를 추가하세요. 질문은 그대로 보관됩니다.</p>
      ) : complete ? (
        <section data-part-id="form-success" aria-live="polite">
          <h3 data-step-heading tabIndex={-1} data-part-id="form-success-title">
            {String(node.props.successTitle)}
          </h3>
          <p data-part-id="form-success-body">
            {String(node.props.successBody)}
          </p>
          <dl>
            {steps
              .flatMap((s) => fieldsForStep(fields, steps, s.id))
              .map((field) => (
                <div key={field.id} data-part-id={itemSlot(field.id, "review")}>
                  <dt>{String(field.values.label)}</dt>
                  <dd>
                    {field.values.kind === "checkbox"
                      ? values[field.id] === true
                        ? "선택함"
                        : "선택 안 함"
                      : String(values[field.id] || "—")}
                  </dd>
                </div>
              ))}
          </dl>
          <button
            type="button"
            className="ui-button ui-button-secondary"
            data-part-id="form-restart"
            onClick={() => {
              setComplete(false);
              setValues({});
              go(steps[0].id);
            }}
          >
            다시 작성
          </button>
        </section>
      ) : (
        <>
          <ol
            className="ui-step-list"
            aria-label="폼 진행 단계"
            data-part-id="form-steps"
          >
            {steps.map((s, i) => (
              <li
                key={s.id}
                data-part-id={itemSlot(s.id)}
                aria-current={i === index ? "step" : undefined}
              >
                <span data-part-id={itemSlot(s.id, "number")}>{i + 1}</span>
                <span {...binding("steps", s, "title")}>
                  {String(s.values.title)}
                </span>
              </li>
            ))}
          </ol>
          <form
            ref={form}
            noValidate
            data-part-id="form-body"
            onSubmit={(event) => {
              event.preventDefault();
              const invalid = validate(current);
              if (Object.keys(invalid).length) {
                setErrors(invalid);
                root.current?.ownerDocument.defaultView?.requestAnimationFrame(
                  () =>
                    form.current
                      ?.querySelector<HTMLElement>("[aria-invalid=true]")
                      ?.focus(),
                );
                return;
              }
              if (index < steps.length - 1) {
                go(steps[index + 1].id);
                return;
              }
              const allErrors = validate(fields);
              if (Object.keys(allErrors).length) {
                const first = steps.find((s) =>
                  fieldsForStep(fields, steps, s.id).some(
                    (f) => allErrors[f.id],
                  ),
                );
                if (first) go(first.id);
                setErrors(allErrors);
                root.current?.ownerDocument.defaultView?.requestAnimationFrame(
                  () =>
                    form.current
                      ?.querySelector<HTMLElement>("[aria-invalid=true]")
                      ?.focus(),
                );
                return;
              }
              setComplete(true);
              focusHeading();
            }}
          >
            <div data-part-id={itemSlot(step.id, "heading-group")}>
              <h3
                {...binding("steps", step, "title")}
                data-step-heading
                tabIndex={-1}
                data-part-id={itemSlot(step.id, "heading")}
              >
                {String(step.values.title)}
              </h3>
              <p {...binding("steps", step, "description")}>
                {String(step.values.description)}
              </p>
            </div>
            {current.map((field) => {
              const f = field.values,
                id = `${node.id}-${field.id}`,
                kind = String(f.kind),
                help = `${id}-help`,
                error = `${id}-error`;
              const common = {
                id,
                name: field.id,
                required: !!f.required,
                "aria-invalid": !!errors[field.id],
                "aria-describedby":
                  [f.help ? help : "", errors[field.id] ? error : ""]
                    .filter(Boolean)
                    .join(" ") || undefined,
                "data-part-id": itemSlot(field.id, "input"),
                value:
                  typeof values[field.id] === "string"
                    ? (values[field.id] as string)
                    : "",
                onChange: (
                  event: React.ChangeEvent<
                    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
                  >,
                ) => {
                  const value = event.target.value;
                  setValues((old) => ({ ...old, [field.id]: value }));
                  if (errors[field.id])
                    setErrors((old) => ({
                      ...old,
                      [field.id]: fieldError(field, value),
                    }));
                },
              };
              return (
                <div
                  key={field.id}
                  data-part-id={itemSlot(field.id)}
                  className={`ui-step-field ${kind === "checkbox" ? "ui-step-check" : ""}`}
                >
                  <label
                    htmlFor={id}
                    data-part-id={itemSlot(field.id, "label-group")}
                  >
                    <span {...binding("fields", field, "label")}>
                      {String(f.label)}
                    </span>
                    {f.required && (
                      <span
                        aria-hidden="true"
                        data-part-id={itemSlot(field.id, "required")}
                      >
                        {" "}
                        *
                      </span>
                    )}
                  </label>
                  {kind === "textarea" ? (
                    <textarea
                      {...common}
                      rows={4}
                      maxLength={20000}
                      placeholder={String(f.placeholder)}
                    />
                  ) : kind === "select" ? (
                    <select {...common}>
                      <option value="">
                        {String(f.placeholder || "선택하세요")}
                      </option>
                      {[
                        ...new Set(
                          String(f.options)
                            .split("\n")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        ),
                      ].map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  ) : kind === "checkbox" ? (
                    <input
                      {...common}
                      type="checkbox"
                      checked={values[field.id] === true}
                      onChange={(event) => {
                        const checked = event.target.checked;
                        setValues((old) => ({ ...old, [field.id]: checked }));
                        if (errors[field.id])
                          setErrors((old) => ({
                            ...old,
                            [field.id]: fieldError(field, checked),
                          }));
                      }}
                    />
                  ) : (
                    <input
                      {...common}
                      type={kind}
                      step={kind === "number" ? "any" : undefined}
                      maxLength={20000}
                      placeholder={String(f.placeholder)}
                    />
                  )}
                  {f.help && (
                    <small id={help} {...binding("fields", field, "help")}>
                      {String(f.help)}
                    </small>
                  )}
                  {errors[field.id] && (
                    <small
                      id={error}
                      data-part-id={itemSlot(field.id, "error")}
                      role="alert"
                    >
                      {errors[field.id]}
                    </small>
                  )}
                </div>
              );
            })}
            <div className="ui-step-actions" data-part-id="form-actions">
              <button
                type="button"
                disabled={index === 0}
                className="ui-button ui-button-secondary"
                data-part-id="form-previous"
                onClick={() => go(steps[index - 1].id)}
              >
                {String(node.props.previousLabel)}
              </button>
              <span data-part-id="form-count">
                {index + 1} / {steps.length}
              </span>
              <button
                type="submit"
                className="ui-button"
                data-part-id="form-next"
              >
                {String(
                  node.props[
                    index === steps.length - 1 ? "submitLabel" : "nextLabel"
                  ],
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
function RichText({ node }: { node: Node }) {
  const blocks = node.content?.blocks ?? [],
    content: ReactNode[] = [];
  const inline = (block: ContentItem) =>
    inlineRuns(String(block.values.text)).map((run, i) => {
      const props = {
        ...binding("blocks", block, "text"),
        "data-part-id": itemSlot(block.id, `run-${i}`),
        "data-rich-start": run.start,
        "data-rich-end": run.end,
      };
      if (run.kind === "link")
        return (
          <a key={i} {...props} href={run.href}>
            {run.text}
          </a>
        );
      const Tag = run.kind === "text" ? "span" : run.kind;
      return (
        <Tag key={i} {...props}>
          {run.text}
        </Tag>
      );
    });
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i],
      kind = block.values.kind;
    if (kind === "bullet" || kind === "number") {
      const items = [block];
      while (blocks[i + 1]?.values.kind === kind) items.push(blocks[++i]);
      const List = kind === "bullet" ? "ul" : "ol";
      content.push(
        <List key={block.id}>
          {items.map((item) => (
            <li key={item.id} data-part-id={itemSlot(item.id)}>
              {inline(item)}
            </li>
          ))}
        </List>,
      );
    } else {
      const Tag =
        kind === "heading"
          ? (block.values.level as "h2" | "h3" | "h4")
          : kind === "quote"
            ? "blockquote"
            : "p";
      content.push(
        <Tag key={block.id} data-part-id={itemSlot(block.id)}>
          {inline(block)}
        </Tag>,
      );
    }
  }
  return (
    <div
      className="ui-rich-text"
      data-part-id="rich-body"
      style={{ maxWidth: Number(node.props.width) }}
    >
      {content.length ? content : <p>본문 블록을 추가하세요.</p>}
    </div>
  );
}
export default function StoryContent({ node }: { node: Node }) {
  if (node.component === "scroll-chapters") return <Chapters node={node} />;
  if (node.component === "multi-step-form")
    return <StepForm key={String(node.props.initialStep)} node={node} />;
  return <RichText node={node} />;
}
