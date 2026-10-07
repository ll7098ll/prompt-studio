import type { Definition } from "./catalog";
import type { Recipe } from "./more-catalog";
import { builtinSource as asset } from "./builtin-assets";

const text = (value: string, layout: Recipe["layout"] = {}): Recipe => ({
  component: "text",
  props: { text: value },
  layout,
});
const label = (value: string) =>
  text(value, { fontSize: 12, fontWeight: 600, letterSpacing: 1.4 });
const heading = (value: string, level = "h1"): Recipe => ({
  component: "heading",
  props: { text: value, level },
});
const stack = (children: Recipe[], layout: Recipe["layout"] = {}): Recipe => ({
  component: "stack",
  layout: { gap: 20, ...layout },
  children,
});
const grid = (children: Recipe[], columns = 2): Recipe => ({
  component: "grid",
  layout: { columns, gap: 28 },
  children,
});
const photo = (
  key: "afternoon" | "evening" | "speaker",
  ratio = "4/3",
): Recipe => ({
  component: "image",
  props: {
    src: asset(key),
    alt:
      key === "speaker"
        ? "짙은 남색 받침 위 오렌지색 스피커"
        : key === "afternoon"
          ? "오후 햇살과 나무 그림자가 드리운 방"
          : "푸른 의자와 따뜻한 조명이 있는 저녁의 방",
    ratio,
  },
  layout: { cornerRadius: 0 },
});
const button = (title: string, href: string): Recipe => ({
  component: "button",
  props: { label: title, href, variant: "primary" },
  layout: { widthMode: "content" },
});
const video = (title: string, ratio = "16/9"): Recipe => ({
  component: "video-player",
  props: {
    title,
    src: asset("orbit"),
    poster: asset("evening"),
    captions: asset("captions"),
    ratio,
    transcript:
      "다섯 색의 원호가 겹치며 천천히 움직입니다. 직접 제작한 6초 무음 모션 스터디입니다.",
    loop: true,
    muted: true,
    autoplay: false,
  },
});
const section = (children: Recipe[]): Recipe => ({
  component: "section",
  children,
  layout: { padding: 24, gap: 32, maxWidth: 1280, widthMode: "fill" },
  responsive: {
    tablet: { padding: 40, gap: 40 },
    desktop: { padding: 64, gap: 48 },
  },
});
function scene(
  id: string,
  name: string,
  description: string,
  children: Recipe[],
  fillColor = "",
): Definition {
  return {
    id: `scene-${id}`,
    name,
    category: "장면",
    source: "Prompt Studio",
    description,
    container: true,
    defaults: {},
    fields: [],
    initialLayout: { gap: 0, padding: 0, fillColor },
    recipe: [section(children)],
  };
}

