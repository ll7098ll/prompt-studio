import type { Project } from "./model";
import { preservePartTargets } from "./component-parts";
import {
  isRuntimeMotion,
  resolveMotion,
  scrollMotionProgress,
  type ResolvedMotion,
} from "./motion-settings";

type Handle = {
  play(): void;
  pause(): void;
  cancel(): void;
  time: number;
  speed: number;
  endTime?: number;
  readonly state: string;
};
type Track = {
  element: HTMLElement;
  config: ResolvedMotion;
  handles: Handle[];
  length: number;
  visible: boolean;
  entered: boolean;
  started: boolean;
  paused: boolean;
  manual: boolean;
  done: boolean;
  still: boolean;
  restore: (() => void)[];
};
const interactive =
  "a,button,input,textarea,select,summary,[role=button],[role=slider],[data-part-dynamic],svg,video,audio,canvas,[aria-hidden=true]";

// Animate content, not layout boxes. A container synchronizes its leaf contents;
// descendants with their own effect own their targets and are excluded.
function contentTargets(element: HTMLElement) {
  const leaves = element.classList.contains("ui-container")
    ? Array.from(
        element.querySelectorAll<HTMLElement>(".ui-node:not(.ui-container)"),
      )
    : [element];
  return leaves
    .filter((leaf) => {
      let parent: HTMLElement | null = leaf;
      while (parent && parent !== element) {
        if (parent.dataset.motion && parent.dataset.motion !== "none")
          return false;
        parent = parent.parentElement?.closest<HTMLElement>(".ui-node") ?? null;
      }
      return true;
    })
    .flatMap((leaf) =>
      Array.from(leaf.children).filter(
        (child): child is HTMLElement =>
          child.namespaceURI === "http://www.w3.org/1999/xhtml" &&
          !child.matches("style,script,.ui-parts-marker"),
      ),
    );
}

function splitWords(targets: HTMLElement[], restore: (() => void)[]) {
  const spans: HTMLElement[] = [];
  for (const target of targets) {
    const doc = target.ownerDocument;
    const walker = doc.createTreeWalker(target, 4); // SHOW_TEXT, independent of host realm.
    const texts: Text[] = [];
    while (walker.nextNode()) {
      const text = walker.currentNode as Text,
        parent = text.parentElement;
      if (
        text.textContent?.trim() &&
        parent?.closest("h1,h2,h3,h4,h5,h6,p,blockquote") &&
        !parent.closest(interactive)
      )
        texts.push(text);
    }
    for (const original of texts) {
      const nodes = (original.textContent ?? "")
        .split(/(\s+)/)
        .filter(Boolean)
        .map((word) => {
          if (/^\s+$/.test(word)) return doc.createTextNode(word);
          const span = doc.createElement("span");
          span.className = "studio-motion-word";
          span.textContent = word;
          spans.push(span);
          return span;
        });
      original.replaceWith(...nodes);
      restore.push(() => {
        const first = nodes[0];
        if (first?.parentNode) first.replaceWith(original);
        nodes.slice(1).forEach((node) => node.remove());
      });
    }
  }
  return spans;
}

function legacyHandles(element: HTMLElement): Handle[] {
  // A cancelled CSS animation will not restart merely by reading getAnimations.
  // Recreate it after a viewport/reduced-motion rebuild without changing layout.
  const original = element.style.getPropertyValue("animation-name");
  const priority = element.style.getPropertyPriority("animation-name");
  element.style.setProperty("animation-name", "none");
  void element.ownerDocument.defaultView!.getComputedStyle(element)
    .animationName;
  if (original) element.style.setProperty("animation-name", original, priority);
  else element.style.removeProperty("animation-name");
  return element
    .getAnimations()
    .filter(
      (animation) =>
        "animationName" in animation &&
        String(animation.animationName).startsWith("studio-"),
    )
    .map((animation) => ({
      play: () => animation.play(),
      pause: () => animation.pause(),
      cancel: () => animation.cancel(),
      get time() {
        return Number(animation.currentTime ?? 0) / 1000;
      },
      set time(value: number) {
        animation.currentTime = value * 1000;
      },
      get speed() {
        return animation.playbackRate;
      },
      set speed(value: number) {
        animation.playbackRate = value;
      },
      get state() {
        return animation.playState;
      },
    }));
}

