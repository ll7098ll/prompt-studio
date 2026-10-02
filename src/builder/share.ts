import { parseProject, parseProjectText, type Project } from "./model";
const PREFIX = "#design=v2.";
export async function encodeShare(project: Project): Promise<string> {
  const json = JSON.stringify(parseProject(project));
  const stream = new Blob([json])
    .stream()
    .pipeThrough(new CompressionStream("gzip"));
  const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  const hash =
    PREFIX +
    btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  if (hash.length > 12_000)
    throw new Error(
      "링크로 공유하기에는 프로젝트가 큽니다. 프로젝트 JSON 파일을 전달해주세요.",
    );
  return hash;
}
export async function decodeShare(hash: string): Promise<Project> {
  if (!hash.startsWith(PREFIX) || hash.length > 12_000)
    throw new Error("지원하지 않는 공유 링크입니다.");
  const input = hash.slice(PREFIX.length);
  if (!/^[A-Za-z0-9_-]+$/.test(input))
    throw new Error("공유 링크가 올바르지 않습니다.");
  const binary = atob(input.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  const reader = new Blob([bytes])
    .stream()
    .pipeThrough(new DecompressionStream("gzip"))
    .getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > 3_000_000)
        throw new Error("공유 자료의 크기 제한을 초과했습니다.");
      chunks.push(value);
    }
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
  const output = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.length;
  }
  return parseProjectText(
    new TextDecoder("utf-8", { fatal: true }).decode(output),
  );
}
