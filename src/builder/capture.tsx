"use client";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { toPng } from "html-to-image";
import { Renderer } from "./Renderer";
import { PREVIEW_CSS } from "./preview-css";
import { previewWidth, viewportForWidth } from "./viewport";
import type { Project, Viewport } from "./model";

export async function capturePage(
  project: Project,
  pageId: string,
  viewport: Viewport | number,
): Promise<string> {
  const width = previewWidth(viewport);
  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.tabIndex = -1;
  Object.assign(frame.style, {
    position: "fixed",
    left: "-20000px",
    top: "0",
    width: `${width}px`,
    height: "900px",
    border: "0",
    pointerEvents: "none",
  });
  const loaded = new Promise<void>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("이미지 렌더러를 열지 못했습니다.")),
      5000,
    );
    frame.onload = () => {
      clearTimeout(timer);
      resolve();
    };
  });
  frame.srcdoc = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>${PREVIEW_CSS}\n*,*::before,*::after{animation:none!important;transition:none!important}</style></head><body><div id="capture-root"></div></body></html>`;
  document.body.appendChild(frame);
  let root: ReturnType<typeof createRoot> | undefined;
  const abort = new AbortController();
  const totalTimer = setTimeout(() => abort.abort(), 30000);
  try {
    await loaded;
    const doc = frame.contentDocument!;
    const mount = doc.getElementById("capture-root")!;
    root = createRoot(mount);
    flushSync(() =>
      root!.render(
        <Renderer
          project={project}
          pageId={pageId}
          viewport={viewportForWidth(width)}
          selected={null}
          preview
        />,
      ),
    );
    await doc.fonts.ready;
    await Promise.all(
      [...doc.images].map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((resolve, reject) => {
              const timer = setTimeout(
                () =>
                  reject(
                    new Error(
                      "이미지를 불러오지 못했습니다. 이미지 URL을 확인하세요.",
                    ),
                  ),
                8000,
              );
              img.onload = () => {
                clearTimeout(timer);
                resolve();
              };
              img.onerror = () => {
                clearTimeout(timer);
                reject(
                  new Error(
                    "이미지를 불러오지 못했습니다. 이미지 URL을 확인하세요.",
                  ),
                );
              };
            }),
      ),
    );
    // Resolve cross-origin images before html-to-image, which otherwise silently
    // substitutes an empty image on a failed fetch. Preserve query strings.
    for (const img of [...doc.images]) {
      if (!img.naturalWidth)
        throw new Error(
          "이미지를 읽을 수 없습니다. 주소를 확인하거나 이미지 요소를 제거하세요.",
        );
      const response = await fetch(img.src, {
        signal: abort.signal,
        credentials: "omit",
        referrerPolicy: "no-referrer",
      });
      if (!response.ok)
        throw new Error(
          "이미지를 내려받지 못했습니다. 이미지 서버의 접근 권한을 확인하세요.",
        );
      const blob = await response.blob();
      if (blob.size > 10_000_000)
        throw new Error("10MB보다 큰 이미지는 캡처할 수 없습니다.");
      img.src = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () =>
          reject(new Error("이미지를 변환하지 못했습니다."));
        reader.readAsDataURL(blob);
      });
      await img.decode();
    }
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => resolve()),
    );
    const height = Math.ceil(mount.scrollHeight);
    if (height > 16000)
      throw new Error("이미지가 너무 깁니다. 페이지를 나눠서 내보내세요.");
    return await Promise.race([
      toPng(mount, {
        width,
        height,
        pixelRatio: 1,
        skipFonts: true,
        includeQueryParams: true,
        fetchRequestInit: { signal: abort.signal, credentials: "omit" },
        backgroundColor: project.theme[project.theme.mode].background,
      }),
      new Promise<never>((_, reject) => {
        if (abort.signal.aborted)
          reject(
            new Error(
              "이미지 생성 시간이 초과되었습니다. 페이지를 나눠서 다시 시도하세요.",
            ),
          );
        else
          abort.signal.addEventListener(
            "abort",
            () =>
              reject(
                new Error(
                  "이미지 생성 시간이 초과되었습니다. 페이지를 나눠서 다시 시도하세요.",
                ),
              ),
            { once: true },
          );
      }),
    ]);
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error(
          "이미지를 만들지 못했습니다. 외부 이미지의 접근 권한을 확인하세요.",
        );
  } finally {
    clearTimeout(totalTimer);
    abort.abort();
    root?.unmount();
    frame.remove();
  }
}