export const SCENE_CATALOG: Definition[] = [
  scene(
    "video-hero",
    "시네마틱 영상 히어로",
    "큰 제목과 영상, 설명과 행동 버튼을 각각 편집",
    [
      label("MOTION STUDIES / 001"),
      heading("움직임이\n이야기가 되는 순간"),
      { ...video("Orbit — 여섯 초의 리듬", "21/9"), key: "film" },
      grid([
        text("빛과 색, 잠깐의 여백. 짧은 움직임으로 우리의 첫인상을 전합니다."),
        stack(
          [label("6 SECONDS · SILENT FILM"), button("장면 감상하기", "@film")],
          { align: "start" },
        ),
      ]),
    ],
  ),
  scene(
    "video-split",
    "영상과 이야기",
    "설명과 영상을 나란히 배치하고 모바일에서 세로 전환",
    [
      grid([
        stack(
          [
            label("OBJECT / MOTION"),
            heading("작은 변화가\n큰 감각으로"),
            text(
              "일상 속 익숙한 형태를 새로운 리듬으로 바라봅니다. 직접 재생하고 움직임의 디테일을 발견하세요.",
            ),
            button("모션 스터디 보기", "@film"),
          ],
          { justify: "center" },
        ),
        { ...video("형태의 리듬", "1/1"), key: "film" },
      ]),
    ],
  ),
  scene(
    "video-reviews",
    "세 가지 영상 노트",
    "영상·인용·이름을 독립적으로 바꾸는 3열 구성",
    [
      label("THREE PERSPECTIVES"),
      heading("같은 장면,\n세 개의 시선"),
      grid(
        [
          stack([
            video("01 · 형태"),
            heading("“좋은 형태에는\n쉼표가 있다.”", "h3"),
            text("디자인 노트 / 형태 스터디"),
          ]),
          stack([
            video("02 · 색채"),
            heading("“색이 먼저\n말을 건넨다.”", "h3"),
            text("디자인 노트 / 색채 스터디"),
          ]),
          stack([
            video("03 · 움직임"),
            heading("“느린 리듬에\n오래 머문다.”", "h3"),
            text("디자인 노트 / 모션 스터디"),
          ]),
        ],
        3,
      ),
      text(
        "동일한 샘플 영상과 창작 문구를 사용한 구성 예시입니다. 각 영상과 인용을 직접 교체하세요.",
        { fontSize: 12 },
      ),
    ],
  ),
  scene(
    "audio-episode",
    "오디오 에피소드",
    "표지·소개·재생기·대본을 따로 조절하는 청취 장면",
    [
      grid([
        photo("afternoon", "1/1"),
        stack(
          [
            label("SOUND JOURNAL / 01"),
            heading("천천히,\n귀 기울이는 시간"),
            text(
              "공간에 어울리는 네 개의 음. 12초 길이의 짧은 사운드 스케치입니다.",
            ),
            {
              component: "audio-player",
              props: {
                title: "Slow notes · 00:12",
                src: asset("notes"),
                transcript:
                  "사람의 목소리가 없는 전자음 스케치입니다. 네 개의 부드러운 음이 3초 간격으로 바뀌고 조용히 끝납니다.",
              },
            },
          ],
          { justify: "center" },
        ),
      ]),
    ],
  ),
  scene(
    "portfolio",
    "사진 포트폴리오",
    "비율이 다른 사진과 캡션을 각각 이동·교체하는 작품 모음",
    [
      label("SELECTED WORK / 2026"),
      heading("머무는 시선의 기록"),
      grid(
        [
          stack([
            photo("afternoon", "3/4"),
            label("01 / SPACE"),
            heading("빛이 머무는 오후", "h3"),
            text("벽의 질감과 그림자가 만드는 고요한 대화."),
          ]),
          stack([
            photo("speaker", "1/1"),
            label("02 / OBJECT"),
            heading("소리를 담은 색", "h3"),
            text("짙은 배경 위, 작고 선명한 존재감."),
            photo("evening", "16/9"),
          ]),
          stack([
            label("03 / ATMOSPHERE"),
            heading("하루의 다른 표정", "h3"),
            photo("evening", "3/4"),
            text("같은 공간에 내려앉은 저녁의 온도."),
          ]),
        ],
        3,
      ),
    ],
  ),
  scene(
    "photo-index",
    "사진 에세이와 목차",
    "실제 섹션과 연결된 고정 목차·사진·서식 본문",
    [
      label("A STUDY IN LIVING"),
      heading("공간을 읽는\n세 가지 방법"),
      {
        component: "scroll-chapters",
        props: { title: "이 에세이에서", offset: 16 },
        content: {
          chapters: [
            { label: "01 · 빛", target: "@light" },
            { label: "02 · 색", target: "@color" },
            { label: "03 · 온도", target: "@warmth" },
          ],
        },
      },
      {
        ...stack([
          photo("afternoon", "16/9"),
          heading("01 — 빛이 만드는 여백", "h2"),
          {
            component: "rich-text",
            content: {
              blocks: [
                {
                  kind: "paragraph",
                  text: "오후의 빛은 벽에 **새로운 표정**을 남깁니다. 가구보다 먼저 공간을 채우는 것은 창을 지나온 시간입니다.",
                },
              ],
            },
          },
        ]),
        key: "light",
      },
      {
        ...stack([
          photo("speaker", "16/9"),
          heading("02 — 한 가지 색의 힘", "h2"),
          text(
            "차분한 바탕에 선명한 색 하나. 필요한 만큼만 더해 존재감을 만듭니다.",
          ),
        ]),
        key: "color",
      },
      {
        ...stack([
          photo("evening", "16/9"),
          heading("03 — 저녁의 온도", "h2"),
          text(
            "조명이 켜지면 공간의 리듬도 달라집니다. 하루의 끝을 위한 작은 장면입니다.",
          ),
        ]),
        key: "warmth",
      },
    ],
  ),
  scene(
    "before-after",
    "공간 전후 비교",
    "같은 시점의 두 이미지와 라벨·분할 위치 조절",
    [
      label("ONE SPACE / TWO MOODS"),
      heading("같은 공간,\n다른 분위기"),
      {
        component: "image-compare",
        props: {
          title: "오후에서 저녁으로",
          before: asset("afternoon"),
          after: asset("evening"),
          beforeLabel: "오후 · 테라코타",
          afterLabel: "저녁 · 코발트",
          position: 50,
        },
      },
      grid([
        stack([
          heading("빛으로 시작하다", "h3"),
          text("자연광과 테라코타색 의자로 완성한 따뜻한 오후."),
        ]),
        stack([
          heading("색으로 바꾸다", "h3"),
          text("코발트색 의자와 낮은 조도로 바꾼 조용한 저녁."),
        ]),
      ]),
      text("동일한 구도의 AI 생성 공간 이미지입니다.", { fontSize: 12 }),
    ],
  ),
  scene(
    "hotspot-lookbook",
    "디테일 룩북",
    "사진 위 지점·정보 카드·제품 소개를 개별 편집",
    [
      label("OBJECT STUDY / ORANGE 01"),
      heading("가까이 보면,\n더 새롭게"),
      {
        component: "image-hotspot",
        props: {
          title: "세 개의 디테일을 눌러보세요",
          src: asset("speaker"),
          alt: "오렌지색 스피커의 그릴·다이얼·외곽 형태",
          ratio: "4/3",
        },
        content: {
          items: [
            {
              title: "촘촘한 그릴",
              body: "반복되는 작은 원이 앞면의 질감을 만듭니다.",
              x: 44,
              y: 48,
            },
            {
              title: "손끝의 다이얼",
              body: "옆면의 둥근 다이얼이 또렷한 대비를 만듭니다.",
              x: 78,
              y: 50,
            },
            {
              title: "부드러운 곡선",
              body: "둥근 모서리를 따라 빛이 자연스럽게 흐릅니다.",
              x: 55,
              y: 32,
            },
          ],
        },
      },
      grid([
        heading("소리의 형태를\n상상하다", "h2"),
        text(
          "가상의 스피커 콘셉트 이미지입니다. 제품 사진을 교체하고 지점을 옮겨 나만의 룩북을 구성하세요.",
        ),
      ]),
    ],
  ),
  scene(
    "manifesto",
    "타이포그래피 선언",
    "큰 제목·번호·구분선·문구를 독립된 요소로 구성",
    [
      label("OUR POINT OF VIEW — 01"),
      {
        ...heading("MAKE\nROOM\nFOR IDEAS."),
        layout: {
          fontSize: 52,
          fontWeight: 900,
          lineHeight: 1.02,
          letterSpacing: -2,
        },
        responsive: {
          tablet: { fontSize: 88 },
          desktop: { fontSize: 128, letterSpacing: -5 },
        },
        appearance: { motion: "words", motionSettings: { trigger: "view", duration: .7, stagger: .1, once: true, mobile: "still" } },
      },
      { component: "divider" },
      grid([
        label("생각이 자라는 공간"),
        text(
          "완벽한 시작보다 새로운 시도. 크고 작은 생각이 자유롭게 오가는 공간을 만듭니다.",
          { fontSize: 20 },
        ),
      ]),
    ],
  ),
  scene(
    "collage-hero",
    "사진 콜라주 히어로",
    "사진과 라벨의 겹침·회전·크기를 직접 조절",
    [
      label("COLLECTED MOMENTS"),
      heading("좋아하는 것을\n한 장면에"),
      {
        component: "frame",
        layout: { mode: "free", height: 660, clip: true },
        responsive: { tablet: { height: 540 }, desktop: { height: 600 } },
        children: [
          {
            ...photo("afternoon", "4/3"),
            layout: {
              x: 8,
              y: 10,
              width: 290,
              widthMode: "fixed",
              rotation: -3,
              anchorX: "scale",
              basisWidth: 342,
            },
            responsive: {
              tablet: { x: 20, y: 20, width: 440, basisWidth: 800 },
              desktop: { x: 30, y: 20, width: 650, basisWidth: 1120 },
            },
          },
          {
            ...photo("speaker", "1/1"),
            layout: {
              x: 85,
              y: 255,
              width: 220,
              widthMode: "fixed",
              rotation: 5,
              anchorX: "scale",
              basisWidth: 342,
            },
            responsive: {
              tablet: { x: 440, y: 125, width: 310, basisWidth: 800 },
              desktop: { x: 665, y: 145, width: 390, basisWidth: 1120 },
            },
          },
          {
            ...stack(
              [
                label("FIELD NOTES / 2026"),
                heading("일상의 조각을\n새롭게 잇다", "h3"),
              ],
              {
                padding: 20,
                fillColor: "theme:surface",
                strokeWidth: 1,
                strokeColor: "theme:border",
                gap: 12,
              },
            ),
            layout: {
              x: 20,
              y: 480,
              width: 260,
              widthMode: "fixed",
              anchorX: "scale",
              basisWidth: 342,
              padding: 20,
              fillColor: "theme:surface",
              strokeWidth: 1,
              strokeColor: "theme:border",
              rotation: -2,
            },
            responsive: {
              tablet: { x: 40, y: 370, width: 360, basisWidth: 800 },
              desktop: { x: 90, y: 435, width: 450, basisWidth: 1120 },
            },
          },
        ],
      },
      text(
        "각 사진과 종이 카드를 선택해 위치·회전·크기를 바꿔보세요. 모바일 배치도 따로 조절할 수 있습니다.",
      ),
    ],
  ),
  scene(
    "retro-launch",
    "레트로 런치 노트",
    "모노 타이포·릴리스 목록·상태 라벨을 각각 수정",
    [
      label("> STUDIO / RELEASE_001"),
      heading("HELLO,\nNEW IDEAS."),
      stack(
        [
          label("SYSTEM STATUS: READY"),
          { component: "divider" },
          text("$ 새로운 생각을 불러오는 중…", { fontSize: 22 }),
          text(
            "[01] 관찰하고 기록하기\n[02] 형태와 색을 조합하기\n[03] 첫 번째 버전 공개하기",
            { fontSize: 18, lineHeight: 2 },
          ),
          label("CREATIVE LOG · 2026.10"),
        ],
        {
          padding: 28,
          fillColor: "theme:soft",
          strokeColor: "theme:border",
          strokeWidth: 1,
        },
      ),
      text(
        "오늘의 시도가 내일의 새로운 기준이 됩니다. 이 공간에 다음 릴리스를 기록하세요.",
      ),
    ],
  ),
  scene(
    "modular-board",
    "컬러 모듈 보드",
    "사진·숫자·문구 카드의 배치와 색을 각각 변경",
    [
      label("SMALL MODULES / BIG POSSIBILITIES"),
      heading("서로 다른 조각,\n하나의 가능성"),
      grid([
        stack(
          [
            {
              ...label("01 / A NEW PERSPECTIVE"),
              layout: {
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 1.4,
                textColor: "theme:onPrimary",
              },
            },
            {
              ...heading("시선을\n바꾸다", "h2"),
              layout: { textColor: "theme:onPrimary" },
            },
            photo("speaker", "4/3"),
          ],
          {
            padding: 24,
            fillColor: "theme:primary",
            textColor: "theme:onPrimary",
            gap: 24,
          },
        ),
        stack([
          photo("afternoon", "16/9"),
          grid([
            stack(
              [
                label("02 / DAILY PRACTICE"),
                heading("매일\n한 가지", "h3"),
                text("작은 시도를 쌓는 일"),
              ],
              { padding: 20, fillColor: "theme:soft" },
            ),
            stack(
              [
                label("03 / CONNECTION"),
                heading("함께\n더 멀리", "h3"),
                text("서로의 생각을 연결하는 일"),
              ],
              {
                padding: 20,
                fillColor: "theme:surface",
                strokeWidth: 1,
                strokeColor: "theme:border",
              },
            ),
          ]),
        ]),
      ]),
    ],
  ),
];
