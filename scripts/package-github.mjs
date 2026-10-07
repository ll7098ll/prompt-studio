// Produce a source-only GitHub copy. Existing output is never overwritten.
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  access,
  lstat,
  mkdir,
  readdir,
  readFile,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import JSZip from "jszip";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const options = {};
for (let index = 0; index < args.length;) {
  if (args[index] === "--check" && !options["--check"]) {
    options["--check"] = true;
    index++;
    continue;
  }
  if (
    !["--name", "--ref"].includes(args[index]) ||
    !args[index + 1] ||
    options[args[index]]
  ) {
    throw Error(
      "Usage: npm run package:github -- [--name prompt-studio-v2] [--ref <commit>]",
    );
  }
  options[args[index]] = args[index + 1];
  index += 2;
}
const name = options["--name"] ?? "prompt-studio";
const sourceRef = options["--ref"]
  ? execFileSync(
      "git",
      ["rev-parse", "--verify", `${options["--ref"]}^{commit}`],
      { cwd: root, encoding: "utf8", windowsHide: true },
    ).trim()
  : null;
if (!/^prompt-studio(?:-[a-z0-9]+)*$/.test(name)) {
  throw Error(
    "Name must be prompt-studio or prompt-studio-<lowercase suffix>.",
  );
}
const outputRoot = path.join(root, "github-upload");
const destination = path.join(outputRoot, name);
const archivePath = path.join(outputRoot, `${name}-github.zip`);
const manifestPath = path.join(outputRoot, `${name}.manifest.json`);
const guidePath = path.join(outputRoot, `${name}-UPLOAD.md`);

const rootFiles = [
  "README.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "CHANGELOG.md",
  "THIRD_PARTY_NOTICES.md",
  "AGENTS.md",
  "CLAUDE.md",
  ".gitignore",
  ".gitattributes",
  ".editorconfig",
  "package.json",
  "package-lock.json",
  "next.config.ts",
  "tsconfig.json",
  "eslint.config.mjs",
  "postcss.config.mjs",
  "playwright.config.ts",
  "playwright.performance.config.ts",
  "layout_architecture_plan.md",
];
const directories = ["src", "public", "scripts", "tests", "docs", ".github"];
const optionalFiles = ["LICENSE", "LICENSE.md", "LICENSE.txt"];
const excluded = [
  ".git",
  "node_modules",
  ".next",
  "out",
  "artifacts",
  "test-results",
  "playwright-report",
  ".openai",
  ".codex",
  ".agents",
  ".aws",
  "github-upload",
  ".vscode",
  ".idea",
  ".env*",
  "*.tsbuildinfo",
  "*.log",
  "private-key files",
  "next-env.d.ts",
  "public/studio-ui.css",
  "scripts/publish-source.mjs",
];
const forbiddenDirectories = new Set(
  excluded.filter((item) => !item.includes("/")),
);
function allowed(relative) {
  const segments = relative.split("/");
  const basename = segments.at(-1);
  return (
    !segments.some((segment) => forbiddenDirectories.has(segment)) &&
    !basename.startsWith(".env") &&
    !/\.(?:tsbuildinfo|log|pem|key|p12|pfx|zip|tar|gz)$/i.test(basename) &&
    ![".DS_Store", "Thumbs.db"].includes(basename) &&
    !["public/studio-ui.css", "scripts/publish-source.mjs"].includes(relative)
  );
}
async function exists(file) {
  try {
    await access(file);
    return true;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return false;
  }
}
async function walk(relative) {
  const absolute = path.join(root, relative);
  const info = await lstat(absolute);
  if (info.isSymbolicLink())
    throw Error(`Symlinks are not packaged: ${relative}`);
  if (info.isDirectory()) {
    const found = [];
    for (const entry of (await readdir(absolute)).sort()) {
      const child = `${relative}/${entry}`;
      if (allowed(child)) found.push(...(await walk(child)));
    }
    return found;
  }
  if (!info.isFile()) throw Error(`Unsupported file type: ${relative}`);
  return [relative];
}
function digest(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}
const textTypes = /\.(?:md|json|mjs|js|ts|tsx|css|yml|yaml|svg|txt|vtt)$/i;
const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9]{30,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{40,}\b/,
  /\bAKIA[A-Z0-9]{16}\b/,
  /\bsk-(?:proj-)?[A-Za-z0-9_-]{32,}\b/,
];

