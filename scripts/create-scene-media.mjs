// Reproducible, original abstract motion/sound samples; no external media.
import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  const page = await browser.newPage();
  const video = await page.evaluate(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 960;
    canvas.height = 540;
    const ctx = canvas.getContext("2d");
    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=vp9",
      videoBitsPerSecond: 1200000,
    });
    const chunks = [];
    const done = new Promise((resolve) => {
      recorder.ondataavailable = (event) => chunks.push(event.data);
      recorder.onstop = async () =>
        resolve(
          Array.from(new Uint8Array(await new Blob(chunks).arrayBuffer())),
        );
    });
    recorder.start();
    const start = performance.now();
    await new Promise((resolve) => {
      function draw(now) {
        const time = (now - start) / 1000;
        ctx.fillStyle = "#111828";
        ctx.fillRect(0, 0, 960, 540);
        for (let i = 0; i < 5; i++) {
          ctx.strokeStyle = [
            "#fd6438",
            "#cded87",
            "#adb8ff",
            "#f9efd8",
            "#5389ce",
          ][i];
          ctx.lineWidth = 28;
          ctx.beginPath();
          ctx.arc(
            480 + Math.sin(time * 0.55 + i) * 110,
            270 + Math.cos(time * 0.65 + i) * 55,
            38 + i * 40,
            time * 0.3 + i,
            time * 0.3 + i + Math.PI * 1.3,
          );
          ctx.stroke();
        }
        if (time < 6) requestAnimationFrame(draw);
        else resolve();
      }
      requestAnimationFrame(draw);
    });
    recorder.stop();
    stream.getTracks().forEach((track) => track.stop());
    return done;
  });
  await writeFile("public/studio-assets/orbit-study.webm", Buffer.from(video));
} finally {
  await browser.close();
}
const rate = 24000,
  duration = 12,
  count = rate * duration;
const wav = Buffer.alloc(44 + count * 2);
wav.write("RIFF", 0);
wav.writeUInt32LE(wav.length - 8, 4);
wav.write("WAVEfmt ", 8);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(rate, 24);
wav.writeUInt32LE(rate * 2, 28);
wav.writeUInt16LE(2, 32);
wav.writeUInt16LE(16, 34);
wav.write("data", 36);
wav.writeUInt32LE(count * 2, 40);
for (let i = 0; i < count; i++) {
  const time = i / rate,
    note = [220, 261.63, 329.63, 293.66][Math.floor(time / 3) % 4];
  const envelope =
    Math.min(1, time / 0.2, (duration - time) / 0.8) *
    (0.55 + 0.45 * Math.sin((Math.PI * (time % 3)) / 3));
  const sample =
    (Math.sin(2 * Math.PI * note * time) +
      0.3 * Math.sin(4 * Math.PI * note * time)) *
    0.14 *
    envelope;
  wav.writeInt16LE(Math.round(sample * 32767), 44 + i * 2);
}
await writeFile("public/studio-assets/slow-notes.wav", wav);
await writeFile(
  "public/studio-assets/orbit-study.vtt",
  "WEBVTT\n\n00:00.000 --> 00:06.000\n다섯 색의 원호가 천천히 겹치며 움직입니다. 소리 없는 모션 스터디입니다.\n",
);
