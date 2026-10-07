import { webkit } from "playwright";
import { readFile } from "node:fs/promises";
import { wavFixture } from "../tests/asset-fixtures";
async function main() {
  const browser = await webkit.launch();
  try {
    const page = await browser.newPage();
    await page.goto("http://127.0.0.1:3200/");
    for (const [mime, bytes] of [
      ["audio/wav", wavFixture()],
      ["video/webm", await readFile("tests/fixtures/studio-motion.webm")],
    ] as const) {
      console.log(
        mime,
        await page.evaluate(
          async ({ mime, bytes }) => {
            const el = document.createElement(
              mime.startsWith("audio") ? "audio" : "video",
            );
            el.controls = true;
            document.body.append(el);
            const url = URL.createObjectURL(
              new Blob([new Uint8Array(bytes)], { type: mime }),
            );
            el.src = url;
            let play = "pending";
            void el
              .play()
              .then(() => {
                play = "resolved";
              })
              .catch((error) => {
                play = String(error);
              });
            await new Promise((resolve) => setTimeout(resolve, 3000));
            const result = {
              support: el.canPlayType(mime),
              ready: el.readyState,
              time: el.currentTime,
              duration: el.duration,
              play,
              error: el.error?.message,
              code: el.error?.code,
            };
            el.pause();
            el.removeAttribute("src");
            el.load();
            el.remove();
            URL.revokeObjectURL(url);
            return result;
          },
          { mime, bytes: [...bytes] },
        ),
      );
    }
  } finally {
    await browser.close();
  }
}
void main();