for (const output of [destination, archivePath, manifestPath, guidePath]) {
  if (!options["--check"] && (await exists(output))) {
    throw Error(
      `Output exists: ${path.basename(output)}. Use --name prompt-studio-v2; existing files are preserved.`,
    );
  }
}
if (await exists(outputRoot)) {
  if ((await lstat(outputRoot)).isSymbolicLink())
    throw Error("Output root cannot be a symlink.");
}

const paths = [...rootFiles];
for (const file of optionalFiles)
  if (await exists(path.join(root, file))) paths.push(file);
const snapshotPaths = new Set();
for (const directory of directories) {
  if (sourceRef && ["src", "public", "tests", "scripts"].includes(directory)) {
    const entries = execFileSync(
      "git",
      ["ls-tree", "-r", "-z", sourceRef, "--", directory],
      { cwd: root, windowsHide: true },
    )
      .toString("utf8")
      .split("\0")
      .filter(Boolean);
    for (const entry of entries) {
      const [metadata, relative] = entry.split("\t");
      if (!allowed(relative)) continue;
      if (!metadata.startsWith("100644 ") && !metadata.startsWith("100755 "))
        throw Error(`Unsupported Git entry: ${relative}`);
      paths.push(relative);
      snapshotPaths.add(relative);
    }
  } else paths.push(...(await walk(directory)));
}
for (const file of [
  "scripts/package-github.mjs",
  "scripts/docs-screenshots.ts",
]) {
  if (!paths.includes(file)) paths.push(file);
  snapshotPaths.delete(file);
}
paths.sort();

// Read the selected commit once instead of launching Git for every file.
const snapshotArchive = sourceRef
  ? await JSZip.loadAsync(
      execFileSync("git", ["archive", "--format=zip", sourceRef], {
        cwd: root,
        windowsHide: true,
        maxBuffer: 110 * 1024 * 1024,
      }),
      { checkCRC32: true },
    )
  : null;

const files = new Map();
const manifest = {};
for (const relative of paths) {
  let bytes;
  if (snapshotPaths.has(relative)) {
    bytes = await snapshotArchive.file(relative).async("nodebuffer");
  } else {
    const info = await lstat(path.join(root, relative));
    if (!info.isFile() || info.isSymbolicLink())
      throw Error(`Not a regular file: ${relative}`);
    bytes = await readFile(path.join(root, relative));
  }
  if (sourceRef && relative === "package.json") {
    const snapshot = JSON.parse(
      await snapshotArchive.file("package.json").async("string"),
    );
    const current = JSON.parse(bytes.toString("utf8"));
    snapshot.scripts["docs:screenshots"] = current.scripts["docs:screenshots"];
    snapshot.scripts["package:github"] = current.scripts["package:github"];
    bytes = Buffer.from(`${JSON.stringify(snapshot, null, 2)}\n`);
  }
  if (sourceRef && relative === "package-lock.json") {
    bytes = await snapshotArchive.file("package-lock.json").async("nodebuffer");
  }
  // Built-in VTT metadata hashes the authored LF bytes; Windows Git history
  // may contain CRLF, so preserve the canonical asset bytes in every package.
  if (relative.endsWith(".vtt"))
    bytes = Buffer.from(bytes.toString("utf8").replace(/\r\n/g, "\n"));
  if (bytes.length > 100 * 1024 * 1024)
    throw Error(`File exceeds GitHub's Git limit: ${relative}`);
  if (
    textTypes.test(relative) &&
    secretPatterns.some((pattern) => pattern.test(bytes.toString("utf8")))
  ) {
    throw Error(
      `Possible credential detected in ${relative}. No credential content was printed.`,
    );
  }
  files.set(relative, bytes);
  manifest[relative] = { bytes: bytes.length, sha256: digest(bytes) };
}

