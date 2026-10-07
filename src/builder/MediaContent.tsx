"use client";
/* eslint-disable @next/next/no-img-element -- User-authored media posters. */
import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Headphones } from "lucide-react";
import type { Node } from "./model";
import { useAssetSource } from "./AssetProvider";
import MediaControls from "./MediaControls";
import { mediaBounds } from "./media-playback";

export default function MediaContent({
  node,
  preview,
}: {
  node: Node;
  preview: boolean;
}) {
  const source = useAssetSource(String(node.props.src)),
    poster = useAssetSource(String(node.props.poster)),
    captions = useAssetSource(String(node.props.captions ?? ""));
  const media = useRef<HTMLMediaElement | null>(null),
    shell = useRef<HTMLDivElement>(null);
  const [mediaElement, setMediaElement] = useState<HTMLMediaElement | null>(
    null,
  );
  const [shellElement, setShellElement] = useState<HTMLDivElement | null>(null);
  const shellRef = useCallback((element: HTMLDivElement | null) => {
    shell.current = element;
    setShellElement(element);
  }, []);
  const mediaRef = useCallback((element: HTMLMediaElement | null) => {
    media.current = element;
    setMediaElement(element);
  }, []);
  // An absent flag belongs to an older document and retains its native controls.
  const editableControls = node.props.editableControls === true;
  const [failed, setFailed] = useState("");
  const [posterFailed, setPosterFailed] = useState("");
  const hasPoster = !!poster.src && posterFailed !== poster.src;
  const isVideo = node.component === "video-player",
    title = String(node.props.title);
  const start = Number(node.props.start) || 0,
    end = Number(node.props.end) || 0;
  useEffect(() => {
    const el = media.current,
      wrapper = shell.current,
      view = wrapper?.ownerDocument.defaultView;
    if (!preview || !el || !view || !wrapper || !source.src) return;
    // React Strict Mode replays effects on mount. Restore the source released by
    // cleanup even when React's unchanged src prop does not write it again.
    if (el.getAttribute("src") !== source.src) el.src = source.src;
    let attempted = false;
    const reduced = view.matchMedia("(prefers-reduced-motion: reduce)");
    const pause = () => {
      if (wrapper.ownerDocument.hidden || reduced.matches) el.pause();
    };
    const observer = new view.IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting;
        if (!visible) el.pause();
        else if (
          !attempted &&
          isVideo &&
          node.props.autoplay &&
          !reduced.matches &&
          !wrapper.ownerDocument.hidden
        ) {
          attempted = true;
          el.muted = true;
          void el.play().catch(() => {
            /* Manual play controls remain available. */
          });
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(wrapper);
    wrapper.ownerDocument.addEventListener("visibilitychange", pause);
    reduced.addEventListener("change", pause);
    return () => {
      observer.disconnect();
      wrapper.ownerDocument.removeEventListener("visibilitychange", pause);
      reduced.removeEventListener("change", pause);
      el.pause();
      el.removeAttribute("src");
      el.load();
    };
  }, [preview, source.src, isVideo, node.props.autoplay, failed]);
  const seekStart = (el: HTMLMediaElement) => {
    el.currentTime = mediaBounds(start, end, el.duration).from;
  };
  const status = source.pending
    ? "파일을 불러오는 중…"
    : source.missing
      ? "이 브라우저에 원본이 없습니다. 자산 포함 ZIP을 가져오세요."
      : failed === source.src && !!source.src
        ? "미디어를 재생할 수 없습니다. 파일 형식과 주소를 확인하세요."
        : "재생할 파일을 선택하세요";
  const problem =
    preview && (source.missing || (!!source.src && failed === source.src));
  const posterContent = (
    <div
      className="ui-media-poster"
      data-media-fallback={!hasPoster || undefined}
    >
      {hasPoster ? (
        <img
          src={poster.src}
          alt={title}
          onError={() => setPosterFailed(poster.src)}
        />
      ) : (
        <div>
          <span>{isVideo ? <Play size={30} /> : <Headphones size={30} />}</span>
          <p>
            {preview && source.src && !problem
              ? title
              : !preview && source.src
                ? "미리보기에서 재생됩니다"
                : status}
          </p>
        </div>
      )}
    </div>
  );
  const props = {
    src: source.src,
    controls: !editableControls,
    preload: "metadata",
    "aria-label": title,
    onError: () => setFailed(source.src),
    onLoadedMetadata: (e: React.SyntheticEvent<HTMLMediaElement>) =>
      seekStart(e.currentTarget),
    onTimeUpdate: (e: React.SyntheticEvent<HTMLMediaElement>) => {
      const el = e.currentTarget;
      const bounds = mediaBounds(start, end, el.duration);
      if (end > start && el.currentTime >= bounds.to && !el.paused) {
        if (node.props.loop) seekStart(el);
        else {
          el.pause();
          el.currentTime = bounds.to;
        }
      }
    },
    onPlay: (e: React.SyntheticEvent<HTMLMediaElement>) => {
      const el = e.currentTarget;
      if (el.currentTime < start || (end > start && el.currentTime >= end))
        seekStart(el);
    },
    onEnded: (e: React.SyntheticEvent<HTMLMediaElement>) => {
      if (node.props.loop) {
        seekStart(e.currentTarget);
        void e.currentTarget.play().catch(() => {});
      }
    },
  };
  return (
    <section
      ref={shellRef}
      className={`ui-media ${isVideo ? "ui-media-video" : "ui-media-audio"}`}
      data-editable-controls={editableControls || undefined}
    >
      <div
        className="ui-media-stage"
        data-part-id="media-stage"
        data-part-label="미디어 화면"
        style={isVideo ? { aspectRatio: String(node.props.ratio) } : undefined}
      >
        {preview && source.src && failed !== source.src ? (
          isVideo ? (
            <video
              {...props}
              ref={mediaRef}
              poster={poster.src || undefined}
              muted={Boolean(node.props.muted)}
              playsInline
              style={{
                objectFit: node.props.fit === "cover" ? "cover" : "contain",
              }}
            >
              {captions.src && (
                <track
                  kind="captions"
                  src={captions.src}
                  srcLang="ko"
                  label="한국어"
                  default
                />
              )}
            </video>
          ) : (
            <>
              {editableControls ? (
                posterContent
              ) : (
                <Headphones size={32} data-part-id="media-audio-icon" />
              )}
              <audio {...props} ref={mediaRef} />
            </>
          )
        ) : (
          posterContent
        )}
      </div>
      {problem && hasPoster && (
        <p className="ui-media-error" role="status">
          {status}
        </p>
      )}
      <div className="ui-media-caption" data-part-id="media-caption">
        <strong data-part-id="title">{title}</strong>
        {Number(node.props.start) > 0 && <small>{start}초부터 재생</small>}
      </div>
      {String(node.props.transcript) && (
        <details
          className="ui-media-transcript"
          data-part-id="media-transcript"
        >
          <summary data-part-id="media-transcript-toggle">대본 보기</summary>
          <p data-part-id="media-transcript-body">
            {String(node.props.transcript)}
          </p>
        </details>
      )}
      {editableControls && (
        <MediaControls
          key={`${preview}-${source.src}`}
          media={mediaElement}
          mediaRef={media}
          shell={shellElement}
          preview={preview}
          video={isVideo}
          start={start}
          end={end}
          muted={Boolean(node.props.muted)}
          captions={!!captions.src}
        />
      )}
    </section>
  );
}