export function createMotionRuntime(
  root: HTMLElement,
  project: Project,
  onChange: () => void,
) {
  const doc = root.ownerDocument,
    view = doc.defaultView!;
  const reduced = view.matchMedia("(prefers-reduced-motion: reduce)"),
    mobile = view.matchMedia("(max-width:767px)");
  let disposed = false,
    frame = 0,
    generation = 0;
  let tracks: Track[] = [];
  const cleanups: (() => void)[] = [];
  const scoped = (ids?: string[]) =>
    tracks.filter(
      (track) =>
        !ids ||
        ids.some((id) => {
          let element: HTMLElement | null = track.element;
          while (element && element !== root) {
            if (element.id === id) return true;
            element = element.parentElement;
          }
          return false;
        }),
    );
  const seekTrack = (track: Track, progress: number) => {
    track.done = false;
    track.handles.forEach((handle) => {
      handle.pause();
      handle.speed = 1;
      handle.time = track.length * progress;
    });
  };
  const sync = (track: Track) => {
    if (disposed || track.still) return;
    const blocked =
      track.paused || !track.visible || doc.hidden || !track.started;
    track.element.dataset.motionPaused = String(blocked);
    if (blocked || (track.config.trigger === "scroll" && !track.manual))
      track.handles.forEach((handle) => handle.pause());
    else if (!track.done)
      track.handles.forEach((handle) => {
        if (handle.state !== "finished") handle.play();
      });
  };
  const restartTrack = (track: Track, manual: boolean) => {
    if (track.still) return;
    track.started = true;
    track.manual = manual;
    track.paused = false;
    seekTrack(track, 0);
    sync(track);
  };
  const updateScroll = () => {
    frame = 0;
    for (const track of tracks) {
      if (
        track.still ||
        track.paused ||
        track.manual ||
        track.config.trigger !== "scroll" ||
        doc.hidden
      )
        continue;
      const rect = track.element.getBoundingClientRect();
      seekTrack(
        track,
        scrollMotionProgress(
          rect.top,
          rect.height,
          view.innerHeight,
          track.config.scrollStart,
          track.config.scrollEnd,
        ),
      );
    }
    onChange();
  };
  const requestScroll = () => {
    if (!frame) frame = view.requestAnimationFrame(updateScroll);
  };
  const listen = (target: EventTarget, event: string, fn: EventListener) => {
    target.addEventListener(event, fn);
    cleanups.push(() => target.removeEventListener(event, fn));
  };
  const destroyTracks = () => {
    cleanups
      .splice(0)
      .reverse()
      .forEach((cleanup) => cleanup());
    for (const track of tracks) {
      track.handles.forEach((handle) => handle.cancel());
      track.restore.reverse().forEach((restore) => restore());
      for (const key of [
        "motionReady",
        "motionPaused",
        "motionVisible",
        "motionStatus",
      ])
        delete track.element.dataset[key];
    }
    tracks = [];
  };

  async function setup() {
    const current = ++generation;
    destroyTracks();
    tracks = Array.from(
      root.querySelectorAll<HTMLElement>(
        ".ui-node[data-motion]:not([data-motion=none])",
      ),
    )
      .filter((element) => project.nodes[element.id])
      .map((element) => {
        const config = resolveMotion(project.nodes[element.id], project.theme);
        const rect = element.getBoundingClientRect();
        const still =
          reduced.matches || (mobile.matches && config.mobile === "still");
        element.dataset.motionStatus = still ? "still" : "loading";
        return {
          element,
          config,
          handles: [],
          length: config.delay + config.duration,
          visible: rect.bottom > 0 && rect.top < view.innerHeight,
          entered: false,
          started: config.trigger === "load" || config.trigger === "scroll",
          paused: false,
          manual: false,
          done: false,
          still,
          restore: [],
        };
      });
    // Load the engine only when a supported new effect can actually play.
    let mini: typeof import("motion/mini") | undefined;
    try {
      if (
        tracks.some(
          (track) => !track.still && isRuntimeMotion(track.config.preset),
        )
      )
        mini = await import("motion/mini");
    } catch {
      if (disposed || current !== generation) return;
      tracks
        .filter((track) => isRuntimeMotion(track.config.preset))
        .forEach((track) => {
          track.still = true;
          track.element.dataset.motionStatus = "unavailable";
        });
    }
    if (disposed || current !== generation) return;
    for (const track of tracks) {
      if (track.still) continue;
      const { config, element } = track;
      if (isRuntimeMotion(config.preset) && mini) {
        let targets = contentTargets(element);
        if (config.preset === "words") {
          const leaves = new Set(
            targets.map((target) => target.closest<HTMLElement>(".ui-node")!),
          );
          leaves.forEach((leaf) =>
            track.restore.push(
              preservePartTargets(leaf, project.nodes[leaf.id]?.parts),
            ),
          );
          targets = splitWords(targets, track.restore);
        }
        const ease = {
          ease: [0.25, 0.1, 0.25, 1],
          linear: [0, 0, 1, 1],
          "ease-in": [0.42, 0, 1, 1],
          "ease-out": [0, 0, 0.58, 1],
          "ease-in-out": [0.42, 0, 0.58, 1],
        }[config.easing] as [number, number, number, number];
        targets.forEach((target, index) => {
          const delta = config.intensity;
          const frames: Record<string, (string | number)[]> =
            config.preset === "words"
              ? {
                  opacity: [Math.max(0, 1 - delta), 1],
                  translate: [`0 ${20 * delta}px`, "0 0"],
                }
              : config.preset === "mask"
                ? {
                    clipPath: [
                      `inset(0 ${Math.min(100, 100 * delta)}% 0 0)`,
                      "inset(0 0% 0 0)",
                    ],
                  }
                : config.preset === "parallax"
                  ? { translate: [`0 ${40 * delta}px`, `0 ${-40 * delta}px`] }
                  : { scale: [1 - 0.12 * delta, 1 + 0.12 * delta] };
          for (const prop of Object.keys(frames)) {
            const cssProp = prop.replace(
              /[A-Z]/g,
              (char) => `-${char.toLowerCase()}`,
            );
            const value = target.style.getPropertyValue(cssProp),
              priority = target.style.getPropertyPriority(cssProp);
            track.restore.push(() => {
              if (value) target.style.setProperty(cssProp, value, priority);
              else target.style.removeProperty(cssProp);
            });
          }
          const offset = config.preset === "words" ? index * config.stagger : 0;
          // Passing a list avoids the host EventTarget instanceof check on iframe nodes.
          const animation = mini!.animate([target], frames, {
            duration: config.duration,
            delay: config.delay + offset,
            ease,
            repeat:
              config.trigger === "scroll"
                ? 0
                : config.iterations === 0
                  ? Infinity
                  : config.iterations - 1,
            autoplay: false,
          });
          track.handles.push(
            Object.assign(animation, {
              endTime:
                config.delay +
                offset +
                config.duration *
                  (config.trigger === "scroll" ? 1 : config.iterations || 1),
            }),
          );
          track.length = Math.max(
            track.length,
            config.delay + offset + config.duration,
          );
        });
      } else track.handles = legacyHandles(element);
      element.dataset.motionReady = "true";
      element.dataset.motionStatus = track.handles.length
        ? "ready"
        : "no-target";
      if (!track.handles.length) continue;
      const idleProgress = ["lift", "tilt"].includes(config.preset) ? 0 : 1;
      seekTrack(
        track,
        config.trigger === "hover" || config.trigger === "press"
          ? idleProgress
          : 0,
      );
      // One observer per track preserves its individual threshold and lifecycle.
      const observer = new view.IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            track.visible = entry.isIntersecting;
            element.dataset.motionVisible = String(track.visible);
            const entered =
              entry.isIntersecting &&
              entry.intersectionRatio >= config.threshold;
            if (
              config.trigger === "view" &&
              entered &&
              !track.entered &&
              (!config.once || !track.started)
            )
              restartTrack(track, false);
            if (config.trigger === "view" && !entered && !config.once) {
              track.started = false;
              seekTrack(track, 0);
            }
            track.entered = entered;
            sync(track);
          }
        },
        { threshold: [...new Set([0, config.threshold])] },
      );
      observer.observe(element);
      cleanups.push(() => observer.disconnect());
      if (
        ["fade", "slide", "scale", "reveal", "words", "mask"].includes(
          config.preset,
        ) &&
        !["hover", "press"].includes(config.trigger)
      ) {
        listen(element, "focusin", (event) => {
          const target = event.target as Element;
          if (
            !target.closest(
              "a,button,input,textarea,select,summary,[role=button],[role=slider]",
            )
          )
            return;
          // Keyboard users must never land on a clipped or transparent control.
          track.started = true;
          track.paused = true;
          track.manual = true;
          seekTrack(track, 1);
          sync(track);
          onChange();
        });
      }
      if (config.trigger === "hover" || config.trigger === "press") {
        const oldTabIndex = element.getAttribute("tabindex");
        if (!element.querySelector("a,button,input,select,textarea,[tabindex]"))
          element.tabIndex = 0;
        track.restore.push(() => {
          if (oldTabIndex === null) element.removeAttribute("tabindex");
          else element.setAttribute("tabindex", oldTabIndex);
        });
        const start = () => {
          if (!track.paused) restartTrack(track, false);
        };
        if (config.trigger === "hover") {
          listen(element, "pointerenter", start);
          listen(element, "focusin", start);
          const leave = () => {
            if (
              !element.matches(":hover") &&
              !element.contains(doc.activeElement)
            ) {
              if (["lift", "tilt"].includes(config.preset) && !track.paused) {
                track.done = false;
                track.started = true;
                track.handles.forEach((handle) => {
                  handle.speed = -1;
                  handle.play();
                });
              } else {
                track.started = false;
                seekTrack(track, idleProgress);
              }
              sync(track);
            }
          };
          listen(element, "pointerleave", leave);
          listen(element, "focusout", () => view.queueMicrotask(leave));
        } else {
          listen(element, "click", start);
          listen(element, "keydown", (event) => {
            const key = event as KeyboardEvent;
            if (
              key.target === element &&
              (key.key === "Enter" || key.key === " ")
            ) {
              key.preventDefault();
              start();
            }
          });
        }
      }
      sync(track);
    }
    listen(view, "scroll", requestScroll);
    listen(view, "resize", requestScroll);
    listen(doc, "visibilitychange", () => {
      tracks.forEach(sync);
      requestScroll();
    });
    requestScroll();
    onChange();
  }
  const rebuild = () => {
    void setup();
  };
  reduced.addEventListener("change", rebuild);
  mobile.addEventListener("change", rebuild);
  void setup();
  return {
    pause(ids?: string[]) {
      scoped(ids).forEach((track) => {
        track.paused = true;
        sync(track);
      });
      onChange();
    },
    play(ids?: string[]) {
      scoped(ids).forEach((track) => {
        track.paused = false;
        track.manual = false;
        track.started = true;
        if (
          track.done ||
          track.handles.every((handle) => handle.state === "finished")
        )
          seekTrack(track, 0);
        sync(track);
      });
      requestScroll();
      onChange();
    },
    restart(ids?: string[]) {
      scoped(ids).forEach((track) => restartTrack(track, true));
      onChange();
    },
    seek(progress: number, ids?: string[]) {
      scoped(ids)
        .filter((track) => !track.still)
        .forEach((track) => {
          track.paused = true;
          track.manual = true;
          seekTrack(track, Math.max(0, Math.min(1, progress)));
          sync(track);
        });
      onChange();
    },
    snapshot(ids?: string[]) {
      const chosen = scoped(ids),
        available = chosen.filter(
          (track) => !track.still && track.handles.length,
        );
      for (const track of available)
        if (track.handles.every((handle) => handle.state === "finished"))
          track.done = true;
      const first = available[0],
        time = first
          ? Math.max(
              0,
              ...first.handles.map((handle) =>
                handle.state === "finished"
                  ? (handle.endTime ?? handle.time)
                  : handle.time,
              ),
            )
          : 0;
      return {
        count: available.length,
        total: chosen.length,
        paused: available.every(
          (track) => track.paused || track.done || !track.started,
        ),
        progress: first
          ? Math.round(
              (first.done
                ? 1
                : first.config.trigger !== "scroll" &&
                    first.config.iterations !== 1 &&
                    time > first.length
                  ? ((time - first.config.delay) % first.config.duration) /
                    first.config.duration
                  : Math.min(1, time / first.length)) * 100,
            )
          : 100,
        still: chosen.length > 0 && chosen.every((track) => track.still),
        noTarget: chosen.filter(
          (track) => track.element.dataset.motionStatus === "no-target",
        ).length,
        failed: chosen.some(
          (track) => track.element.dataset.motionStatus === "unavailable",
        ),
      };
    },
    dispose() {
      disposed = true;
      generation++;
      view.cancelAnimationFrame(frame);
      reduced.removeEventListener("change", rebuild);
      mobile.removeEventListener("change", rebuild);
      destroyTracks();
    },
  };
}
export type MotionRuntime = ReturnType<typeof createMotionRuntime>;
