"use client";
/* eslint-disable @next/next/no-img-element -- Authored image assets are resolved locally. */
import { useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, X, Maximize2 } from "lucide-react";
import { useAssetSource } from "./AssetProvider";
import type { Node } from "./model";
import { itemSlot, type ContentItem } from "./content-items";

function Image({
  source,
  alt,
  index = 0,
  slot,
}: {
  source: string;
  alt: string;
  index?: number;
  slot?: string;
}) {
  const { src, missing, pending, eager } = useAssetSource(source),
    [failed, setFailed] = useState("");
  if (src && failed !== src)
    return (
      <img
        data-part-id={slot}
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        onError={() => setFailed(src)}
      />
    );
  return (
    <div
      data-part-id={slot}
      className={`ui-x-gallery-art art-${index % 3}`}
      role="img"
      aria-label={alt || "작품 이미지 자리"}
    >
      <i />
      <b>{String(index + 1).padStart(2, "0")}</b>
      {(pending || missing || failed) && (
        <span className="ui-image-status">
          {pending
            ? "불러오는 중…"
            : missing
              ? "원본 없음 · 자산 포함 ZIP을 가져오세요"
              : "이미지를 불러올 수 없습니다"}
        </span>
      )}
    </div>
  );
}
function text(item: ContentItem, field: string) {
  return String(item.values[field] ?? "");
}
function Gallery({ node, preview }: { node: Node; preview: boolean }) {
  const items = node.content?.items ?? [],
    lightbox = node.component === "image-lightbox";
  const [activeId, setActiveId] = useState<string | null>(null),
    dialog = useRef<HTMLDialogElement>(null),
    opener = useRef<HTMLButtonElement | null>(null);
  const index = Math.max(
      0,
      items.findIndex((item) => item.id === activeId),
    ),
    active = items[index];
  const close = () => {
    dialog.current?.close();
    opener.current?.focus();
  };
  const step = (by: number) =>
    setActiveId(items[(index + by + items.length) % items.length]?.id ?? null);
  return (
    <section className="ui-x-gallery ui-image-collection">
      <h2 data-part-id="title">{String(node.props.title)}</h2>
      <div>
        {items.map((item, i) => (
          <article key={item.id} data-part-id={itemSlot(item.id)}>
            {lightbox ? (
              <button
                type="button"
                className="ui-gallery-open"
                aria-label={`사진 크게 보기: ${text(item, "title")}`}
                onClick={(e) => {
                  if (!preview) return;
                  opener.current = e.currentTarget;
                  setActiveId(item.id);
                  dialog.current?.showModal();
                }}
              >
                <Image
                  source={text(item, "src")}
                  alt={text(item, "alt") || text(item, "title")}
                  index={i}
                  slot={itemSlot(item.id, "image")}
                />
                <Maximize2
                  className="ui-gallery-enlarge"
                  aria-hidden="true"
                  size={18}
                />
              </button>
            ) : (
              <Image
                source={text(item, "src")}
                alt={text(item, "alt") || text(item, "title")}
                index={i}
                slot={itemSlot(item.id, "image")}
              />
            )}
            <small
              data-part-id={itemSlot(item.id, "category")}
              data-content-key="items"
              data-content-item={item.id}
              data-content-field="category"
            >
              {text(item, "category")}
            </small>
            <h3
              data-part-id={itemSlot(item.id, "title")}
              data-content-key="items"
              data-content-item={item.id}
              data-content-field="title"
            >
              {text(item, "title")}
            </h3>
            {text(item, "caption") && (
              <p
                data-part-id={itemSlot(item.id, "caption")}
                data-content-key="items"
                data-content-item={item.id}
                data-content-field="caption"
              >
                {text(item, "caption")}
              </p>
            )}
          </article>
        ))}
      </div>
      {!items.length && <p>사진을 추가하면 여기에 표시됩니다.</p>}
      {lightbox && preview && (
        <dialog
          ref={dialog}
          className="ui-image-lightbox"
          aria-label={String(node.props.title)}
          onClose={() => opener.current?.focus()}
          onCancel={(event) => {
            event.preventDefault();
            close();
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              step(-1);
            }
            if (e.key === "ArrowRight") {
              e.preventDefault();
              step(1);
            }
          }}
        >
          <div className="ui-lightbox-toolbar">
            <span aria-live="polite">
              {index + 1} / {items.length}
            </span>
            <button type="button" aria-label="사진 닫기" onClick={close}>
              <X size={20} />
            </button>
          </div>
          {active && (
            <figure>
              <Image
                source={text(active, "src")}
                alt={text(active, "alt") || text(active, "title")}
              />
              <figcaption>
                <strong>{text(active, "title")}</strong>
                <p>{text(active, "caption")}</p>
              </figcaption>
            </figure>
          )}
          <div className="ui-lightbox-nav">
            <button
              type="button"
              aria-label="이전 사진"
              disabled={items.length < 2}
              onClick={() => step(-1)}
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="다음 사진"
              disabled={items.length < 2}
              onClick={() => step(1)}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </dialog>
      )}
    </section>
  );
}
function Compare({ node }: { node: Node }) {
  const authored = Number(node.props.position),
    [drag, setDrag] = useState({ authored, value: authored });
  const value = drag.authored === authored ? drag.value : authored;
  return (
    <section className="ui-image-compare">
      <h2 data-part-id="title">{String(node.props.title)}</h2>
      <div
        className="ui-compare-stage"
        style={
          {
            aspectRatio: String(node.props.ratio),
            "--compare": `${value}%`,
          } as CSSProperties
        }
      >
        <div className="ui-compare-after">
          <Image
            source={String(node.props.after)}
            alt={String(node.props.afterLabel)}
            index={1}
          />
        </div>
        <div className="ui-compare-before">
          <Image
            source={String(node.props.before)}
            alt={String(node.props.beforeLabel)}
          />
        </div>
        <span className="ui-compare-line" aria-hidden="true" />
        <span className="ui-compare-label before">
          {String(node.props.beforeLabel)}
        </span>
        <span className="ui-compare-label after">
          {String(node.props.afterLabel)}
        </span>
      </div>
      <label className="ui-compare-control">
        <span>이미지 비교 · {value}%</span>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={value}
          aria-label="이미지 분할 위치"
          aria-valuetext={`이전 이미지 ${value}%`}
          onChange={(e) => setDrag({ authored, value: Number(e.target.value) })}
        />
      </label>
    </section>
  );
}
function Hotspot({ node }: { node: Node }) {
  const items = node.content?.items ?? [],
    [active, setActive] = useState("");
  return (
    <section className="ui-image-hotspot">
      <h2 data-part-id="title">{String(node.props.title)}</h2>
      <div
        className="ui-hotspot-stage"
        style={{ aspectRatio: String(node.props.ratio) }}
      >
        <Image source={String(node.props.src)} alt={String(node.props.alt)} />
        {items.map((item, index) => (
          <button
            className="ui-hotspot-dot"
            type="button"
            key={item.id}
            aria-label={`${index + 1}. ${text(item, "title")}`}
            aria-expanded={active === item.id}
            aria-controls={`${node.id}-${item.id}`}
            style={{
              left: `${Number(item.values.x)}%`,
              top: `${Number(item.values.y)}%`,
            }}
            onClick={() => setActive(active === item.id ? "" : item.id)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className="ui-hotspot-descriptions">
        {items.map((item, i) => (
          <details
            key={item.id}
            open={active === item.id}
            onToggle={(e) => {
              if (e.currentTarget.open && active !== item.id)
                setActive(item.id);
            }}
          >
            <summary
              onClick={(e) => {
                e.preventDefault();
                setActive(active === item.id ? "" : item.id);
              }}
              data-part-id={itemSlot(item.id, "title")}
              data-content-key="items"
              data-content-item={item.id}
              data-content-field="title"
            >
              {i + 1}. {text(item, "title")}
            </summary>
            <p
              id={`${node.id}-${item.id}`}
              data-part-id={itemSlot(item.id, "body")}
              data-content-key="items"
              data-content-item={item.id}
              data-content-field="body"
            >
              {text(item, "body")}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
export default function ImageContent({
  node,
  preview,
}: {
  node: Node;
  preview: boolean;
}) {
  if (node.component === "image-compare") return <Compare node={node} />;
  if (node.component === "image-hotspot") return <Hotspot node={node} />;
  return <Gallery node={node} preview={preview} />;
}
