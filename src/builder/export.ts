import JSZip from "jszip";
import { componentSpec } from "./component-specs";
import {
  parseProject,
  resolvedLayout,
  type Project,
  type Viewport,
} from "./model";
import { themeCSS } from "./theme";
import { PREVIEW_CSS } from "./preview-css";
import { themeTokens } from "./tokens";

export function handoffSpec(project: Project) {
  const p = parseProject(project);
  const views: Viewport[] = ["mobile", "tablet", "desktop"];
  return {
    format: "prompt-studio-handoff",
    version: 1,
    rendererVersion: "2.1.0",
    source: p,
    breakpoints: { mobile: 0, tablet: 768, desktop: 1024 },
    referenceWidths: { mobile: 390, tablet: 768, desktop: 1440 },
    layoutRules: {
      widthMode: {
        auto: "컴포넌트 기본값",
        content: "fit-content, flex:0 0 auto",
        fixed: "width px, flex:0 0 auto, 부모 너비 이내",
        fill: "행 방향 부모에서는 flex:1 1 0%, 그 외에는 너비 채우기",
      },
      span: "부모가 Grid일 때만 적용하며 부모의 열 수를 넘지 않는다.",
      spacing:
        "resolvedLayouts의 gap, padding, margin에는 density가 이미 적용되어 있다.",
      minHeight: "0은 컴포넌트 기본값, 그 외에는 CSS px 최소 높이.",
    },
    components: [
      ...new Set(Object.values(p.nodes).map((n) => n.component)),
    ].map(componentSpec),
    resolvedLayouts: Object.fromEntries(
      views.map((view) => [
        view,
        Object.fromEntries(
          Object.values(p.nodes).map((node) => {
            const layout = resolvedLayout(node, view);
            return [
              node.id,
              {
                ...layout,
                gap: layout.gap * p.theme.density,
                padding: layout.padding * p.theme.density,
                margin: layout.margin * p.theme.density,
              },
            ];
          }),
        ),
      ]),
    ),
  };
}
export function generatePrompt(project: Project): string {
  return `# ${project.name} 프론트엔드 구현 요청\n\nReact와 TypeScript로 아래 설계를 구현하세요. 기존 저장소가 있으면 해당 프레임워크·버전·코딩 규칙을 먼저 확인하세요. 새 프로젝트의 스타일링은 Tailwind CSS를 사용할 수 있습니다.\n\n## 반드시 보존할 것\n\n- source.pages의 모든 페이지와 경로를 구현합니다.\n- 각 페이지의 rootId에서 nodes의 children을 순서대로 순회하세요. 중첩 관계를 평탄화하지 마세요.\n- theme의 실제 색상·서체·모서리 값을 적용합니다. layout의 gap·padding·margin은 theme.density를 곱한 resolvedLayouts 값을 사용합니다.\n- 768px부터 tablet, 1024px부터 desktop의 변경값을 순서대로 합성합니다. 확대 배율은 breakpoint에 영향을 주지 않습니다.\n- 숨김, 선택, 로딩, 비활성화, 빈 상태, 오류 상태와 키보드 조작을 반영합니다.\n- component-specs의 키보드·상태·동작 규칙을 적용합니다. 검색, 달력, 팝업, 폼 등 사용한 요소를 실제로 조작할 수 있게 구현합니다. 샘플 응답이나 전송 예시를 서버 기능으로 가장하지 않습니다.\n- 문구·메뉴·표 데이터는 props를 사용합니다. source에 없는 페이지나 섹션을 임의로 추가하지 마세요.\n\n## 구현 시 확인할 것\n\n일반 버튼의 링크가 비어 있거나 메뉴에 목적지가 없으면 연결 요구사항은 미정입니다. 결제·인증·서버 저장이 동작한다고 가장하지 마세요. 실제 데이터 연결은 별도 확인 사항으로 제시하세요. 장식용 히어로 그래픽의 숫자는 샘플 데이터입니다.\n\n라이브러리 내부 구현과 파일 구성은 자유롭게 선택하되 화면 설계를 유지하세요. 좁은 화면, 긴 한국어, 키보드 이동과 색 대비를 확인하고 390·768·1440px에서 캡처해 비교하세요.\n\n## 설계 데이터\n\n\`\`\`json\n${JSON.stringify(handoffSpec(project), null, 2)}\n\`\`\`\n`;
}
export function downloadFile(
  name: string,
  contents: string | Blob,
  type = "text/plain;charset=utf-8",
) {
  const url = URL.createObjectURL(
    typeof contents === "string" ? new Blob([contents], { type }) : contents,
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export async function exportBundle(
  project: Project,
  screenshots: Record<string, string> = {},
): Promise<Blob> {
  const spec = handoffSpec(project);
  const zip = new JSZip();
  zip.file("PROMPT.md", generatePrompt(project));
  zip.file("project.json", JSON.stringify(project, null, 2));
  zip.file("ui-spec.json", JSON.stringify(spec, null, 2));
  zip.file("theme.css", themeCSS(project.theme));
  zip.file("theme.json", JSON.stringify(project.theme, null, 2));
  zip.file(
    "theme.tokens.json",
    JSON.stringify(themeTokens(project.theme), null, 2),
  );
  zip.file("component-specs.json", JSON.stringify(spec.components, null, 2));
  zip.file("reference.css", PREVIEW_CSS);
  for (const [path, data] of Object.entries(screenshots))
    zip.file(`screenshots/${path}`, data.split(",")[1], { base64: true });
  zip.file(
    "START_HERE.md",
    `# UI 구현 자료\n\nPROMPT.md를 먼저 읽고 ui-spec.json의 구조와 값으로 구현하세요. project.json은 스튜디오에서 다시 열 수 있는 원본입니다.\n\n- theme.css: 현재 모드의 CSS 변수.\n- theme.json: 밝은 모드와 어두운 모드를 포함한 실제 테마 값.\n- theme.tokens.json: DTCG 2025.10 형식의 색상·서체·간격·모서리 토큰. primitive → modes → semantic → component 참조를 해석하세요. semantic은 현재 모드를 가리키며 모드 전환 시 modes의 해당 색상을 사용합니다.\n- component-specs.json: 사용한 컴포넌트의 속성, 상태, 키보드 조작과 동작. ui-spec.json에도 같은 정의가 포함됩니다.\n- reference.css: 미리보기에서 실제 사용한 컴포넌트 스타일. 글자 크기, 여백, 구역 구조를 참고하세요. ui-edit 관련 선택 스타일은 구현에 포함하지 마세요.\n\n레이아웃의 gap·padding·margin에는 ui-spec.json의 resolvedLayouts 값을 적용하세요. 이 값에는 theme.density가 이미 적용되어 있으므로 다시 곱하지 않습니다. 구조·값·동작 명세를 우선하고 이미지는 시각적으로 확인하는 데 사용하세요.\n\n이 패키지는 설계 자료이며 완성된 앱 코드는 아닙니다. screenshots 폴더에는 ${Object.keys(screenshots).length}개의 기준 이미지가 포함되어 있습니다. manifest.json에서 캡처 폭과 프로젝트 revision, 파일별 SHA-256을 확인하세요. 외부 이미지 URL은 별도로 다운로드 가능 여부와 사용 조건을 확인해야 합니다.\n`,
  );
  zip.file(
    "ACCEPTANCE.md",
    "# 구현 확인\n\n- 모든 페이지와 children 순서가 일치한다.\n- 390·768·1440px에서 가로 넘침과 잘림이 없다.\n- 커스텀 색상과 모드별 토큰이 일치한다.\n- 탭·표 정렬·스위치·아코디언을 키보드로 조작할 수 있다.\n- 미정 링크와 데이터 연결을 완료한 것처럼 표시하지 않는다.\n",
  );
  const files: Record<string, { sha256: string; bytes: number }> = {};
  for (const [name, file] of Object.entries(zip.files)) {
    if (file.dir) continue;
    const bytes = await file.async("uint8array");
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new Uint8Array(bytes).buffer,
    );
    files[name] = {
      sha256: [...new Uint8Array(digest)]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
      bytes: bytes.length,
    };
  }
  zip.file(
    "manifest.json",
    JSON.stringify(
      {
        formatVersion: 1,
        rendererVersion: "2.1.0",
        projectId: project.id,
        revision: project.revision,
        themeMode: project.theme.mode,
        screenshots: Object.keys(screenshots),
        referenceWidths: spec.referenceWidths,
        captureState: "authored-props-and-default-interactions",
        generatedAt: new Date().toISOString(),
        files,
      },
      null,
      2,
    ),
  );
  return zip.generateAsync({ type: "blob", compression: "DEFLATE" });
}
