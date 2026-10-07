import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

// Own, deterministic test content: three colored frames, no external assets.
async function main() {
const browser = await chromium.launch({ channel: "msedge" });
try {
  const page = await browser.newPage();
  const bytes = await page.evaluate(async () => {
    const canvas = document.createElement("canvas"); canvas.width = 160; canvas.height = 90;
    const ctx = canvas.getContext("2d")!, stream = canvas.captureStream(10);
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp8" });
    const chunks: Blob[] = [];
    const result = new Promise<Blob>((resolve, reject) => { recorder.ondataavailable = e => chunks.push(e.data); recorder.onstop = () => resolve(new Blob(chunks, { type: "video/webm" })); recorder.onerror = reject; });
    recorder.start();
    for (let frame = 0; frame < 20; frame++) {
      ctx.fillStyle = ["#5541be", "#d52a56", "#168174"][frame % 3]; ctx.fillRect(0, 0, 160, 90);
      ctx.fillStyle = "white"; ctx.fillRect(frame * 6, 36, 20, 18);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    recorder.stop(); const blob = await result; stream.getTracks().forEach(track => track.stop());
    return Array.from(new Uint8Array(await blob.arrayBuffer()));
  });
  await mkdir("tests/fixtures", { recursive: true });
  await writeFile("tests/fixtures/studio-motion.webm", new Uint8Array(bytes));
  console.log(`Wrote ${bytes.length} bytes of synthetic video.`);
} finally { await browser.close(); }
}
void main();
