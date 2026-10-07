"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { Slider } from "radix-ui";
import { Pause, Play, RotateCcw } from "lucide-react";
import type { Project } from "./model";
import { createMotionRuntime, type MotionRuntime } from "./motion-runtime";

const empty = {
  count: 0,
  total: 0,
  paused: false,
  progress: 0,
  still: false,
  noTarget: 0,
  failed: false,
};
export default function MotionPlayback({
  root,
  project,
  selectedIds,
}: {
  root: HTMLElement | null;
  project: Project;
  selectedIds?: string[];
}) {
  const runtime = useRef<MotionRuntime | null>(null);
  const [snapshot, setSnapshot] = useState(empty);
  const [scope, setScope] = useState("page");
  const ids = useRef<string[] | undefined>(undefined);
  useLayoutEffect(() => {
    ids.current = scope === "selected" ? selectedIds : undefined;
  }, [scope, selectedIds]);
  useLayoutEffect(() => {
    if (!root) return;
    let active = true;
    if (!root.querySelector(".ui-node[data-motion]:not([data-motion=none])")) {
      root.ownerDocument.defaultView?.queueMicrotask(() => {
        if (active) setSnapshot(empty);
      });
      return () => {
        active = false;
      };
    }
    const refresh = () =>
      root.ownerDocument.defaultView?.queueMicrotask(() => {
        if (active && runtime.current)
          setSnapshot(runtime.current.snapshot(ids.current));
      });
    const controller = createMotionRuntime(root, project, refresh);
    runtime.current = controller;
    const timer = root.ownerDocument.defaultView!.setInterval(refresh, 200);
    refresh();
    return () => {
      active = false;
      root.ownerDocument.defaultView?.clearInterval(timer);
      controller.dispose();
      runtime.current = null;
    };
  }, [root, project]);
  if (!snapshot.total && scope === "page") return null;
  return (
    <aside className="studio-motion-controls" aria-label="모션 재생 제어">
      {selectedIds?.length ? (
        <select
          aria-label="모션 재생 범위"
          value={scope}
          onChange={(event) => setScope(event.target.value)}
        >
          <option value="page">페이지 전체</option>
          <option value="selected">선택한 요소·하위 요소</option>
        </select>
      ) : (
        <span>모션</span>
      )}
      <button
        type="button"
        aria-label={snapshot.paused ? "모션 재생" : "모션 일시 정지"}
        disabled={!snapshot.count}
        onClick={() => {
          if (snapshot.paused) runtime.current?.play(ids.current);
          else runtime.current?.pause(ids.current);
        }}
      >
        {snapshot.paused ? <Play size={16} /> : <Pause size={16} />}
      </button>
      <button
        type="button"
        aria-label="모션 처음부터"
        disabled={!snapshot.count}
        onClick={() => runtime.current?.restart(ids.current)}
      >
        <RotateCcw size={16} />
      </button>
      <Slider.Root
        className="studio-motion-slider"
        aria-label="모션 진행 위치"
        value={[snapshot.progress]}
        min={0}
        max={100}
        step={1}
        disabled={!snapshot.count}
        onValueChange={(values) =>
          runtime.current?.seek(values[0] / 100, ids.current)
        }
      >
        <Slider.Track className="studio-motion-track">
          <Slider.Range className="studio-motion-range" />
        </Slider.Track>
        <Slider.Thumb
          className="studio-motion-thumb"
          aria-label="모션 진행 위치"
          aria-valuetext={`${snapshot.progress}% · 한 주기`}
        />
      </Slider.Root>
      <output>
        {snapshot.still
          ? "움직임 감소·모바일 정지"
          : snapshot.failed
            ? "효과를 불러오지 못했습니다"
            : !snapshot.count
              ? "재생 가능한 대상 없음"
              : `${snapshot.progress}% · 한 주기`}
      </output>
    </aside>
  );
}
