"use client";
import { useEffect, useState, type RefObject } from "react";
import { Slider } from "radix-ui";
import {
  Captions,
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { mediaBounds, mediaTime } from "./media-playback";

function Range({
  name,
  part,
  value,
  max,
  step,
  text,
  disabled,
  onChange,
}: {
  name: string;
  part: string;
  value: number;
  max: number;
  step: number;
  text: string;
  disabled: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <Slider.Root
      className="ui-media-range"
      data-part-id={`${part}-slider`}
      data-part-label={name}
      min={0}
      max={Math.max(max, step)}
      step={step}
      value={[Math.min(value, Math.max(max, step))]}
      disabled={disabled}
      onValueChange={([next]) => onChange(next)}
    >
      <Slider.Track
        className="ui-media-track"
        data-part-id={`${part}-track`}
        data-part-label={`${name} 배경`}
      >
        <Slider.Range
          className="ui-media-fill"
          data-part-id={`${part}-fill`}
          data-part-label={`${name} 채움`}
        />
      </Slider.Track>
      <Slider.Thumb
        className="ui-media-thumb"
        data-part-id={`${part}-thumb`}
        data-part-label={`${name} 손잡이`}
        aria-label={name}
        aria-valuetext={text}
      />
    </Slider.Root>
  );
}

export default function MediaControls({
  media,
  mediaRef,
  preview,
  video,
  start,
  end,
  muted,
  captions,
  shell,
}: {
  media: HTMLMediaElement | null;
  mediaRef: RefObject<HTMLMediaElement | null>;
  preview: boolean;
  video: boolean;
  start: number;
  end: number;
  muted: boolean;
  captions: boolean;
  shell: HTMLDivElement | null;
}) {
  const [state, setState] = useState({
    paused: true,
    time: start,
    duration: 0,
    ready: false,
    muted,
    volume: 1,
    rate: 1,
    captions,
    fullscreen: false,
  });
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!preview || !media) return;
    const doc = media.ownerDocument;
    const sync = () =>
      setState({
        paused: media.paused,
        time: media.currentTime,
        duration: media.duration,
        ready: media.readyState > 0 && !media.error,
        muted: media.muted,
        volume: media.volume,
        rate: media.playbackRate,
        captions: Array.from(media.textTracks).some(
          (track) => track.mode === "showing",
        ),
        fullscreen: doc.fullscreenElement === shell,
      });
    const events = [
      "loadedmetadata",
      "durationchange",
      "timeupdate",
      "play",
      "pause",
      "ended",
      "volumechange",
      "ratechange",
      "error",
      "emptied",
    ];
    for (const event of events) media.addEventListener(event, sync);
    media.textTracks.addEventListener("change", sync);
    doc.addEventListener("fullscreenchange", sync);
    sync();
    return () => {
      for (const event of events) media.removeEventListener(event, sync);
      media.textTracks.removeEventListener("change", sync);
      doc.removeEventListener("fullscreenchange", sync);
    };
  }, [media, preview, shell]);
  const bounds = mediaBounds(start, end, state.duration);
  const ready = preview && !!media && state.ready;
  const position = Math.max(
    0,
    Math.min(state.time - bounds.from, bounds.length),
  );
  const canSeek = ready && Number.isFinite(state.duration) && bounds.length > 0;
  const unavailable = preview && !ready;
  const play = async () => {
    const media = mediaRef.current;
    if (!ready || !media) return;
    setMessage("");
    if (!media.paused) {
      media.pause();
      return;
    }
    try {
      if (media.currentTime < bounds.from || media.currentTime >= bounds.to)
        media.currentTime = bounds.from;
      await media.play();
    } catch {
      setMessage(
        "재생을 시작하지 못했습니다. 재생 버튼을 다시 누르거나 파일을 확인하세요.",
      );
    }
  };
  return (
    <div
      className="ui-media-controls"
      data-part-id="media-controls"
      data-part-label="재생 컨트롤"
      data-editing={!preview || undefined}
    >
      <div
        className="ui-media-timeline"
        data-part-id="media-timeline"
        data-part-label="재생 진행 영역"
      >
        <button
          type="button"
          data-part-id="media-play"
          aria-label={state.paused ? "재생" : "일시 정지"}
          disabled={unavailable}
          onClick={() => void play()}
        >
          <Play
            data-part-id="media-play-icon"
            data-part-label="재생 아이콘"
            size={20}
            style={{ display: state.paused ? undefined : "none" }}
          />
          <Pause
            data-part-id="media-pause-icon"
            data-part-label="일시 정지 아이콘"
            size={20}
            style={{ display: state.paused ? "none" : undefined }}
          />
        </button>
        <Range
          part="media-seek"
          name="재생 위치"
          value={position}
          max={bounds.length}
          step={0.1}
          text={`${mediaTime(position)} / ${mediaTime(bounds.length)}`}
          disabled={!canSeek}
          onChange={(value) => {
            const media = mediaRef.current;
            if (canSeek && media) media.currentTime = bounds.from + value;
          }}
        />
        <span
          className="ui-media-time"
          data-part-id="media-time"
          data-part-label="시간 표시"
        >
          <span
            data-part-id="media-current"
            data-part-label="현재 시간"
            data-part-dynamic="true"
          >
            {mediaTime(position)}
          </span>
          <span aria-hidden="true" data-part-id="media-time-divider">
            {" "}
            /{" "}
          </span>
          <span
            data-part-id="media-duration"
            data-part-label="전체 구간 시간"
            data-part-dynamic="true"
          >
            {mediaTime(bounds.length)}
          </span>
        </span>
      </div>
      <div
        className="ui-media-options"
        data-part-id="media-options"
        data-part-label="소리와 재생 설정"
      >
        <button
          type="button"
          data-part-id="media-mute"
          aria-label={
            state.muted || state.volume === 0 ? "소리 켜기" : "음소거"
          }
          disabled={unavailable}
          onClick={() => {
            const media = mediaRef.current;
            if (ready && media) {
              if (media.volume === 0) {
                media.volume = 1;
                media.muted = false;
              } else media.muted = !media.muted;
            }
          }}
        >
          <Volume2
            size={18}
            data-part-id="media-sound-icon"
            data-part-label="소리 아이콘"
            style={{
              display: state.muted || state.volume === 0 ? "none" : undefined,
            }}
          />
          <VolumeX
            size={18}
            data-part-id="media-muted-icon"
            data-part-label="음소거 아이콘"
            style={{
              display: state.muted || state.volume === 0 ? undefined : "none",
            }}
          />
        </button>
        <Range
          part="media-volume"
          name="음량"
          value={state.muted ? 0 : state.volume * 100}
          max={100}
          step={1}
          text={`${Math.round((state.muted ? 0 : state.volume) * 100)}%`}
          disabled={!ready}
          onChange={(value) => {
            const media = mediaRef.current;
            if (ready && media) {
              media.volume = value / 100;
              media.muted = value === 0;
            }
          }}
        />
        <button
          type="button"
          className="ui-media-speed"
          data-part-id="media-speed"
          aria-label={`재생 속도 ${state.rate}배 · 누르면 변경`}
          disabled={unavailable}
          onClick={() => {
            const media = mediaRef.current;
            if (ready && media) {
              const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
              media.playbackRate =
                rates[(rates.indexOf(media.playbackRate) + 1) % rates.length];
            }
          }}
        >
          <span data-part-id="media-speed-label">속도</span>
          <span
            data-part-id="media-speed-value"
            data-part-label="현재 재생 속도"
            data-part-dynamic="true"
          >
            {state.rate}×
          </span>
        </button>
        {video && (
          <>
            <button
              type="button"
              data-part-id="media-captions"
              aria-label="자막"
              aria-pressed={state.captions}
              disabled={preview && (!ready || !captions)}
              onClick={() => {
                if (ready && media && captions) {
                  const tracks = Array.from(media.textTracks).filter(
                    (track) =>
                      track.kind === "captions" || track.kind === "subtitles",
                  );
                  tracks.forEach((track, index) => {
                    track.mode =
                      !state.captions && index === 0 ? "showing" : "hidden";
                  });
                }
              }}
            >
              <Captions
                size={20}
                data-part-id="media-captions-icon"
                data-part-label="자막 아이콘"
              />
            </button>
            <button
              type="button"
              data-part-id="media-fullscreen"
              aria-label={state.fullscreen ? "전체 화면 닫기" : "전체 화면"}
              disabled={
                preview &&
                (!shell?.requestFullscreen ||
                  !shell.ownerDocument.fullscreenEnabled)
              }
              onClick={async () => {
                if (!preview || !shell) return;
                try {
                  if (shell.ownerDocument.fullscreenElement === shell)
                    await shell.ownerDocument.exitFullscreen();
                  else await shell.requestFullscreen();
                } catch {
                  setMessage("이 화면에서는 전체 화면을 열 수 없습니다.");
                }
              }}
            >
              <Maximize
                size={18}
                data-part-id="media-expand-icon"
                data-part-label="전체 화면 아이콘"
                style={{ display: state.fullscreen ? "none" : undefined }}
              />
              <Minimize
                size={18}
                data-part-id="media-collapse-icon"
                data-part-label="전체 화면 닫기 아이콘"
                style={{ display: state.fullscreen ? undefined : "none" }}
              />
            </button>
          </>
        )}
      </div>
      {message && (
        <p
          className="ui-media-control-message"
          data-part-id="media-control-message"
          role="status"
        >
          {message}
        </p>
      )}
    </div>
  );
}
