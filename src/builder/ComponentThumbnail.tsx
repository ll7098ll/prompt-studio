import { memo, type ReactNode } from "react";

const ink = "#3f3b55",
  accent = "#7563d7",
  soft = "#eeebfc",
  line = "#dedbea";
const box = (
  x: number,
  y: number,
  w: number,
  h: number,
  fill = "white",
  radius = 5,
) => (
  <rect
    x={x}
    y={y}
    width={w}
    height={h}
    rx={radius}
    fill={fill}
    stroke={fill === "white" ? line : "none"}
  />
);
const label = (
  text: string,
  x: number,
  y: number,
  size = 9,
  fill = ink,
  weight = 500,
) => (
  <text x={x} y={y} fontSize={size} fill={fill} fontWeight={weight}>
    {text}
  </text>
);
const rule = (x: number, y: number, w: number) => (
  <path
    d={`M${x} ${y}h${w}`}
    stroke={line}
    strokeWidth="3"
    strokeLinecap="round"
  />
);
const action = (text = "시작하기", x = 40, y = 37, w = 80) => (
  <>
    {box(x, y, w, 27, accent)}
    {label(text, x + 11, y + 17, 10, "white", 600)}
  </>
);
const picture = (x = 23, y = 18, w = 114, h = 64) => (
  <>
    {box(x, y, w, h, "#e6eef5")}
    <circle cx={x + w * 0.75} cy={y + h * 0.28} r="7" fill="#f5ce89" />
    <path
      d={`M${x + 4} ${y + h - 4}L${x + w * 0.35} ${y + h * 0.35}L${x + w * 0.57} ${y + h * 0.65}L${x + w * 0.72} ${y + h * 0.48}L${x + w - 4} ${y + h - 4}Z`}
      fill="#9eb6b1"
    />
  </>
);