// Check relative Markdown file links in the exact copy, including hidden files.
const missingLinks = [];
for (const [relative, bytes] of files) {
  if (!relative.endsWith(".md")) continue;
  for (const match of bytes
    .toString("utf8")
    .matchAll(/!?\[[^\]\n]*\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)) {
    const target = match[1].replace(/^<|>$/g, "");
    if (/^(?:[a-z][a-z0-9+.-]*:|#|\/)/i.test(target)) continue;
    const pathname = decodeURIComponent(target.split("#")[0]);
    if (!pathname) continue;
    const resolved = path.posix.normalize(
      path.posix.join(path.posix.dirname(relative), pathname),
    );
    if (
      !files.has(resolved) &&
      ![...files.keys()].some((file) => file.startsWith(`${resolved}/`))
    ) {
      missingLinks.push(`${relative} -> ${target}`);
    }
  }
}
if (missingLinks.length)
  throw Error(`Broken local Markdown links:\n${missingLinks.join("\n")}`);

const zip = new JSZip();
for (const [relative, bytes] of files) zip.file(`${name}/${relative}`, bytes);
const archive = await zip.generateAsync({
  type: "nodebuffer",
  compression: "DEFLATE",
  compressionOptions: { level: 6 },
});
const restored = await JSZip.loadAsync(archive, { checkCRC32: true });
const restoredPaths = Object.values(restored.files).filter(
  (entry) => !entry.dir,
);
if (restoredPaths.length !== files.size)
  throw Error("ZIP file count mismatch.");
for (const [relative, bytes] of files) {
  const restoredBytes = await restored
    .file(`${name}/${relative}`)
    .async("nodebuffer");
  if (digest(restoredBytes) !== digest(bytes))
    throw Error(`ZIP hash mismatch: ${relative}`);
}

if (options["--check"]) {
  console.log(
    JSON.stringify(
      {
        check: "passed",
        files: files.size,
        zipBytes: archive.length,
        sourceCommit: sourceRef,
        validation:
          "local Markdown links, known credential patterns, ZIP CRC32 and all file SHA-256 hashes",
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

await mkdir(destination, { recursive: true });
for (const [relative, bytes] of files) {
  const output = path.join(destination, relative);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, bytes, { flag: "wx" });
}
await writeFile(archivePath, archive, { flag: "wx" });
const totalBytes = [...files.values()].reduce(
  (sum, bytes) => sum + bytes.length,
  0,
);
const report = {
  format: "prompt-studio-github-package",
  version: 1,
  generatedAt: new Date().toISOString(),
  applicationSourceCommit: sourceRef,
  sourceMode: sourceRef
    ? "committed application plus current documentation and packaging settings"
    : "working tree",
  sourceFiles: files.size,
  sourceBytes: totalBytes,
  archiveBytes: archive.length,
  archiveSha256: digest(archive),
  validation: {
    localMarkdownLinks: "passed",
    knownCredentialPatterns: "passed",
    zipCRC32AndSHA256: "passed",
  },
  excluded,
  files: manifest,
};
await writeFile(manifestPath, `${JSON.stringify(report, null, 2)}\n`, {
  flag: "wx",
});
const guide = `# GitHub 업로드 준비 완료\n\n업로드할 폴더: **${name}/**\n\n- 파일 ${files.size}개, 원본 ${(totalBytes / 1024 / 1024).toFixed(2)} MiB.\n- 같은 내용의 압축본: ${name}-github.zip (${(archive.length / 1024 / 1024).toFixed(2)} MiB).\n- 파일별 해시·제외 항목: ${name}.manifest.json.\n- 전체 절차: [GitHub 업로드 안내](${name}/docs/GITHUB_UPLOAD.md).\n\n폴더 안의 README.md, package.json, src/, .github/가 저장소 루트에 오도록 올리세요. ZIP 파일 자체를 저장소의 소스 대신 올리면 GitHub에서 README와 코드를 탐색할 수 없습니다. ZIP은 이동·보관용이며 압축을 풀어 내용물을 올립니다.\n\n## PowerShell에서 업로드\n\n아래 명령은 ${name}/ 폴더 안에서 실행합니다. 먼저 GitHub에서 README·라이선스·gitignore 자동 생성 없이 빈 저장소를 만듭니다. 사용자 Git 이름/이메일 설정과 로그인이 필요합니다.\n\n\`\`\`powershell\ngit init -b main\ngit add .\ngit commit -m 'Prepare Prompt Studio source and documentation'\n$repositoryUrl = Read-Host '새 GitHub 저장소의 HTTPS URL'\ngit remote add origin $repositoryUrl\ngit push -u origin main\n\`\`\`\n\n이 패키지에는 기존 .git·호스팅 연결·환경 파일·의존성·빌드·테스트 결과가 없습니다. GitHub CI는 기본 검사만 실행하며 웹사이트 자동 배포는 설정하지 않습니다. 실제 원격 업로드는 아직 실행하지 않았습니다.\n`;
await writeFile(guidePath, guide, { flag: "wx" });
console.log(
  JSON.stringify(
    {
      folder: destination,
      zip: archivePath,
      manifest: manifestPath,
      guide: guidePath,
      files: files.size,
      sourceBytes: totalBytes,
      zipBytes: archive.length,
      validation: report.validation,
    },
    null,
    2,
  ),
);
