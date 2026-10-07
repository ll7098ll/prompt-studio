import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
const specs = [
  [
    "afternoon",
    "room-afternoon.png",
    "image",
    "image/png",
    "빛이 머무는 오후",
    { width: 1672, height: 941 },
  ],
  [
    "evening",
    "room-evening.png",
    "image",
    "image/png",
    "푸른 의자의 저녁",
    { width: 1672, height: 941 },
  ],
  [
    "speaker",
    "orange-speaker.png",
    "image",
    "image/png",
    "오렌지 스피커 스터디",
    { width: 1448, height: 1086 },
  ],
  [
    "orbit",
    "orbit-study.webm",
    "video",
    "video/webm",
    "Orbit · 6초 모션 스터디",
    { width: 960, height: 540, duration: 6 },
  ],
  [
    "notes",
    "slow-notes.wav",
    "audio",
    "audio/wav",
    "Slow notes · 12초 사운드 스케치",
    { duration: 12 },
  ],
  [
    "captions",
    "orbit-study.vtt",
    "captions",
    "text/vtt",
    "Orbit · 한국어 설명 자막",
    {},
  ],
];
const manifest = {};
for (const [key, filename, kind, mime, name, dimensions] of specs) {
  const bytes = await readFile(`public/studio-assets/${filename}`);
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  manifest[key] = {
    path: `/studio-assets/${filename}`,
    asset: {
      id: `asset-${sha256}`,
      name,
      kind,
      mime,
      bytes: bytes.length,
      sha256,
      source: "local",
      createdAt: "2026-10-07T02:00:00.000Z",
      description:
        kind === "image"
          ? "장면 편집을 위해 AI로 제작한 가상 공간·제품 이미지입니다."
          : "Prompt Studio에서 직접 제작한 샘플입니다.",
      credit:
        kind === "image"
          ? "OpenAI ImageGen · 생성 이미지"
          : "Prompt Studio · original sample",
      ...dimensions,
    },
  };
}
await writeFile(
  "src/builder/builtin-assets.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