function sample(id: string): ReactNode {
  switch (id) {
    case "section":
      return (
        <>
          {box(17, 10, 126, 80)}
          {box(25, 17, 110, 12, soft)}
          <rect
            x="25"
            y="37"
            width="110"
            height="43"
            rx="3"
            fill="#f8f7fd"
            stroke={accent}
            strokeDasharray="3 3"
          />
          {label("콘텐츠 구역", 49, 63, 11)}
        </>
      );
    case "stack":
      return (
        <>
          {box(23, 14, 114, 72)}
          {[24, 44, 64].map((y, i) => (
            <g key={y}>
              {box(34, y, 91, 13, i === 1 ? accent : soft)}
              {label(
                ["제목", "설명", "버튼"][i],
                70,
                y + 9,
                7,
                i === 1 ? "white" : ink,
              )}
            </g>
          ))}
        </>
      );
    case "grid":
      return (
        <>
          {[0, 1, 2].map((col) =>
            [0, 1].map((row) => (
              <g key={`${col}-${row}`}>
                {box(
                  19 + col * 42,
                  20 + row * 33,
                  36,
                  27,
                  row === 0 && col === 0 ? accent : soft,
                )}
              </g>
            )),
          )}
        </>
      );
    case "heading":
      return (
        <>
          {label("큰 제목", 21, 51, 24, ink, 750)}
          {label("화면의 중요한 메시지", 22, 72, 9, "#747083")}
        </>
      );
    case "text":
      return (
        <>
          {label("당신의 아이디어를", 21, 33, 11)}
          {label("이곳에 담아보세요.", 21, 51, 11)}
          {label("소개와 설명이 들어갑니다.", 21, 69, 9, "#747083")}
        </>
      );
    case "button":
      return action();
    case "badge":
      return (
        <>
          {box(16, 36, 42, 24, soft, 12)}
          {label("NEW", 25, 51, 9, accent, 700)}
          {box(65, 36, 34, 24, "#e1f0e6", 12)}
          {label("완료", 72, 51, 9, "#3f6c51")}
          {box(106, 36, 38, 24, "#fff0d7", 12)}
          {label("검토", 116, 51, 9, "#8a5a26")}
        </>
      );
    case "input":
      return (
        <>
          {label("이메일", 18, 31, 10)}
          {box(17, 40, 126, 30)}
          {label("you@example.com", 25, 59, 10, "#817b91")}
        </>
      );
    case "checkbox":
      return (
        <>
          {box(23, 26, 15, 15, accent, 3)}
          <path d="m27 33 3 3 5-6" fill="none" stroke="white" strokeWidth="2" />
          {label("소식 받기", 47, 37, 11)}
          {box(23, 57, 15, 15, "white", 3)}
          {label("약관 동의", 47, 68, 11)}
        </>
      );
    case "switch":
      return (
        <>
          {label("알림 받기", 18, 37, 11)}
          {box(105, 23, 35, 20, accent, 10)}
          <circle cx="130" cy="33" r="7" fill="white" />
          {label("자동 재생", 18, 72, 11)}
          {box(105, 58, 35, 20, line, 10)}
          <circle cx="115" cy="68" r="7" fill="white" />
        </>
      );
    case "select":
      return (
        <>
          {label("작업 유형", 21, 23, 9)}
          {box(19, 29, 122, 24)}
          {label("디자인", 28, 45, 10)}
          <path d="m125 38 4 4 4-4" fill="none" stroke={accent} />
          {box(19, 58, 122, 28)}
          {label("개발", 28, 76, 10, "#7b7489")}
        </>
      );
    case "divider":
      return (
        <>
          {label("소개", 22, 31, 11)}
          <path d="M20 49h120" stroke={accent} strokeWidth="1.5" />
          {label("다음 내용", 22, 75, 11)}
        </>
      );
    case "image":
      return picture();
    case "card":
      return (
        <>
          {box(31, 9, 98, 83)}
          {box(38, 16, 84, 28, soft)}
          {label("프로젝트 카드", 39, 61, 10, ink, 700)}
          {rule(40, 74, 49)}
        </>
      );
    case "feature":
      return (
        <>
          {box(21, 13, 118, 76)}
          {box(31, 23, 24, 24, soft)}
          {label("✦", 36, 40, 19, accent)}
          {label("빠른 시작", 31, 64, 12, ink, 700)}
          {rule(32, 77, 88)}
        </>
      );
    case "stat":
      return (
        <>
          {box(19, 13, 122, 76)}
          {label("활성 사용자", 29, 32, 9, "#746d84")}
          {label("24,892", 28, 60, 23, ink, 750)}
          {label("↗ 12.8%", 30, 79, 10, "#44745a", 600)}
        </>
      );
    case "tabs":
      return (
        <>
          {box(14, 17, 132, 69)}
          {label("개요", 24, 36, 10, accent, 700)}
          {label("분석", 69, 36, 10, "#827b91")}
          {label("설정", 110, 36, 10, "#827b91")}
          <path d="M19 43h36" stroke={accent} strokeWidth="2" />
          {label("선택한 탭의 내용", 31, 66, 10)}
        </>
      );
    case "accordion":
      return (
        <>
          {box(17, 12, 126, 76)}
          {label("어떻게 시작하나요?", 25, 31, 10, ink, 600)}
          {label("−", 129, 31, 11, accent)}
          {label("템플릿을 골라보세요.", 25, 48, 8, "#797186")}
          <path d="M24 59h112" stroke={line} />
          {label("모바일도 되나요?", 25, 76, 10)}
          {label("+", 129, 76, 11, accent)}
        </>
      );
    case "alert":
      return (
        <>
          {box(13, 25, 134, 50, soft)}
          <circle cx="30" cy="43" r="8" fill={accent} />
          {label("✓", 25, 47, 11, "white")}
          {label("저장 완료", 45, 43, 12, ink, 700)}
          {label("변경 사항을 저장했어요.", 45, 60, 8)}
        </>
      );
    case "table":
      return (
        <>
          {box(12, 14, 136, 74)}
          {box(13, 15, 134, 18, soft, 4)}
          {label("이름", 23, 27, 8)}
          {label("상태", 85, 27, 8)}
          {label("날짜", 120, 27, 8)}
          {["디자인", "홈페이지", "모바일"].map((v, i) => (
            <g key={v}>
              {label(v, 23, 47 + i * 17, 8)}
              {label(i === 2 ? "완료" : "진행 중", 85, 47 + i * 17, 7, accent)}
              {label("오늘", 120, 47 + i * 17, 7)}
              {i < 2 && <path d={`M20 ${52 + i * 17}h120`} stroke={line} />}
            </g>
          ))}
        </>
      );
    case "pricing":
      return (
        <>
          {box(34, 6, 92, 89)}
          {label("PRO", 44, 22, 8, accent, 700)}
          {label("₩19,000", 44, 42, 15, ink, 750)}
          {label("✓ 무제한 프로젝트", 44, 57, 7)}
          {label("✓ 맞춤 테마", 44, 68, 7)}
          {box(44, 75, 72, 13, accent, 3)}
          {label("플랜 선택", 64, 84, 7, "white")}
        </>
      );
    case "testimonial":
      return (
        <>
          {box(19, 16, 122, 72)}
          {label("“", 28, 43, 29, accent)}
          {label("정말 편리해요.", 45, 46, 12, ink, 600)}
          <circle cx="36" cy="69" r="8" fill={soft} />
          {label("김서윤 · 디자이너", 50, 73, 8, "#797186")}
        </>
      );
    case "empty":
      return (
        <>
          {box(65, 17, 30, 23, soft)}
          <path d="M65 26h9l4 5h5l4-5h8" fill="none" stroke={accent} />
          {label("아직 내용이 없어요", 37, 58, 11)}
          {action("+ 새로 만들기", 42, 68, 77)}
        </>
      );
    case "navbar":
      return (
        <>
          {box(9, 21, 142, 57)}
          {label("LOGO", 18, 43, 10, accent, 750)}
          {label("소개", 67, 42, 7)}
          {label("기능", 91, 42, 7)}
          {box(116, 31, 28, 16, accent, 3)}
          {label("시작", 123, 42, 7, "white")}
          <path d="M16 55h128" stroke={line} />
          {rule(19, 66, 75)}
        </>
      );
    case "hero":
      return (
        <>
          {box(9, 13, 142, 75)}
          {label("생각을", 19, 39, 14, ink, 750)}
          {label("현실로.", 19, 57, 14, ink, 750)}
          {box(19, 67, 42, 13, accent, 3)}
          {label("시작하기", 25, 76, 7, "white")}
          {picture(94, 28, 46, 45)}
        </>
      );
    case "sidebar":
      return (
        <>
          {box(12, 10, 136, 80)}
          {box(13, 11, 47, 78, soft, 4)}
          {label("LOGO", 19, 26, 8, accent, 700)}
          {box(18, 36, 37, 13, accent, 2)}
          {label("프로젝트", 21, 45, 6, "white")}
          {label("분석", 21, 61, 7)}
          {label("설정", 21, 77, 7)}
          {rule(71, 29, 63)}
          {box(70, 43, 31, 30, soft)}
          {box(107, 43, 31, 30, soft)}
        </>
      );
    case "cta":
      return (
        <>
          {box(13, 15, 134, 72, soft)}
          {label("함께 시작해요", 37, 39, 14, ink, 750)}
          {label("다음 단계로 안내하세요", 39, 54, 8)}
          {box(47, 64, 66, 17, accent, 4)}
          {label("지금 시작하기", 58, 76, 8, "white")}
        </>
      );
    case "footer":
      return (
        <>
          {rule(20, 19, 80)}
          <path d="M15 40h130" stroke={line} />
          {label("LOGO", 19, 59, 12, accent, 750)}
          {label("소개", 83, 57, 8)}
          {label("문의", 117, 57, 8)}
          {label("© Your brand", 19, 78, 8, "#797186")}
        </>
      );
    case "avatar":
      return (
        <>
          <circle cx="42" cy="50" r="22" fill={soft} />
          {label("민지", 30, 55, 13, accent, 700)}
          {label("김민지", 74, 46, 12, ink, 700)}
          {label("디자이너", 74, 64, 9)}
        </>
      );
    case "avatar-group":
      return (
        <>
          {[0, 1, 2, 3].map((n) => (
            <g key={n}>
              <circle
                cx={43 + n * 25}
                cy="43"
                r="19"
                fill={n % 2 ? accent : soft}
                stroke="white"
                strokeWidth="3"
              />
              {label(
                ["민지", "준호", "서연", "+2"][n],
                33 + n * 25,
                47,
                9,
                n % 2 ? "white" : accent,
              )}
            </g>
          ))}
          {label("함께하는 우리 팀", 40, 78, 10)}
        </>
      );
    case "breadcrumbs":
      return (
        <>
          {label("홈", 15, 52, 10)}
          {label("/", 40, 52, 10)}
          {label("프로젝트", 54, 52, 10)}
          {label("/", 103, 52, 10)}
          {label("상세", 117, 52, 10, accent, 700)}
        </>
      );
    case "search":
      return (
        <>
          {box(15, 17, 130, 28)}
          <circle cx="30" cy="30" r="5" fill="none" stroke={accent} />
          <path d="m34 34 4 4" stroke={accent} />
          {label("디자인 검색", 44, 35, 9)}
          {label("브랜드 디자인", 25, 65, 10)}
          {rule(25, 78, 92)}
        </>
      );
    case "textarea":
      return (
        <>
          {label("메시지", 19, 24, 9)}
          {box(17, 33, 126, 51)}
          {label("이야기를 남겨주세요…", 26, 53, 9, "#817b91")}
          {rule(27, 65, 78)}
        </>
      );
    case "radio":
      return (
        <>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <circle
                cx="31"
                cy={25 + i * 25}
                r="7"
                fill="white"
                stroke={i === 0 ? accent : line}
              />
              {i === 0 && <circle cx="31" cy="25" r="4" fill={accent} />}{" "}
              {label(["디자인", "개발", "기획"][i], 47, 29 + i * 25, 11)}
            </g>
          ))}
        </>
      );
    case "range":
      return (
        <>
          {label("볼륨", 21, 32, 10)}
          {label("60%", 112, 32, 10, accent)}
          {box(20, 49, 120, 6, line, 3)}
          {box(20, 49, 72, 6, accent, 3)}
          <circle
            cx="92"
            cy="52"
            r="9"
            fill="white"
            stroke={accent}
            strokeWidth="3"
          />
        </>
      );
    case "progress":
      return (
        <>
          {label("이번 주 목표", 19, 32, 10)}
          {label("72%", 116, 32, 9, accent)}
          {box(18, 46, 124, 10, soft, 5)}
          {box(18, 46, 89, 10, accent, 5)}
          {label("목표에 가까워지고 있어요", 19, 76, 9)}
        </>
      );
    case "steps":
      return (
        <>
          <path d="M30 40h100" stroke={line} strokeWidth="2" />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <circle
                cx={30 + i * 50}
                cy="40"
                r="14"
                fill={i === 1 ? accent : soft}
              />
              {label(
                i === 0 ? "✓" : String(i + 1),
                26 + i * 50,
                44,
                11,
                i === 1 ? "white" : accent,
              )}
              {label(["입력", "확인", "완료"][i], 21 + i * 50, 71, 9)}
            </g>
          ))}
        </>
      );
    case "pagination":
      return (
        <>
          {["‹", "1", "2", "3", "›"].map((s, i) => (
            <g key={i}>
              {box(11 + i * 29, 35, 25, 28, i === 2 ? accent : "white", 4)}
              {label(s, 20 + i * 29, 53, 11, i === 2 ? "white" : ink)}
            </g>
          ))}
        </>
      );
    case "skeleton":
      return (
        <>
          {box(19, 25, 28, 28, soft, 14)}
          {[31, 48, 65].map((y, i) => (
            <g key={y}>{box(60, y, i === 2 ? 53 : 79, 9, line)}</g>
          ))}
        </>
      );
    case "tooltip":
      return (
        <>
          {box(25, 19, 110, 29, ink)}
          {label("도움말을 확인하세요", 36, 37, 9, "white")}
          <path d="m72 48 8 8 8-8" fill={ink} />
          {box(47, 64, 66, 22, soft)}
          {label("안내 ⓘ", 65, 79, 10, accent)}
        </>
      );
    case "dropdown":
      return (
        <>
          {box(27, 10, 106, 23)}
          {label("작업 선택 ⌄", 38, 26, 10)}
          {box(27, 38, 106, 52)}
          {label("복사하기", 38, 55, 10)}
          {label("이름 바꾸기", 38, 75, 10)}
        </>
      );
    case "dialog":
      return (
        <>
          {box(9, 9, 142, 82, "#dedbe8")}
          {box(27, 22, 106, 58)}
          {label("새로운 소식", 38, 40, 11, ink, 700)}
          {rule(38, 51, 74)}
          {box(84, 61, 36, 12, accent, 3)}
          {label("확인", 95, 70, 7, "white")}
        </>
      );
    case "toast":
      return (
        <>
          {box(12, 30, 136, 42)}
          <circle cx="29" cy="50" r="9" fill={soft} />
          {label("✓", 24, 54, 12, accent)}
          {label("저장했어요", 46, 48, 11, ink, 600)}
          {label("변경 사항이 반영됐어요", 46, 62, 7)}
          {label("×", 132, 52, 14)}
        </>
      );
    case "timeline":
      return (
        <>
          <path d="M31 20v62" stroke={line} strokeWidth="2" />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <circle cx="31" cy={25 + i * 28} r="5" fill={accent} />
              {label(
                ["첫 아이디어", "첫 번째 출시", "새로운 도전"][i],
                48,
                29 + i * 28,
                10,
              )}
            </g>
          ))}
        </>
      );
    case "bar-chart":
      return (
        <>
          {label("주간 활동", 20, 22, 10, ink, 700)}
          {[30, 55, 42, 66, 49].map((h, i) => (
            <g key={i}>
              {box(22 + i * 25, 87 - h, 16, h, i === 3 ? accent : "#beb4eb", 3)}
            </g>
          ))}
        </>
      );
    case "donut-chart":
      return (
        <>
          <circle
            cx="80"
            cy="49"
            r="32"
            fill="none"
            stroke={soft}
            strokeWidth="11"
          />
          <circle
            cx="80"
            cy="49"
            r="32"
            fill="none"
            stroke={accent}
            strokeWidth="11"
            pathLength="100"
            strokeDasharray="76 100"
            transform="rotate(-90 80 49)"
          />
          {label("76%", 61, 54, 18, ink, 700)}
        </>
      );
    case "logos":
      return (
        <>
          {label("함께하는 브랜드", 42, 28, 9)}
          {label("FORMA", 14, 58, 13, ink, 750)}
          {label("Orbit", 81, 58, 15, accent, 600)}
          {label("LUMEN", 47, 81, 12, "#817b91", 700)}
        </>
      );
    case "team":
      return (
        <>
          {box(29, 8, 102, 84)}
          <circle cx="80" cy="34" r="17" fill={soft} />
          {label("서윤", 68, 38, 11, accent)}
          {label("김서윤", 62, 65, 11, ink, 700)}
          {label("Creative Director", 45, 81, 8)}
        </>
      );
    case "product":
      return (
        <>
          {box(32, 7, 96, 86)}
          {picture(39, 13, 82, 39)}
          {label("Everyday Chair", 41, 65, 9, ink, 600)}
          {label("₩129,000", 41, 83, 12, accent, 700)}
        </>
      );
    case "newsletter":
      return (
        <>
          {label("좋은 소식을 먼저", 27, 32, 13, ink, 700)}
          {box(16, 49, 85, 26)}
          {label("이메일 주소", 25, 66, 9, "#817b91")}
          {box(105, 49, 39, 26, accent)}
          {label("구독", 115, 66, 9, "white")}
        </>
      );
    case "contact":
      return (
        <>
          {box(21, 9, 118, 82)}
          {label("함께 이야기해요", 32, 27, 12, ink, 700)}
          {box(31, 36, 98, 15)}
          {label("이메일", 37, 47, 7, "#817b91")}
          {box(31, 56, 98, 26)}
          {label("문의 내용", 37, 68, 7, "#817b91")}
        </>
      );
    case "marquee":
      return (
        <>
          {box(0, 28, 160, 45, accent, 0)}
          {label("CREATE ✦ EXPLORE", -10, 58, 21, "white", 800)}
        </>
      );
    case "spotlight":
      return (
        <>
          <circle cx="126" cy="49" r="35" fill={soft} />
          {label("MAKE", 15, 36, 26, ink, 850)}
          {label("IT MATTER.", 15, 65, 22, accent, 850)}
          {box(16, 77, 48, 11, accent, 2)}
        </>
      );
    case "gallery":
      return (
        <>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              {box(13 + i * 47, 18, 40, 55, i === 1 ? accent : soft)}
              <circle
                cx={33 + i * 47}
                cy="42"
                r="12"
                fill={i === 1 ? "white" : accent}
              />
              {rule(15 + i * 47, 84, 30)}
            </g>
          ))}
        </>
      );
    case "chat":
      return (
        <>
          {box(16, 17, 100, 27, soft)}
          {label("무엇을 도와드릴까요?", 25, 34, 8)}
          {box(69, 50, 75, 25, accent)}
          {label("안녕하세요!", 81, 66, 10, "white")}
          {rule(19, 87, 93)}
        </>
      );
    case "calendar":
      return (
        <>
          {box(30, 8, 100, 85)}
          {label("‹   2026.10   ›", 41, 27, 10, accent, 700)}
          {Array.from({ length: 21 }, (_, i) => (
            <g key={i}>
              {i === 14 &&
                box(
                  38 + (i % 7) * 12,
                  35 + Math.floor(i / 7) * 17,
                  12,
                  14,
                  accent,
                  3,
                )}
              {label(
                String(i + 1),
                40 + (i % 7) * 12,
                45 + Math.floor(i / 7) * 17,
                7,
                i === 14 ? "white" : ink,
              )}
            </g>
          ))}
        </>
      );
    default:
      return null;
  }
}

export default memo(function ComponentThumbnail({ id }: { id: string }) {
  return (
    <svg
      className="b-component-thumbnail"
      viewBox="0 0 160 100"
      aria-hidden="true"
      focusable="false"
      fontFamily="inherit"
    >
      {sample(id)}
    </svg>
  );
});
