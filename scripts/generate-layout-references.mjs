import fs from 'fs';
import path from 'path';

console.log('Writing full 368 layout references generator...');

function item(id, part, name, koreanName, trend, gridGeometry, focalAnchor, density, desc, wireframe, features, tags) {
  return {
    id,
    part,
    name,
    koreanName,
    trend,
    gridGeometry,
    focalAnchor,
    density,
    description: desc,
    wireframeShape: wireframe,
    keyFeatures: features || ['고유 구조적 그리드', '실시간 인라인 커스텀', 'Figma/v0 즉시 내보내기'],
    tags: tags || [trend, gridGeometry, focalAnchor],
    promptDirectives: {
      figma: `${gridGeometry} structure in Figma Auto-Layout, ${trend} visual language with 16px/24px padding and structured hierarchy`,
      tailwind: `w-full py-12 px-4 md:px-8 relative`,
      aiImage: `High-fidelity production web component: ${name} designed in ${trend} aesthetic, crisp detail, modern 2026 UI`
    },
    customOptions: {
      showBadge: true,
      showSecondaryCta: true,
      showGridLines: false,
      showSparkline: false
    }
  };
}

// 1. HERO (64 items)
const heroList = [
  // GenUI & AI-Native (8)
  item('hero-genui-center-prompt', 'hero', 'Embedded GenUI Prompt Bar Hero', '🤖 중앙 생성형 AI 프롬프트 바 히어로', 'GenUI & AI-Native', '1col-center', 'interactive', 'balanced', '자연어 프롬프트 인풋 필드, 실시간 실행 추천 알약 태그, [⌘K로 생성하기] 버튼이 내장된 AI-Native 중앙 레이아웃', 'center-prompt', ['자연어 인풋창 내장', '빠른 프롬프트 칩', '실시간 생성 결과 프리뷰 모달 트리거'], ['GenUI', 'AI-Native', 'Search-first']),
  item('hero-genui-split-canvas', 'hero', 'Dual-Pane Prompt & Realtime Streaming Canvas', '⚡ 좌측 프롬프트 + 우측 실시간 캔버스 스플릿', 'GenUI & AI-Native', 'split-50-50', 'hybrid', 'compact', '좌측 지시문 컨트롤 패널, 우측 실시간 렌더링 가상 브라우저가 배치된 50:50 분할형', 'split-left-prompt', ['좌측 프롬프트 컨트롤', '우측 실시간 렌더러', '생성 토큰 카운터'], ['GenUI', 'Split-screen', 'Copilot']),
  item('hero-genui-chat-copilot', 'hero', 'Floating Co-Pilot Dialogue Hero', '💬 부유형 AI 코파일럿 대화 카드 히어로', 'GenUI & AI-Native', 'split-60-40', 'interactive', 'balanced', '와이드 헤드라인 우측 하단으로 반투명 프로스티드 글래스 코파일럿 챗 카드 3단계 대화가 겹쳐진 레이어드', 'split-floating-chat', ['부유형 글래스 챗', '멀티턴 메시지 스레드', '실시간 답변 배지'], ['GenUI', 'Agentic', 'Conversational']),
  item('hero-genui-agent-status', 'hero', 'Multi-Agent Autonomous Pipeline Hero', '🧭 멀티 에이전트 자율 파이프라인 진행 상태 히어로', 'GenUI & AI-Native', '1col-center', 'data', 'compact', '에이전트 3총사(Planner, Coder, Reviewer)가 연결된 노드 그래프와 실시간 상태 배지 시각화', 'pipeline-nodes', ['노드 다이어그램', '실시간 에이전트 상태', '작업 소요 시간 텔레메트리'], ['Agentic', 'Pipeline', 'High-Tech']),
  item('hero-genui-slash-command', 'hero', 'Slash-Command Terminal Palette Hero', '⌨️ 슬래시 커맨드 팔레트 히어로', 'GenUI & AI-Native', '1col-center', 'interactive', 'ultra-dense', '타이핑 시 드롭다운 커맨드 목록(/generate, /refactor)이 열리는 Raycast 스타일 커맨드 센터', 'command-palette', ['Raycast 메타포', '단축키 뱃지', '커맨드 자동완성 리스트'], ['GenUI', 'Command-K', 'Productivity']),
  item('hero-genui-multimodal-drop', 'hero', 'Multi-Modal File & Wireframe Ingestion Hero', '📁 멀티모달 파일 & 와이어프레임 드롭존 히어로', 'GenUI & AI-Native', 'split-50-50', 'interactive', 'balanced', '좌측 대형 파일 드롭존, 우측 즉시 생성된 인터랙티브 컴포넌트 뷰', 'dropzone-split', ['드래그앤드롭 대시보드', '이미지 분석 시각화', '원클릭 변환 CTA'], ['GenUI', 'Dropzone', 'Multi-modal']),
  item('hero-genui-streaming-tokens', 'hero', 'Realtime Token Streaming Terminal Hero', '📜 실시간 토큰 스트리밍 터미널 히어로', 'GenUI & AI-Native', '1col-center', 'data', 'compact', '중앙에 타이핑 애니메이션과 토큰 카운터, 레이턴시(12ms), 속도(180 t/s)가 표기된 터미널', 'terminal-center', ['타이핑 스트리밍 효과', '지연시간 & TPS 메트릭', '모노스페이스 타이포'], ['GenUI', 'Terminal', 'Developer']),
  item('hero-genui-workflow-graph', 'hero', 'Visual Node Orchestration Flow Hero', '🕸️ 시각적 노드 오케스트레이션 플로우 히어로', 'GenUI & AI-Native', 'split-70-30', 'interactive', 'balanced', '좌측 70% 노드 그래프 캔버스, 우측 30% 선택 노드 인스펙터 패널의 전문가용 레이아웃', 'node-canvas', ['캔버스 노드 연결선', '노드 설정 인스펙터', '드래그 인터랙션 큐'], ['GenUI', 'Node-based', 'Orchestration']),

  // Bento Grid 2.0 (8)
  item('hero-bento-asymmetric-12col', 'hero', 'Asymmetric 12-Column Modular Bento Hero', '🍱 비대칭 12열 인터랙티브 벤토 히어로', 'Bento Grid 2.0', 'bento-12col', 'hybrid', 'balanced', '8열 메인 가치 제안 카드 + 4열 세로 퀵 액션 카드, 하단 3개 마이크로 지표 위젯의 플래그십 구조', 'bento-12col-layout', ['12열 비대칭 모듈', '실시간 스파크라인', '호버 뎁스 부상 효과'], ['Bento 2.0', 'Modular', 'Dashboard']),
  item('hero-bento-3x2-widgets', 'hero', '3x2 Equal Modular Widget Matrix Hero', '🔲 3x2 균등 위젯 매트릭스 벤토 히어로', 'Bento Grid 2.0', 'bento-3col', 'data', 'compact', '동일 규격 6개 카드가 3열 2행으로 정돈되어 각기 다른 마이크로 인터랙션을 품은 모듈형', 'bento-3x2-grid', ['6개 균등 카드', '카드별 고유 인터랙션', '미니 위젯 메타포'], ['Bento 2.0', 'Matrix', 'Clean']),
  item('hero-bento-circular-radar', 'hero', 'Central Circular Radar & Satellite Bento Hero', '🎯 중앙 원형 레이더 & 위성 벤토 히어로', 'Bento Grid 2.0', 'bento-asymmetric', 'visual', 'compact', '중앙 원형 타겟 레이더 그래프를 중심으로 4개 모서리 위젯 카드가 방사형으로 둘러싼 구조', 'bento-radial', ['중앙 원형 차트', '4개 위성 정보 카드', '회전 레이더 빔 효과'], ['Bento 2.0', 'Radar', 'Cyber']),
  item('hero-bento-sparkline-kpi', 'hero', 'Live Sparkline & Kinetic Ticker Bento Hero', '📈 실시간 스파크라인 & 키네틱 티커 벤토 히어로', 'Bento Grid 2.0', 'bento-12col', 'data', 'compact', '애니메이션 SVG 스파크라인 곡선과 실시간 주식 스타일 키네틱 숫자 롤러가 장착된 벤토', 'bento-sparkline', ['인터랙티브 스파크라인', '실시간 증감 롤러', '초록/빨강 상태 뱃지'], ['Bento 2.0', 'Fintech', 'Analytics']),
  item('hero-bento-video-preview', 'hero', 'Cinematic Micro-Video Loop Bento Hero', '🎬 시네마틱 마이크로 비디오 루프 벤토 히어로', 'Bento Grid 2.0', 'bento-12col', 'visual', 'balanced', '가장 큰 메인 벤토 카드가 무한 비디오 루프로 작동하고 우측 서브 카드가 타임스탬프를 표시하는 구성', 'bento-video-main', ['비디오 배경 카드', '음향 파형 비주얼라이저', '재생/일시정지 토글'], ['Bento 2.0', 'Video', 'Multimedia']),
  item('hero-bento-nested-pills', 'hero', 'Multi-Tag Density Pill Bento Hero', '🏷️ 고밀도 태그 필 & 카테고리 벤토 히어로', 'Bento Grid 2.0', 'bento-3col', 'hybrid', 'compact', '각 카드마다 8~12개의 컬러풀한 카테고리 알약 태그와 기능 체크리스트가 배열된 디자인 시스템형', 'bento-tags', ['컬러 태그 클러스터', '원클릭 필터링 지원', '고밀도 정보 압축'], ['Bento 2.0', 'Design-System', 'Tags']),
  item('hero-bento-interactive-toggle', 'hero', 'Live Switcher & Slider Micro-Sandbox Bento', '🎛️ 라이브 스위처 & 슬라이더 샌드박스 벤토', 'Bento Grid 2.0', 'bento-12col', 'interactive', 'balanced', '카드 위에서 직접 토글 스위치, 라디오 버튼, 슬라이더를 조작해 보는 미니 샌드박스 벤토', 'bento-switches', ['조작 가능한 스위치 UI', '슬라이더 값 실시간 반영', '하드웨어 촉각 스타일'], ['Bento 2.0', 'Sandbox', 'Interactive']),
  item('hero-bento-diagonal-slice', 'hero', 'Angled Diagonal Slice Bento Hero', '📐 사선 앵글 슬라이스 벤토 히어로', 'Bento Grid 2.0', 'diagonal-angle', 'visual', 'airy', '-4도 비스듬히 기울어진 사선 분할선을 따라 카드가 계단식으로 엇갈리는 역동적 벤토', 'bento-diagonal', ['-4도 사선 레이아웃', '시각적 텐션 극대화', '스크롤 시 입체 패럴랙스'], ['Bento 2.0', 'Diagonal', 'Dynamic']),

  // Spatial 3D & Clay Stage (8)
  item('hero-spatial-podium-stage', 'hero', '3D Floating Hardware Podium Stage Hero', '🔮 3D 실물 플로팅 포디움 스테이지 히어로', 'Spatial 3D & Clay', '1col-center', 'visual', 'airy', '스튜디오 원형 단상 위에 부유하는 3D 실물 기기와 사실적인 앰비언트 바닥 반사 그림자 무대', 'center-podium-3d', ['3D 단상 포디움', '접촉 그림자(Contact Shadow)', '360도 회전 큐'], ['Spatial 3D', 'Podium', 'Hardware']),
  item('hero-spatial-hotspot-pins', 'hero', 'Interactive Exploded Hotspot Pin Hero', '📍 인터랙티브 분해 핫스팟 핀 히어로', 'Spatial 3D & Clay', 'split-60-40', 'interactive', 'balanced', '좌측 제품 단면도 위 4개 펄스 링 핫스팟 핀 점멸, 클릭 시 우측에 특허 소재와 사양 팝업', 'hotspot-viewer', ['펄스 핫스팟 핀', '부품별 스펙 팝업', '정밀 엔지니어링 미학'], ['Spatial 3D', 'Hotspot', 'Interactive']),
  item('hero-spatial-clay-soft-pill', 'hero', 'Claymorphic Soft 3D Pill Hero', '🫧 클레이모피즘 소프트 3D 알약 히어로', 'Spatial 3D & Clay', '1col-center', 'visual', 'airy', '부드러운 점토 질감의 3D 아이콘과 매끄러운 엠보싱 섀도우가 형성하는 따뜻한 공간감', 'clay-pill-center', ['클레이 3D 질감', '소프트 이중 그림자', '친근한 브랜드 톤앤매너'], ['Spatial 3D', 'Claymorphism', 'Soft']),
  item('hero-spatial-isometric-cube', 'hero', 'Isometric Architecture Cube Matrix Hero', '🧊 아이소메트릭 입체 큐브 매트릭스 히어로', 'Spatial 3D & Clay', 'split-50-50', 'visual', 'compact', '30도 각도의 투명 유리 큐브들이 데이터 플로우를 형성하는 아이소메트릭 50:50 구조', 'isometric-cube-split', ['30도 아이소메트릭 그리드', '투명 아크릴 큐브', '입체 데이터 흐름 시각화'], ['Spatial 3D', 'Isometric', 'Architecture']),
  item('hero-spatial-acrylic-layers', 'hero', 'Multi-Tier Transparent Acrylic Sheets Hero', '📑 멀티 티어 투명 아크릴 시트 스택 히어로', 'Spatial 3D & Clay', 'split-60-40', 'hybrid', 'balanced', '반투명 아크릴 판 3장이 앞뒤 Z-축으로 겹쳐져 굴절광으로 상호작용하는 심도 있는 구성', 'acrylic-stack', ['Z-축 3중 아크릴 중첩', '빛의 굴절 효과', '공간 깊이감(Depth) 연출'], ['Spatial 3D', 'Glassmorphism', 'Depth']),
  item('hero-spatial-orbit-wheel', 'hero', '360° Circular Orbit Planetary Hero', '🪐 360° 원형 궤도 행성 회전 히어로', 'Spatial 3D & Clay', '1col-center', 'interactive', 'airy', '중앙 엠블럼을 중심으로 6개 파트너십/기능 아이콘이 점선 궤도를 따라 공전하는 레이아웃', 'orbit-wheel', ['원형 궤도 점선', '회전 공전 메타포', '우주적 앰비언트 배경'], ['Spatial 3D', 'Orbit', 'Ecosystem']),
  item('hero-spatial-floating-card-deck', 'hero', '3D Tilted Card Deck Fan-Out Hero', '🃏 3D 부채꼴 카드 덱 전개 히어로', 'Spatial 3D & Clay', 'split-50-50', 'visual', 'balanced', '우측 영역에 3장의 카드가 부채꼴 형태로 비스듬히 펼쳐진 3D 팬아웃 인터랙티브 레이아웃', 'card-fanout', ['부채꼴 3D 회전 카드', '마우스 호버 시 카드 전면 전개', '실제 질감의 카드 테두리'], ['Spatial 3D', 'Cards', 'Fan-out']),
  item('hero-spatial-exploded-hardware', 'hero', 'Exploded Layer Mechanical Blueprint Hero', '⚙️ 분해 청사진 레이어 하드웨어 히어로', 'Spatial 3D & Clay', 'split-70-30', 'visual', 'compact', '케이스, 메인보드, 렌즈 부품이 위아래 공중에 분해 정렬된 익스플로디드 뷰와 치수선 레이아웃', 'exploded-layers', ['공중 분해 정렬 뷰', '치수선 & 마이크로미터 태그', '엔지니어링 테크 감성'], ['Spatial 3D', 'Exploded', 'Hardware']),

  // Swiss & Neo-Brutalism (8)
  item('hero-swiss-oversized-display', 'hero', '96pt Monumental Swiss Display Typography Hero', '📰 96pt 모뉴멘탈 스위스 자이언트 타이포 히어로', 'Swiss & Neo-Brutalist', '1col-center', 'typo', 'airy', '화면 가로폭을 가득 채우는 96pt 이상 볼드 세리프 헤드라인과 0.5px 엄격한 헤어라인 그리드', 'giant-typo-center', ['화면 전폭 자이언트 텍스트', '스위스 인터내셔널 그리드', '0.5px 정밀 헤어라인'], ['Swiss', 'Editorial', 'Typography-first']),
  item('hero-swiss-dual-marquee', 'hero', 'Dual Reverse Infinite Marquee Ticker Hero', '🔄 듀얼 역방향 무한 롤링 마퀴 티커 히어로', 'Swiss & Neo-Brutalist', '1col-center', 'typo', 'compact', '상단은 좌로, 하단은 우로 엇갈려 질주하는 2줄 무한 텍스트 티커 사이 플로팅 CTA가 얹혀진 구조', 'dual-marquee-center', ['듀얼 역방향 마퀴', '시각적 무브먼트', '강렬한 텍스트 텐션'], ['Swiss', 'Neo-Brutalism', 'Marquee']),
  item('hero-brutalist-stamp-collage', 'hero', 'Tactile Physical Stamp & Badge Collage Hero', '🏷️ 택타일 스탬프 & 배지 스티커 콜라주 히어로', 'Swiss & Neo-Brutalist', 'split-50-50', 'hybrid', 'compact', '3px 블랙 스트로크 외곽선, 하드 드롭 섀도우, 회전된 승인 도장과 바코드가 중첩된 감성', 'brutalist-stamp-split', ['3px 솔리드 외곽선', '하드 드롭 섀도우', '회전된 스탬프 & 바코드'], ['Neo-Brutalism', 'Stickers', 'High-Contrast']),
  item('hero-swiss-newspaper-columns', 'hero', 'Multi-Column Broadside Newspaper Editorial Hero', '📰 4단 브로드시트 신문 에디토리얼 히어로', 'Swiss & Neo-Brutalist', '1col-center', 'typo', 'ultra-dense', '전통 신문 톱기사처럼 굵은 특종 헤드라인 아래 세로선으로 나뉜 4단 텍스트 칼럼 레이아웃', 'newspaper-4col', ['4단 칼럼 세로선', '발행일 & 에디션 메타데이터', '풀 쿼트 인용구'], ['Swiss', 'Journalism', 'Columns']),
  item('hero-brutalist-diagonal-banner', 'hero', 'Caution Tape Diagonal Caution Ribbon Hero', '🚧 안전 테이프 대각선 리본 배너 히어로', 'Swiss & Neo-Brutalist', 'diagonal-angle', 'typo', 'balanced', '화면 전체를 가로지르는 옐로우/블랙 사선 안전띠 리본 테이프와 과감한 언더라인 링크', 'diagonal-ribbon', ['사선 안전띠 리본', '하이 비비드 옐로우 대비', '원초적 주목성'], ['Neo-Brutalism', 'Ribbon', 'Vivid']),
  item('hero-swiss-monochrome-stark', 'hero', 'Stark 100% Monochrome Absolute Contrast Hero', '⚖️ 순수 100% 흑백 절대 명암비 히어로', 'Swiss & Neo-Brutalist', 'split-50-50', 'typo', 'airy', '컬러를 배제하고 오직 #000과 #FFF의 극한 대비만으로 정보 위계를 세운 갤러리 도록 스타일', 'monochrome-split', ['0% 무채색 명암비', '타이포그래피 굵기 위계', '완전한 시각적 노이즈 제거'], ['Swiss', 'Monochrome', 'Minimalist']),
  item('hero-brutalist-wireframe-grid', 'hero', 'Blueprint Exposed Coordinate Grid Hero', '📐 청사진 노출 좌표 그리드 히어로', 'Swiss & Neo-Brutalist', '1col-center', 'hybrid', 'compact', '모눈종이 좌표선(X:420, Y:890)과 십자선 마커가 그대로 노출된 엔지니어링 브루탈리즘', 'grid-coordinates', ['배경 모눈 그리드 노출', '좌표 십자선 마커', '설계도 감성'], ['Neo-Brutalism', 'Blueprint', 'Grid-lines']),
  item('hero-swiss-quote-callout', 'hero', 'Giant Manifesto Pull-Quote Hero', '💬 매니페스토 자이언트 풀 쿼트 선언 히어로', 'Swiss & Neo-Brutalist', '1col-center', 'typo', 'airy', '거대한 열린 따옴표 그래픽과 브랜드 철학 선언문이 큼직한 이탤릭 세리프로 공간을 압도', 'manifesto-quote', ['거대 따옴표 심볼', '이탤릭 세리프 선언문', '창업자 서명 필기체'], ['Swiss', 'Manifesto', 'Editorial']),

  // Asymmetric Split (8)
  item('hero-split-70-30-sticky', 'hero', '70:30 Asymmetric Narrative & Sticky Preview Hero', '📐 70:30 비대칭 내러티브 & 스티키 프리뷰 히어로', 'Asymmetric Split', 'split-70-30', 'hybrid', 'balanced', '좌측 70% 여유로운 공간 브랜드 스토리, 우측 30% 화면에 고정된 인터랙티브 프리뷰 위젯', 'split-70-30-layout', ['70:30 황금비 비대칭', '좌측 심도 있는 스토리', '우측 스티키 위젯'], ['Asymmetric Split', 'Storytelling', 'Balanced']),
  item('hero-split-50-50-app-mock', 'hero', '50:50 Balanced Split with Floating App Mockup', '⚖️ 50:50 클래식 대칭 & 플로팅 앱 목업 히어로', 'Asymmetric Split', 'split-50-50', 'hybrid', 'balanced', '좌측 50% 간결한 헤드라인/CTA와 우측 50% 기울어진 다크 모드 SaaS 웹 대시보드 스크린샷', 'split-50-50-classic', ['50:50 클래식 균형', '우측 기울어진 앱 목업', '빠른 전환 유도'], ['Asymmetric Split', 'SaaS', 'Classic']),
  item('hero-split-reversed-visual-left', 'hero', 'Reversed Visual-Left Copy-Right Hero', '🔄 반전 비주얼 좌측 + 카피 우측 히어로', 'Asymmetric Split', 'split-50-50', 'visual', 'balanced', '시선 출발점인 좌측에 거대한 시각 비주얼을 배치하고 우측에서 텍스트와 CTA를 만나는 반전 구조', 'split-visual-left', ['좌측 비주얼 우선 노출', '우측 전환 카피', '시선 흐름의 신선함'], ['Asymmetric Split', 'Reversed', 'Fresh']),
  item('hero-split-diagonal-curved-cut', 'hero', 'Curved Organic Wave Split Hero', '🌊 유기적 곡선 웨이브 스플릿 히어로', 'Asymmetric Split', 'diagonal-angle', 'visual', 'airy', '두 영역 사이를 부드러운 SVG 베지어 곡선으로 유기적으로 갈라 우아한 흐름을 유도하는 히어로', 'curved-split', ['유기적 SVG 곡선 분할', '자연스러운 공간 전이', '부드러운 브랜드 감성'], ['Asymmetric Split', 'Organic', 'Curved']),
  item('hero-split-30-70-giant-stage', 'hero', '30:70 Compact Sidebar & Giant Stage Hero', '🖥️ 30:70 컴팩트 사이드바 & 자이언트 스테이지 히어로', 'Asymmetric Split', 'split-70-30', 'visual', 'compact', '좌측 30% 슬림 컨트롤 사이드바, 우측 70% 전폭에 압도적 비주얼/비디오 스테이지를 전개', 'split-30-70-stage', ['70% 와이드 캔버스', '좌측 슬림 사이드바', '도구형 웹사이트 감성'], ['Asymmetric Split', 'Studio', 'Wide-canvas']),
  item('hero-split-overlapping-cards', 'hero', 'Central Seam Overlapping Glass Cards Hero', '🎴 중앙 경계 중첩 글래스 카드 히어로', 'Asymmetric Split', 'split-50-50', 'hybrid', 'balanced', '좌우 50:50 분할선 정중앙 경계선 위에 투명한 지표 카드가 정확히 반반 걸쳐진 입체 레이아웃', 'overlapping-center-card', ['경계선 중앙 관통 카드', '좌우 영역의 결합감', '플로팅 글래스 효과'], ['Asymmetric Split', 'Overlap', 'Glass']),
  item('hero-split-staggered-columns', 'hero', 'Staggered Dual Column Offset Hero', '🪜 엇갈린 듀얼 칼럼 스태거드 히어로', 'Asymmetric Split', 'split-50-50', 'visual', 'balanced', '좌측 칼럼은 위에서 시작하고 우측 칼럼은 120px 아래로 툭 떨어져 시작하는 단차 리듬감', 'staggered-columns', ['120px 단차 스태거드 배치', '시각적 리듬과 율동감', '포트폴리오형 감성'], ['Asymmetric Split', 'Staggered', 'Rhythm']),
  item('hero-split-interactive-slider', 'hero', 'Drag-to-Resize Split Screen Slider Hero', '↔️ 드래그 분할 조절 스플릿 스크린 히어로', 'Asymmetric Split', 'comparison-slider', 'interactive', 'balanced', '중앙 수직 핸들을 사용자가 좌우로 드래그하여 양쪽 화면 비율을 실시간 리사이징하는 인터랙티브', 'drag-split-slider', ['드래그 가능한 중앙 핸들', '양쪽 화면 비율 실시간 조절', '비교 체험 극대화'], ['Asymmetric Split', 'Comparison', 'Interactive']),

  // Liquid Glass (8)
  item('hero-glass-floating-island-dock', 'hero', 'VisionOS Floating Glass Island Dock Hero', '🏝️ VisionOS 플로팅 글래스 아일랜드 독 히어로', 'Liquid Glass', 'floating-dock', 'hybrid', 'airy', '광활한 앰비언트 그라디언트 배경 아래 굴절율과 반투명 블러를 머금은 글래스 독이 부유하는 구조', 'floating-island-dock', ['하단 부유형 글래스 독', 'VisionOS 공간 컴퓨팅 무드', '앰비언트 배경광'], ['Liquid Glass', 'VisionOS', 'Floating']),
  item('hero-glass-refractive-prism-card', 'hero', 'Chromatic Aberration Refractive Glass Hero', '🌈 색수차 굴절 프리즘 글래스 히어로', 'Liquid Glass', '1col-center', 'visual', 'balanced', '모서리를 지날 때 무지개빛 오팔 광채와 색수차가 아른거리는 최첨단 리퀴드 글래스', 'refractive-prism-card', ['무지개빛 색수차 하이라이트', '오팔 프리즘 테두리', '초현실적 유리 질감'], ['Liquid Glass', 'Prism', 'Chromatic']),
  item('hero-glass-stacked-layers-3d', 'hero', 'Triple Layered Frosted Glass Cascade Hero', '📑 3중 중첩 프로스티드 글래스 캐스케이드 히어로', 'Liquid Glass', 'stacked-zindex', 'hybrid', 'balanced', '투명도가 서로 다른 3장의 유리 카드가 계단식으로 겹쳐져 뒷장 차트가 은은하게 비치는 깊이감', 'stacked-glass-cascade', ['3중 계단식 유리 중첩', '투명도 투과 효과', '빛의 산란 깊이감'], ['Liquid Glass', 'Cascade', 'Layered']),
  item('hero-glass-aurora-glow-pod', 'hero', 'Aurora Borealis Ambient Glow Pod Hero', '🌌 오로라 보레알리스 앰비언트 글로우 팟 히어로', 'Liquid Glass', '1col-center', 'visual', 'airy', '유리 카드 바로 뒤편에서 회전하는 에메랄드/보라색 오로라 빛 구체가 유리 표면을 물들이는 조명', 'aurora-glow-pod', ['회전 오로라 라이트 오브', '유리 표면 조명 반사', '환상적인 야간 모드 무드'], ['Liquid Glass', 'Aurora', 'Ambient-Glow']),
  item('hero-glass-morphing-blob', 'hero', 'Liquid Morphing Blob Glassmorphism Hero', '💧 리퀴드 몰핑 블롭 글래스모피즘 히어로', 'Liquid Glass', '1col-center', 'visual', 'airy', '액체 방울처럼 유연하게 형태가 일렁이는 블롭 형태의 투명 유리 용기 안에 카피가 담긴 유기적 디자인', 'morphing-blob-glass', ['유기적 액체 방울 블롭', '부드러운 테두리 왜곡', '살아 숨쉬는 생동감'], ['Liquid Glass', 'Blob', 'Organic']),
  item('hero-glass-cockpit-hud', 'hero', 'Aero Glass Pilot Cockpit Canopy Hero', '✈️ 에어로 글래스 조종석 캐노피 HUD 히어로', 'Liquid Glass', 'split-60-40', 'hybrid', 'compact', '전투기 조종석 전면 곡면 유리창에 녹색 텔레메트리 데이터가 프로젝션되는 형태의 모던 글래스', 'cockpit-canopy-hud', ['곡면 캐노피 글래스', '그린 벡터 계측 HUD', '공기역학적 프레임'], ['Liquid Glass', 'Aerospace', 'Cockpit']),
  item('hero-glass-frosted-bento-dock', 'hero', 'Deep Matte Frosted Bento Glass Hero', '❄️ 딥 매트 프로스티드 벤토 글래스 히어로', 'Liquid Glass', 'bento-12col', 'hybrid', 'compact', '얼음판을 연상시키는 강력한 60px 뎁스 매트 블러 처리와 은은한 미세 노이즈 텍스처 결합', 'frosted-bento-dock', ['60px 딥 매트 블러', '미세 노이즈 텍스처', '순수한 백색 유리 테두리'], ['Liquid Glass', 'Frosted', 'Matte']),
  item('hero-glass-luminous-edge-card', 'hero', 'Neon Luminous Border Trace Hero', '⚡ 네온 루미너스 에지 트레이스 히어로', 'Liquid Glass', '1col-center', 'visual', 'balanced', '투명한 글래스 카드 테두리를 따라 빛의 입자가 시계 방향으로 순환하며 흐르는 레이저 에지', 'luminous-edge-card', ['테두리 순환 레이저 빛', '트레이싱 라이트 효과', '시선 흡인력 극대화'], ['Liquid Glass', 'Laser-edge', 'Neon']),

  // Linear HUD (8)
  item('hero-hud-linear-telemetry', 'hero', 'Linear Monospace Telemetry Cockpit Hero', '📟 Linear 스타일 모노스페이스 텔레메트리 콕핏 히어로', 'Linear HUD', '1col-center', 'data', 'ultra-dense', '최소한의 여백, 11px 마이크로 폰트, 실시간 레이턴시(12ms), TPS, 서버 상태가 기록된 극단적 생산성 HUD', 'linear-telemetry-hud', ['11px 모노스페이스 폰트', '실시간 TPS & 레이턴시 틱', 'Linear 감성 헤어라인'], ['Linear HUD', 'Developer', 'High-Density']),
  item('hero-hud-command-k-prompt', 'hero', 'Keyboard-First [⌘K] Command Center Hero', '⌨️ 키보드 퍼스트 [⌘K] 커맨드 센터 히어로', 'Linear HUD', '1col-center', 'interactive', 'compact', '방향키와 엔터키만으로 모든 작업이 실행되는 단축키 힌트 배지([G then P], [⌘K]) 중심 히어로', 'command-k-center', ['키보드 단축키 힌트 배지', '키보드 네비게이션 가이드', '전문가용 스피드 워크플로우'], ['Linear HUD', 'Keyboard-first', 'Shortcut']),
  item('hero-hud-bloomberg-ticker-tape', 'hero', 'Bloomberg Terminal Financial Data Ticker Hero', '📊 블룸버그 터미널 금융 데이터 티커 히어로', 'Linear HUD', '1col-center', 'data', 'ultra-dense', '상단 3단 금융 지수 롤링 티커, 호가창 주문 장부 매트릭스, 앰버 오렌지 폰트가 어우러진 터미널', 'bloomberg-terminal', ['실시간 호가 장부 매트릭스', '앰버 오렌지 고대비 폰트', '금융 티커 전광판'], ['Linear HUD', 'Bloomberg', 'Fintech']),
  item('hero-hud-multi-region-latency-map', 'hero', 'Global Edge Cloud Multi-Region Ping Map Hero', '🌐 글로벌 에지 클라우드 멀티 리전 핑 맵 히어로', 'Linear HUD', 'split-60-40', 'data', 'compact', '세계 지도 위 서울(8ms), 도쿄(12ms), 프랑크푸르트(85ms) 실시간 핑이 점멸하는 에지 인프라', 'global-ping-map', ['글로벌 지도 핑 시각화', '리전별 실시간 레이턴시', '인프라 신뢰성 어필'], ['Linear HUD', 'Cloud', 'Infrastructure']),
  item('hero-hud-cyberpunk-status-matrix', 'hero', 'Cyberpunk Wireframe HUD Grid Hero', '🔮 사이버펑크 와이어프레임 HUD 그리드 히어로', 'Linear HUD', '1col-center', 'visual', 'ultra-dense', 'CRT 브라운관 스캔라인, 45도 각진 코너 컨테이너, 네온 시안과 핫핑크 레이저 라인의 HUD', 'cyberpunk-hud-box', ['CRT 스캔라인 텍스처', '각진 코너 챔퍼(Chamfer)', '네온 시안/마젠타 발광'], ['Linear HUD', 'Cyberpunk', 'Sci-fi']),
  item('hero-hud-server-cluster-health', 'hero', '128-Core Server Cluster Health Grid Hero', '🖥️ 128코어 서버 클러스터 헬스 그리드 히어로', 'Linear HUD', 'split-50-50', 'data', 'ultra-dense', '128개의 미세 사각 블록이 CPU 코어 부하율에 따라 녹색, 노란색, 주황색으로 점등되는 모니터링', 'cluster-health-matrix', ['128코어 히트맵 블록', '분산 시스템 실시간 부하', '엔지니어링 신뢰성'], ['Linear HUD', 'Server', 'DevOps']),
  item('hero-hud-aerospace-telemetry-radar', 'hero', 'Aerospace Coordinate Telemetry Orbit Hero', '🛰️ 에어로스페이스 좌표 텔레메트리 궤도 히어로', 'Linear HUD', 'split-60-40', 'data', 'compact', '인공위성 고도(420km), 방위각(114°), 속도(7.8km/s)가 정밀 계측 다이얼로 표시되는 우주 항공 HUD', 'satellite-telemetry', ['방위각 & 고도 계측기', '궤도 벡터선', '정밀 군사/항공 미학'], ['Linear HUD', 'Aerospace', 'Satellite']),
  item('hero-hud-git-branch-pipeline', 'hero', 'Live Git Branch & Commit Stream Hero', '🌿 라이브 Git 브랜치 & 커밋 스트림 히어로', 'Linear HUD', '1col-center', 'data', 'compact', 'main, feature 브랜치가 머지되는 시각적 Git 트리 선과 최신 커밋 해시가 실시간으로 흐르는 히어로', 'git-branch-tree', ['시각적 Git 머지 트리', '커밋 해시 뱃지', 'CI/CD 빌드 성공 체크'], ['Linear HUD', 'Git', 'Open-Source']),

  // Minimalist Editorial & Cinematic (8)
  item('hero-cinema-fullbleed-vignette', 'hero', '100vw Full-Bleed Cinematic Photography Hero', '🎬 100vw 풀블리드 시네마틱 화보 히어로', 'Minimalist Editorial', 'fullbleed-cinematic', 'visual', 'airy', '좌우 여백 없이 브라우저 전체를 채우는 8K 건축 사진과 하단 다크 비네팅 위에 은은히 뜬 카피', 'fullbleed-vignette', ['100vw 전폭 사진', '다크 비네팅 그라디언트', '극단적 미니멀 카피'], ['Cinematic', 'Full-bleed', 'Luxury']),
  item('hero-cinema-horizontal-lookbook', 'hero', '2:3 Vertical Editorial Fashion Filmstrip Hero', '🎞️ 2:3 세로 룩북 가로 필름스트립 히어로', 'Minimalist Editorial', 'carousel-filmstrip', 'visual', 'airy', '세로 2:3 비율의 파리 패션위크 런웨이 화보 컷들이 수평으로 매끄럽게 흐르는 룩북 필름스트립', 'filmstrip-horizontal', ['2:3 세로 비율 화보', '가로 부드러운 스크롤', '컬렉션 메타데이터 태그'], ['Cinematic', 'Lookbook', 'Fashion']),
  item('hero-cinema-layered-street-collage', 'hero', 'Tactile Polaroid & Street Sticker Collage Hero', '🎨 폴라로이드 & 스트릿 스티커 콜라주 히어로', 'Minimalist Editorial', 'stacked-zindex', 'visual', 'compact', '비스듬히 놓인 폴라로이드 사진, 찢겨진 종이 테이프 질감, 홀로그램 스티커가 레이어드된 무드', 'polaroid-collage', ['폴라로이드 프레임', '찢어진 종이 테이프', '스트릿 스티커 레이어'], ['Cinematic', 'Streetwear', 'Collage']),
  item('hero-cinema-monochrome-portrait', 'hero', 'High-Contrast Monochrome Emotional Portrait Hero', '👤 하이 콘트라스트 흑백 인물 클로즈업 히어로', 'Minimalist Editorial', 'split-50-50', 'visual', 'airy', '시선을 응시하는 깊이 있는 흑백 인물 클로즈업 사진과 우측 절제된 브랜드 카피의 휴머니즘', 'portrait-split', ['깊이 있는 흑백 클로즈업', '시선 추적 아이콘택트', '정적인 브랜드 울림'], ['Cinematic', 'Monochrome', 'Portrait']),
  item('hero-cinema-architectural-white-room', 'hero', 'Ultra-Minimal Architectural White Space Hero', '🏛️ 울트라 미니멀 건축적 화이트 스페이스 히어로', 'Minimalist Editorial', '1col-center', 'typo', 'airy', '화면의 70%를 순백의 여백으로 비워두고 미술관 조각상처럼 중앙에 배치된 한 문장의 울림', 'white-room-space', ['70% 순백의 극단적 여백', '완벽한 시각 비례', '미술관 전시 도록 감성'], ['Cinematic', 'White-space', 'Architectural']),
  item('hero-cinema-split-screen-duo', 'hero', 'Dual Storytelling Split Lookbook Duo Hero', '👥 듀얼 스토리텔링 스플릿 룩북 듀오 히어로', 'Minimalist Editorial', 'split-50-50', 'visual', 'airy', '실내 스튜디오 컷과 야외 로케이션 컷의 상반된 두 화보가 마주보며 완성하는 매거진 펼침면 구도', 'split-photo-duo', ['스튜디오 vs 야외 대조', '매거진 펼침면 구도', '듀얼 무드 연출'], ['Cinematic', 'Lookbook', 'Duo']),
  item('hero-cinema-fullscreen-ambient-video', 'hero', 'Ambient Looping Video with Sound Toggle Hero', '🔊 앰비언트 비디오 루프 & 사운드 토글 히어로', 'Minimalist Editorial', 'fullbleed-cinematic', 'visual', 'airy', '숨쉬듯 움직이는 자연 비디오 루프와 우측 상단 미세한 사운드 온/오프 오디오 바 스위처', 'video-sound-toggle', ['무한 앰비언트 비디오 루프', '사운드 온/오프 인터랙션', '영화적 몰입감'], ['Cinematic', 'Video-loop', 'Sound']),
  item('hero-cinema-magazine-issue-cover', 'hero', 'Quarterly Issue Magazine Cover Hero', '📖 계간지 매거진 커버 프론트 히어로', 'Minimalist Editorial', '1col-center', 'hybrid', 'balanced', '상단 브랜드 마스트헤드, 중앙 메인 화보 컷, 모서리에 바코드와 이슈 번호가 인쇄된 정통 잡지 표지', 'magazine-cover', ['잡지 마스트헤드 타이틀', '이슈 번호 & 바코드 스탬프', '헤드라인 기사 티저'], ['Cinematic', 'Magazine', 'Masthead']),

  // Special Variants (8)
  item('hero-special-radial-metric-halo', 'hero', 'Radial Metric Halo Luminescence Hero', '💫 방사형 메트릭 헤일로 루미넌스 히어로', 'Liquid Glass', '1col-center', 'data', 'airy', '중앙의 거대한 99.9% 신뢰도 지표를 감싸는 3중 발광 원형 링과 입체 조명 연출 히어로', 'radial-metric-halo', ['3중 발광 링', '중앙 거대 지표', '은은한 앰비언트 광원'], ['Special', 'Halo', 'Radial']),
  item('hero-special-matrix-rain-terminal', 'hero', 'Matrix Digital Rain Code Rain Hero', '🟢 매트릭스 디지털 레인 코드 비 히어로', 'Linear HUD', '1col-center', 'visual', 'ultra-dense', '상단에서 초록색 바이너리 코드가 미세하게 흘러내리는 레트로 퓨처리즘 해커 터미널 히어로', 'matrix-code-rain', ['바이너리 코드 비 텍스처', '해커 터미널 감성', '형광 그린 네온'], ['Special', 'Matrix', 'Terminal']),
  item('hero-special-origami-folded-cards', 'hero', 'Origami Poly-Folded Angled Surface Hero', '📐 오리가미 입체 종이접기 폴딩 히어로', 'Spatial 3D & Clay', 'split-50-50', 'visual', 'balanced', '종이를 접은 듯 빛과 그림자가 꺾이는 다각형 면 분할로 기하학적 깊이감을 부여한 히어로', 'origami-folded', ['다각형 폴리곤 셰이딩', '기하학적 면 분할', '입체 종이접기 미학'], ['Special', 'Origami', 'Geometry']),
  item('hero-special-typographic-ticker-wrap', 'hero', '360° Circular Rotating Text Ticker Hero', '🔄 360° 원형 회전 텍스트 인장 씰 히어로', 'Swiss & Neo-Brutalist', '1col-center', 'typo', 'balanced', '시계 방향으로 회전하는 원형 타이포그래피 인장 씰 스탬프가 중앙 CTA를 감싸고 도는 레이아웃', 'circular-stamp-wrap', ['회전 원형 타이포 텍스트', '중앙 CTA 버튼 포커스', '도장 인장 메타포'], ['Special', 'Circular', 'Stamp']),
  item('hero-special-floating-safari-browser', 'hero', 'MacOS Safari Window Floating Tilt Hero', '🖥️ 맥OS 사파리 윈도우 틸트 플로팅 히어로', 'Asymmetric Split', 'split-50-50', 'visual', 'balanced', '실제 맥OS 창 상단 트래픽 라이트 버튼과 정밀 주소창이 달린 브라우저가 공중에 15도 틸트된 뷰', 'safari-tilt-window', ['맥OS 사파리 크롬 바', '15도 입체 틸트 원근감', '웹앱 스크린샷 연출'], ['Special', 'MacOS', 'Browser']),
  item('hero-special-particle-constellation', 'hero', 'Interactive Gravity Particle Constellation Hero', '✨ 인터랙티브 중력 파티클 별자리 히어로', 'GenUI & AI-Native', '1col-center', 'interactive', 'airy', '마우스 커서를 따라 수천 개의 빛나는 파티클이 인력을 받아 결집하며 형상을 만드는 캔버스', 'gravity-particles', ['인터랙티브 파티클 반응', '중력 시뮬레이션', '신비로운 앰비언스'], ['Special', 'Particles', 'Interactive']),
  item('hero-special-vertical-split-slider', 'hero', 'Vertical Horizon Top-Bottom Split Hero', '↕️ 상하 수평선 50:50 분할 스플릿 히어로', 'Asymmetric Split', 'split-50-50', 'hybrid', 'airy', '좌우가 아닌 화면의 상단 50%와 하단 50%를 수평선으로 갈라 극적 대비를 주는 수평 분할', 'top-bottom-split', ['상하 수평 분할선', '하늘과 대지 대비 구도', '시원한 파노라마 시야'], ['Special', 'Horizon', 'Split']),
  item('hero-special-brutalist-ticket-stub', 'hero', 'Concert Perforated Ticket Stub Pass Hero', '🎟️ 콘서트 티켓 절취선 패스 스텁 히어로', 'Swiss & Neo-Brutalist', '1col-center', 'hybrid', 'balanced', '우측에 점선 절취선(Perforation)과 바코드 스캔 영역이 달린 한정판 VIP 콘퍼런스 티켓 메타포', 'ticket-stub-pass', ['점선 절취선 그래픽', '바코드 및 입장 번호', '한정판 VIP 패스 감성'], ['Special', 'Ticket', 'Brutalist'])
];

console.log(`Hero total: ${heroList.length}`);

// 2. FEATURE & BENTO GRID (62 items)
const featureSeeds = [
  // Bento Modules (12)
  ['bento-classic-4card', 'Classic 4-Card Balanced Bento', '🍱 클래식 4카드 균형 벤토', 'Bento Grid 2.0', 'bento-12col', 'hybrid', 'balanced', '좌상단 메인 8열 카드와 우상단 4열 보조 카드, 하단 6열 2개 카드로 짜인 가장 안정적인 벤토'],
  ['bento-sparkline-kpi', 'Bento with Live Sparkline & Metric Counter', '📈 실시간 스파크라인 & 지표 벤토', 'Bento Grid 2.0', 'bento-12col', 'data', 'compact', '카드 내부에 SVG 실시간 선형 차트와 키네틱 숫자 롤러가 돌아가는 금융/성능형 벤토'],
  ['bento-1hero-3micro', '1-Hero Wide + 3 Micro Action Tiles', '🥇 1대형 와이드 + 3 마이크로 액션 타일', 'Bento Grid 2.0', 'bento-12col', 'hybrid', 'balanced', '상단 전체를 가로지르는 와이드 12열 비주얼 카드 아래 아기자기한 3개의 마이크로 액션 타일'],
  ['bento-dense-6matrix', 'High-Density 6-Matrix Modular Grid', '🔲 초고밀도 6-매트릭스 모듈러 벤토', 'Bento Grid 2.0', 'bento-3col', 'data', 'ultra-dense', '3열 2행의 촘촘한 사각 모듈 안에 API 응답값, 서버 부하, 단축키가 빼곡히 들어찬 벤토'],
  ['bento-circular-progress', 'Radial Donut & Progress Gauge Bento', '🍩 원형 도넛 & 프로그레스 게이지 벤토', 'Bento Grid 2.0', 'bento-asymmetric', 'data', 'compact', '가운데 92% 달성 원형 프로그레스 링이 자리잡고 좌우 카드가 세부 통계를 받쳐주는 구성'],
  ['bento-horizontal-timeline', 'Horizontal Milestone Stepper Bento', '🛤️ 수평 마일스톤 스텝퍼 벤토', 'Bento Grid 2.0', 'bento-12col', 'hybrid', 'balanced', '카드 상단에 4단계 로드맵 진행선(Step 1~4)이 관통하며 단계별 혜택을 보여주는 벤토'],
  ['bento-neon-laser-glow', 'Dark OLED Laser Border Glowing Bento', '🌌 OLED 레이저 보더 발광 벤토', 'Bento Grid 2.0', 'bento-12col', 'visual', 'compact', '트루블랙 배경 위에 네온 민트와 사이언 0.5px 미세 레이저 보더가 카드마다 빛나는 벤토'],
  ['bento-interactive-pill-switch', 'Live Segmented Tab Switcher Bento', '🎛️ 라이브 세그먼트 탭 스위처 벤토', 'Bento Grid 2.0', 'bento-3col', 'interactive', 'balanced', '카드 헤더의 3단 알약 탭(Basic / Pro / Max)을 누르면 카드 내부 콘텐츠가 실시간 스왑'],
  ['bento-masonry-staggered', 'Staggered Height Masonry Bento', '🧱 높낮이 단차 메이슨리 벤토', 'Bento Grid 2.0', 'masonry-3col', 'visual', 'airy', '카드의 세로 높이가 300px, 420px, 240px로 엇갈리며 핀터레스트처럼 자연스러운 리듬감'],
  ['bento-audio-waveform', 'Audio Visualizer & Waveform Bento', '🎙️ 오디오 비주얼라이저 & 음파 벤토', 'Bento Grid 2.0', 'bento-12col', 'visual', 'balanced', '실제 사운드 주파수 막대 24개가 춤추는 이퀄라이저와 보이스 녹음 파형이 탑재된 벤토'],
  ['bento-drag-reorder-tiles', 'Customizable Drag-and-Drop Tile Bento', '🖐️ 드래그 앤 드롭 자유 배치 벤토', 'Bento Grid 2.0', 'bento-3col', 'interactive', 'compact', '사용자가 타일 우상단 핸들을 잡고 원하는 순서대로 위치를 바꿀 수 있는 대시보드 벤토'],
  ['bento-health-status-board', '99.99% System Health Status Bento', '🟢 99.99% 시스템 헬스 상태판 벤토', 'Bento Grid 2.0', 'bento-12col', 'data', 'compact', 'API, CDN, Database, Auth의 실시간 그린 체크 점등 라이트가 깜빡이는 신뢰도 벤토'],

  // Interactive Tabs & Switchers (10)
  ['tabs-vertical-left-preview', 'Vertical Left Sidebar Tabs with Big Canvas', '📑 좌측 세로 탭 + 우측 대형 캔버스', 'Asymmetric Split', 'interactive-tabs', 'interactive', 'balanced', '좌측 4개 세로 탭 메뉴를 클릭하면 우측 75% 영역의 고해상도 기능 데모 스크린이 즉시 전환'],
  ['tabs-top-pill-segments', 'Top Pill Segment Switcher + Split Screen', '💊 상단 알약 세그먼트 스위처 + 분할 화면', 'Asymmetric Split', 'interactive-tabs', 'interactive', 'balanced', '상단 중앙 3개 둥근 알약 버튼 전환에 따라 하단 50:50 분할 영역의 기능 설명과 일러스트 스왑'],
  ['tabs-4step-pipeline-flow', '4-Step Interactive Pipeline Flow', '🪜 4단계 인터랙티브 파이프라인 흐름', 'Asymmetric Split', 'timeline-vertical', 'hybrid', 'balanced', '기획 → 디자인 → 코드 → 배포의 4단계 횡스크롤 스텝퍼를 누를 때마다 진행 표시줄이 차오름'],
  ['tabs-role-based-persona', 'Role-Based Dual Persona Switcher (Dev vs PM)', '👥 직무별 맞춤 듀얼 페르소나 스위처', 'Asymmetric Split', 'interactive-tabs', 'hybrid', 'balanced', '“개발자 모드” vs “프로덕트 매니저 모드” 토글에 따라 완전히 다른 맞춤형 기능 명세 렌더'],
  ['tabs-ios-vs-android-preview', 'Dual-Platform Cross-Device Toggle', '📱 iOS vs Android 크로스 플랫폼 토글', 'Asymmetric Split', 'interactive-tabs', 'visual', 'balanced', '아이폰 16 다이나믹 아일랜드 뷰와 갤럭시 S25 엣지 뷰를 1클릭으로 전환해보는 뷰포트'],
  ['tabs-code-language-runner', 'Multi-Language Code Snippet Runner (TS/Py/Go)', '💻 다국어 코드 스니펫 러너 (TS/Python/Go)', 'Linear HUD', 'interactive-tabs', 'interactive', 'compact', 'TypeScript, Python, Go 탭 전환 및 [Run Code ▶] 버튼 클릭 시 터미널 출력 결과 시뮬레이션'],
  ['tabs-accordion-vertical-expand', 'Smooth Vertical Accordion Expander', '📂 매끄러운 세로 아코디언 익스팬더', 'Asymmetric Split', 'accordion-vertical', 'hybrid', 'balanced', '클릭한 1개 항목만 아래로 부드럽게 펼쳐지며 내부 스크린샷과 서브 불릿을 드러내는 아코디언'],
  ['tabs-radial-orbit-selector', '360° Circular Dial Wheel Feature Selector', '🎡 360° 원형 다이얼 휠 기능 선택기', 'Spatial 3D & Clay', 'interactive-tabs', 'interactive', 'airy', '마우스 휠을 돌리거나 드래그하여 원형 다이얼을 회전시키며 6개 핵심 기능을 탐색하는 구조'],
  ['tabs-floating-bottom-dock-menu', 'Floating Bottom Dock Feature Switcher', '🚢 하단 부유형 독(Dock) 기능 스위처', 'Liquid Glass', 'floating-dock', 'interactive', 'airy', '맥OS 독처럼 화면 하단에 둥둥 뜬 반투명 아이콘을 호버하면 돋보기처럼 확대되며 기능 선택'],
  ['tabs-interactive-pricing-tier', 'Interactive Tier Calculator within Feature', '🧮 기능 연동 비용 시뮬레이션 인터랙티브', 'Bento Grid 2.0', 'interactive-tabs', 'data', 'compact', '기능 스펙 카드 안에서 직접 슬라이더를 당겨 월간 절감 시간과 ROI를 계산해보는 위젯'],

  // Before & After / Comparison (10)
  ['compare-split-slider-drag', 'Interactive Drag-to-Reveal Before/After', '↔️ 드래그 전후 비교 양방향 슬라이더', 'Asymmetric Split', 'comparison-slider', 'interactive', 'balanced', '가운데 세로 바를 좌우로 드래그하여 수작업(Before)과 AI 자동화(After)의 차이를 눈으로 확인'],
  ['compare-side-by-side-cards', 'Side-by-Side Legacy vs Modern 2-Card Contrast', '⚖️ 레거시 vs 모던 2단 대조 카드', 'Swiss & Neo-Brutalist', 'split-50-50', 'hybrid', 'balanced', '좌측의 붉은색 비효율 레거시 방식과 우측의 초록색 고효율 신기술 방식을 나란히 비교'],
  ['compare-xray-lens-reveal', 'Circular X-Ray Lens Hover Reveal', '🔍 원형 엑스레이 렌즈 호버 투과 뷰', 'Spatial 3D & Clay', 'comparison-slider', 'interactive', 'airy', '마우스 커서 위치에 둥근 엑스레이 렌즈가 따라다니며 제품 겉면 속 내부 반도체 회로를 투시'],
  ['compare-problem-solution-matrix', 'Red-Cross vs Green-Check Feature Matrix', '❌ 문제점 빨간줄 vs 해결책 초록체크 매트릭스', 'Swiss & Neo-Brutalist', 'split-50-50', 'hybrid', 'compact', '좌측 5개 고민거리에 사선 취소선이 그어지고 우측에 완벽한 해결 솔루션이 체크되는 구조'],
  ['compare-performance-race-bar', 'Animated Benchmark Speed Race Bar', '🏎️ 애니메이션 벤치마크 속도 레이스 바', 'Linear HUD', '1col-center', 'data', 'compact', '타사(2.4s) 대비 자사 솔루션(0.12s)이 20배 빠르게 치고 나가는 수평 로딩 바 대조'],
  ['compare-cost-saving-quadrant', '2x2 Cost vs Speed Quadrant Matrix', '📊 2x2 비용 vs 속도 4분면 매트릭스', 'Linear HUD', 'bento-asymmetric', 'data', 'balanced', 'X축 속도, Y축 비용의 4분면 좌표계에서 우상단 최고 위치에 독보적으로 자리잡은 시각 차트'],
  ['compare-workflow-timeline-diff', 'Linear Timeline Workflow Step Reduction', '📉 단계 단축 타임라인 워크플로우 비교', 'Asymmetric Split', 'timeline-vertical', 'hybrid', 'balanced', '기존 12단계에 걸친 복잡한 프로세스가 단 2단계로 압축되는 극적 워크플로우 시각화'],
  ['compare-dark-vs-light-mode', 'Instant Dark/Light Theme Flip Preview', '🌓 다크 모드 vs 라이트 모드 즉시 플립 뷰', 'Liquid Glass', 'comparison-slider', 'interactive', 'balanced', '가운데 반달 토글을 누르면 카드 좌우가 각각 다크와 라이트 톤으로 전환되는 디자인 시스템'],
  ['compare-manual-vs-ai-clock', 'Stopwatch Time Spent Counter Comparison', '⏱️ 스톱워치 소요 시간 대조 카운터', 'Linear HUD', 'split-50-50', 'data', 'compact', '“48시간 소요” 아날로그 시계 째깍거림 vs “3초 완성” 디지털 번개 아이콘의 직관적 대비'],
  ['compare-before-after-gallery', 'Carousel of 5 Real-World Case Comparisons', '🖼️ 5대 실전 도입 전후 갤러리 캐러셀', 'Minimalist Editorial', 'carousel-filmstrip', 'visual', 'airy', '스와이프하며 5개 실제 고객사의 도입 전 엉망인 코드와 도입 후 정제된 아키텍처를 비교']
];

// High-Tech & Code Showcase (10)
const highTechSeeds = [
  ['tech-monaco-code-editor', 'Embedded Monaco Code Editor with Syntax Glow', '💻 구문 발광 내장형 모나코 코드 에디터', 'Linear HUD', '1col-center', 'data', 'ultra-dense', '실제 VS Code와 동일한 다크 테마, 줄 번호, 구문 강조, [Copy Snippet] 원클릭 버튼'],
  ['tech-api-curl-terminal', 'Interactive cURL API Request Terminal', '📡 인터랙티브 cURL API 요청 터미널', 'Linear HUD', '1col-center', 'interactive', 'compact', 'HTTP GET/POST 엔드포인트 URL, 헤더 토큰, JSON 요청 본문이 단정하게 정렬된 터미널'],
  ['tech-realtime-json-tree', 'Collapsible Realtime JSON Tree Inspector', '🌳 접이식 실시간 JSON 트리 인스펙터', 'Linear HUD', 'split-50-50', 'data', 'compact', '좌측 API 호출 버튼을 누르면 우측에 200 OK 상태코드와 함께 펼쳐지는 계층형 JSON'],
  ['tech-webhook-event-simulator', 'Live Webhook Event Trigger Simulator', '⚡ 실시간 웹훅 이벤트 트리거 시뮬레이터', 'Linear HUD', 'bento-12col', 'interactive', 'compact', '`order.created`, `payment.success` 이벤트를 클릭하면 0.05초 만에 페이로드가 수신되는 데모'],
  ['tech-database-schema-er', 'Visual Interactive Database Schema ER Diagram', '🗄️ 시각적 데이터베이스 스키마 ER 다이어그램', 'Linear HUD', 'split-70-30', 'data', 'balanced', '테이블 간 1:N 외래키 관계선이 반투명 선으로 이어지고 호버 시 필드 타입이 툴팁으로 표시'],
  ['tech-docker-container-tiles', 'Multi-Container Microservice Status Tiles', '🐳 멀티 컨테이너 마이크로서비스 상태 타일', 'Linear HUD', 'bento-3col', 'data', 'compact', 'Auth, Payment, Analytics 도커 컨테이너의 CPU 점유율, 메모리 사용량, 포트 번호 모니터링'],
  ['tech-cicd-pipeline-steps', 'CI/CD Pipeline Build & Deploy Stepper', '🚀 CI/CD 파이프라인 빌드 & 배포 스텝퍼', 'Linear HUD', 'timeline-vertical', 'hybrid', 'balanced', 'Lint(통과 3s) → Test(통과 12s) → Build(통과 8s) → Global Deploy(배포 완료 2s) 파이프라인'],
  ['tech-edge-latency-ping-grid', 'Global Edge Network 12-City Ping Grid', '🌐 글로벌 12개 도시 에지 핑 레이턴시 그리드', 'Linear HUD', 'bento-12col', 'data', 'compact', '도쿄, 런던, 싱가포르, 프랑크푸르트 등 12개 리전의 실시간 레이턴시가 초록색으로 펄스'],
  ['tech-sdk-quickstart-cards', 'Multi-Language SDK Quickstart Cards (iOS/Web/Node)', '📦 멀티 언어 SDK 퀵스타트 카드 (iOS/React/Python)', 'Bento Grid 2.0', 'bento-3col', 'interactive', 'balanced', '각 언어 탭을 누르면 `npm i @core/sdk` 설치 한 줄 명령어와 3줄 초기화 코드가 즉시 복사'],
  ['tech-micro-benchmark-graph', 'Comparative Micro-Benchmark Latency Bar Graph', '📊 비교 마이크로 벤치마크 지연시간 바 그래프', 'Linear HUD', 'split-50-50', 'data', 'compact', '초당 트랜잭션(TPS)과 P99 지연시간을 타사 대비 10배 정밀하게 시각화한 테크 바 차트']
];

// Editorial & Magazine Storyboards (10)
const editorialSeeds = [
  ['story-3col-magazine-grid', '3-Column Editorial Magazine Typography Grid', '📰 3단 에디토리얼 매거진 타이포 그리드', 'Minimalist Editorial', 'bento-3col', 'typo', 'airy', '정통 매거진의 3단 칼럼 구성, 상단 챕터 넘버 [CHAPTER 01], 세련된 이탤릭 세리프 본문'],
  ['story-pullquote-manifesto', 'Oversized Manifesto Pull-Quote with Pull-Bar', '💬 오버사이즈 매니페스토 풀 쿼트 & 인용 바', 'Swiss & Neo-Brutalist', '1col-center', 'typo', 'airy', '“우리는 본질에 집중합니다” 거대한 인용문과 좌측 6px 두꺼운 브랜드 컬러 액센트 바'],
  ['story-sticky-scroll-chapters', 'Sticky Left Chapter Title + Scrolling Story Right', '📜 스티키 좌측 챕터 타이틀 + 스크롤링 우측 스토리', 'Asymmetric Split', 'split-70-30', 'hybrid', 'balanced', '좌측 챕터 번호와 타이틀은 화면에 찰떡같이 고정되고 우측에서 긴 장문의 스토리가 스크롤'],
  ['story-fullbleed-photo-spread', 'Full-Bleed Photographic Editorial Spread', '🖼️ 풀블리드 포토그래픽 에디토리얼 펼침면', 'Minimalist Editorial', 'fullbleed-cinematic', 'visual', 'airy', '잡지 양면을 꽉 채운 흑백 건축 사진 위에 얇은 흰색 고딕 서체로 각인된 프로덕트 철학'],
  ['story-numbered-step-chronicle', 'Numbered Giant Chronological Step Progression', '🔢 넘버링 자이언트 연대기 스텝 연출', 'Swiss & Neo-Brutalist', 'timeline-vertical', 'typo', 'compact', '01, 02, 03 숫자가 120pt 거대 크기로 배경에 은은히 깔리고 그 위로 각 단계의 도전과 극복'],
  ['story-asymmetric-photo-triplet', 'Asymmetric Photo Triplet with Overlapping Captions', '📸 3단 비대칭 화보 컷 & 캡션 오버랩', 'Minimalist Editorial', 'masonry-3col', 'visual', 'balanced', '비율이 각기 다른 3장의 스튜디오 컷과 각 컷의 모서리에 겹쳐진 반투명 캡션 설명 카드'],
  ['story-swiss-hairline-index', 'Swiss Hairline Categorized Index Table', '🗂️ 스위스 헤어라인 카테고리 인덱스 테이블', 'Swiss & Neo-Brutalist', '1col-center', 'typo', 'ultra-dense', '0.5px 가로줄로만 구획된 미니멀한 인덱스 테이블에 기능명, 릴리즈 버전, 기여자가 정렬'],
  ['story-graphic-quote-trio', 'Trio Cards with Giant Typography Watermark', '🎴 자이언트 타이포 워터마크 3연작 카드', 'Swiss & Neo-Brutalist', 'bento-3col', 'typo', 'balanced', 'SPEED, POWER, SCALE 세 단어가 각 카드의 배경에 초대형 워터마크로 깔린 3연작 카드'],
  ['story-newspaper-front-page', 'Front-Page Broadside Column Feature Layout', '🗞️ 프론트 페이지 1면 특종 칼럼 레이아웃', 'Swiss & Neo-Brutalist', '1col-center', 'typo', 'ultra-dense', '신문 1면처럼 굵은 특종 헤드라인, 날짜 스탬프, 4개 칼럼으로 정교하게 나뉜 텍스트 블록'],
  ['story-raw-brutalist-grid-lines', 'Raw Brutalist Visible Construction Grid Lines', '🏗️ 원초적 브루탈리스트 그리드 골조선 노출', 'Swiss & Neo-Brutalist', 'bento-12col', 'hybrid', 'compact', '모든 컴포넌트의 경계선과 여백이 건축 설계도처럼 굵은 검은 선과 좌표로 노출된 구조']
];

// Micro-Interactions & Hardware (10)
const hardwareSeeds = [
  ['hw-tactile-knob-dial', 'Rotatable Tactile Audio Knob & Decibel Dial', '🎚️ 회전형 아날로그 노브 & 데시벨 다이얼', 'Spatial 3D & Clay', 'bento-12col', 'interactive', 'compact', '금속 질감의 회전 볼륨 노브를 마우스로 돌리면 우측 LED 데시벨 미터가 실시간 점등'],
  ['hw-mechanical-key-switch', 'Clickable Mechanical Keyboard Switch Simulator', '⌨️ 클릭 가능한 기계식 키보드 스위치 시뮬레이터', 'Spatial 3D & Clay', 'split-50-50', 'interactive', 'balanced', '청축, 적축, 갈축 키캡을 직접 마우스로 눌러보며 타건감과 사운드 파형을 체험하는 위젯'],
  ['hw-camera-lens-optics', 'Multi-Element Camera Lens Optical Cross-Section', '📷 멀티 엘리먼트 카메라 렌즈 광학 단면도', 'Spatial 3D & Clay', 'split-60-40', 'visual', 'compact', '5중 광학 렌즈의 빛 굴절 경로와 조리개(f/1.4) 수치 변화가 시각화된 테크놀로지 카드'],
  ['hw-haptic-slider-track', 'Haptic Notched Step Slider with Resistance', '🎛️ 햅틱 눈금 저항 스텝 슬라이더 트랙', 'Spatial 3D & Clay', '1col-center', 'interactive', 'balanced', '10% 단위로 자석처럼 턱턱 걸리는 마그네틱 눈금 저항감을 시각적 바운스로 표현한 슬라이더'],
  ['hw-thermal-heatmap-distribution', 'Realtime Thermal Heatmap Dissipation View', '🌡️ 실시간 서멀 히트맵 발열 분산 뷰', 'Linear HUD', 'split-50-50', 'data', 'compact', '기기 내부 칩셋의 열 분포가 파랑(28°C)에서 주황(42°C)으로 실시간 그라디언트 렌더링'],
  ['hw-magnetic-snap-modules', 'Modular Magnetic Snapping Block Playground', '🧲 마그네틱 모듈 결합 스내핑 플레이그라운드', 'Spatial 3D & Clay', 'bento-asymmetric', 'interactive', 'balanced', '배터리 팩, 스피커, 카메라 모듈을 자석처럼 가까이 가져가면 찰칵 붙는 애니메이션'],
  ['hw-calibrated-gauge-meter', 'Analog Needle Calibrated Gauge Meter', '⏱️ 아날로그 바늘 계측기 & 정밀 게이지', 'Spatial 3D & Clay', 'bento-3col', 'data', 'compact', '크롬 테두리와 눈금자 위에서 실제 바늘이 부드럽게 감속하며 토크/속도를 가리키는 미터'],
  ['hw-micro-chip-pinout', 'Nanometer Micro-Chip Architecture Pinout Map', '🔬 나노미터 마이크로칩 핀아웃 아키텍처 맵', 'Linear HUD', 'split-70-30', 'data', 'ultra-dense', '실리콘 다이 속 수백만 개의 트랜지스터 핀 배치와 버스 대역폭(128GB/s) 통신선 레이아웃'],
  ['hw-liquid-cooling-flow', 'Interactive Liquid Cooling Loop Pipe Flow', '🧪 인터랙티브 수랭 쿨링 파이프 유류 흐름', 'Liquid Glass', 'bento-12col', 'visual', 'balanced', '투명한 냉각수 파이프 속으로 푸른색 냉매 입자가 흐르며 열을 식히는 생생한 동적 루프'],
  ['hw-led-matrix-billboard', 'Programmable LED Dot-Matrix Pixel Billboard', '💡 프로그래머블 LED 도트 매트릭스 전광판', 'Linear HUD', '1col-center', 'visual', 'compact', '가로 64 x 세로 16개의 초록색 픽셀 LED 전광판에 원하는 텍스트가 도트 폰트로 흘러감']
];

const allFeatureSeeds = [...featureSeeds, ...highTechSeeds, ...editorialSeeds, ...hardwareSeeds];
const featureList = allFeatureSeeds.map(s => item(
  `feature-${s[0]}`,
  'feature',
  s[1],
  s[2],
  s[3],
  s[4],
  s[5],
  s[6],
  s[7],
  s[0],
  ['고유 모듈러 그리드', '인터랙션 피드백', 'Figma 컴포넌트 변환'],
  [s[3], s[4], s[5]]
));

console.log(`Feature total: ${featureList.length}`);

// 3. SOCIAL PROOF & METRICS / TRUST (62 items)
const proofNames = [
  // KPI (13)
  ['kpi-bloomberg-4counter', 'Bloomberg 4-Counter Financial Metric Tape', '📊 블룸버그 4단 금융 지표 티커 테이프', '4개의 거대 금융 지표가 24시간 실시간 롤링되는 고밀도 전광판'],
  ['kpi-giant-stat-trend', 'Giant Single KPI Hero Counter with Trend Arrow', '📈 자이언트 단일 KPI 카운터 & 상승 화살표', '120pt 초대형 볼드 숫자와 전월 대비 +320% 녹색 배지가 시선을 압도하는 레이아웃'],
  ['kpi-multi-currency-spark', 'Multi-Currency Revenue Sparkline Grid', '💱 다통화 매출 스파크라인 그리드 (USD/EUR/KRW)', '각 통화별 실시간 환율과 분기 매출 추이가 미세 꺾은선으로 배열된 카드'],
  ['kpi-uptime-sla-board', '99.999% Zero-Downtime SLA Status Monitor', '🟢 99.999% 무중단 SLA 가동률 모니터', '최근 90일간의 서비스 가동 상태가 녹색 사각 블록 막대로 완벽히 채워진 보드'],
  ['kpi-active-pulse-counter', 'Live Concurrent Active Users Glowing Pulse Dot', '👥 실시간 동시 접속자 수 발광 펄스 카운터', '초록색 실시간 점멸 라이트와 함께 38,492명이 1초마다 갱신되는 위젯'],
  ['kpi-speed-multiplier-10x', '10x Speed Multiplier Benchmark Accelerator', '⚡ 10배 속도 가속 벤치마크 배지', '기존 솔루션 1배속 대비 10배 빠른 터보 게이지 바가 채워지는 가속도 지표'],
  ['kpi-roi-payback-clock', '3.2 Months Fast ROI Payback Milestone', '⏳ 3.2개월 초고속 ROI 투자 회수 마일스톤', '도입 후 투자금을 회수하는 데 걸린 평균 개월 수(3.2 Mo)를 시각화한 원형 게이지'],
  ['kpi-security-audit-score', '100/100 Perfect Security Audit Ring', '🛡️ 100/100 만점 보안 감사 점수 링', '글로벌 보안 취약점 점검 100점 만점 원형 도넛 링과 무결성 인증 태그'],
  ['kpi-global-tps-odometer', 'Global Daily Transactions Odometer Meter', '💳 일일 글로벌 트랜잭션 롤러 계기판', '누적 처리 건수가 자동차 주행거리계처럼 찰칵거리며 넘어가는 키네틱 롤러'],
  ['kpi-carbon-offset-green', 'Carbon Emission -84% Green Eco Metric', '🌱 탄소 배출 -84% 친환경 에코 메트릭', '에너지 절감량과 탄소 발자국 감축 통계를 자연의 올리브 그린 톤으로 표현'],
  ['kpi-customer-retention-gauge', '98.4% Exceptional Customer Retention Gauge', '🧲 98.4% 경이적 고객 유지율(Retention) 게이지', '이탈률 1.6% 미만의 압도적인 고객 충성도를 보여주는 반원형 아날로그 게이지'],
  ['kpi-cloud-cost-cut-half', '52% Direct Cloud Cost Reduction Metric', '💰 52% 클라우드 비용 절감 실증 지표', 'AWS/GCP 인프라 비용이 절반 이하로 급감한 전후 비교 바 차트 지표'],
  ['kpi-net-promoter-score', 'NPS +78 World-Class Promoter Score', '⭐ NPS +78 월드클래스 추천 고객 지수', '애플, 테슬라급 고객 만족도를 나타내는 +78 NPS 추천 스코어 카드'],

  // Reviews (13)
  ['review-twitter-verified-feed', 'Twitter/X Verified Influencer Post Feed', '🐦 트위터/X 인증 인플루언서 포스트 피드', '파란색 공식 인증 배지, 좋아요 수, 리트윗 수가 달린 3단 소셜 카드'],
  ['review-3row-marquee-wall', '3-Row Infinite Smooth Testimonial Marquee', '🌊 3열 무한 스크롤 고객 찬사 마퀴 월', '좌우로 엇갈려 끊임없이 흘러가는 수십 명 고객의 진솔한 한 줄 후기 마퀴'],
  ['review-video-shorts-reel', 'Vertical 9:16 Video Shorts Testimonial Cards', '📱 9:16 세로 쇼츠 비디오 인터뷰 릴', '실제 고객이 스마트폰으로 말하는 15초 인터뷰 영상 썸네일과 재생 버튼'],
  ['review-star-rating-summary', '4.9/5 Stars Aggregate Score with Breakdown Bar', '⭐ 4.9/5 총점 종합 & 5성급 비율 분포 바', '총 리뷰 8,420개의 평점 4.9점과 5점 만점 비율(94%) 수평 분포도'],
  ['review-ceo-pullquote-portrait', 'Enterprise CEO Pull-Quote with Studio Portrait', '👔 엔터프라이즈 대표 스튜디오 인물 인용구', '포춘 500대 기업 대표의 흑백 스튜디오 프로필 사진과 굵직한 추천사'],
  ['review-g2-crowd-leader-grid', 'G2 Crowd & Capterra Winter 2026 Leader Grid', '🏆 G2 크라우드 2026 윈터 리더 배지 그리드', '소프트웨어 리뷰 플랫폼 G2에서 최고 등급을 획득한 8개 공식 배지 클러스터'],
  ['review-audio-snippet-player', 'Voice of Customer 20-Sec Audio Snippet Player', '🎧 고객 육성 20초 오디오 스니펫 플레이어', '생생한 육성 후기를 들어볼 수 있는 미니 파형 재생 바와 자막 동기화'],
  ['review-trustpilot-5star-cards', 'Trustpilot Verified 5-Star Transparent Cards', '🌟 트러스트파일럿 인증 5성급 투명 카드', '초록색 트러스트파일럿 별점과 실제 구매 영수증 인증 태그가 달린 카드'],
  ['review-chat-bubble-dialogue', 'Customer Success Slack Chat Dialogue Stream', '💬 고객 감동 슬랙 챗 대화 스트림', '“정말 감사합니다, 업무 시간이 3시간 줄었어요!” 슬랙 대화창 캡처 메타포'],
  ['review-masonry-story-cards', 'Masonry Multi-Height Customer Experience Cards', '🧱 메이슨리 다단 고객 경험 스토리 카드', '사진이 포함된 장문 리뷰와 단문 리뷰가 핀터레스트처럼 유연하게 정렬'],
  ['review-before-after-interview', 'Problem vs Transformation Customer Story', '🔄 도입 전 고통 vs 도입 후 환호 2단 스토리', '야근에 시달리던 팀이 정시 퇴근하게 된 구체적 전후 일화 인터뷰'],
  ['review-highlighted-yellow-quotes', 'Neon Yellow Highlighted Key Phrase Quotes', '🖍️ 형광펜 하이라이트 핵심 문구 인용 카드', '“가장 완벽한 선택이었습니다” 핵심 문장에 노란 형광펜 밑줄이 그어진 카드'],
  ['review-community-discord-wall', 'Discord 50k Member Reaction Wall', '👾 디스코드 5만 커뮤니티 이모지 반응 월', '디스코드 채널에서 개발자들이 🔥, 🚀, ❤️ 이모지를 폭발적으로 누른 반응'],

  // Logo Clouds (12)
  ['logo-monochrome-ticker', 'Monochrome Grayscale Infinite Partner Marquee', '🏢 무채색 그레이스케일 무한 파트너 마퀴', '로고 본연의 색을 정제된 그레이로 통일하여 고급스럽게 흐르는 1단 티커'],
  ['logo-2x6-hover-color-pop', '2x6 Enterprise Grid with Hover Color Pop', '🎨 2x6 엔터프라이즈 그리드 (호버 시 컬러 전환)', '평소엔 은은한 흑백 로고가 마우스 호버 시 본래 브랜드 컬러로 활성화'],
  ['logo-category-tabs-fintech', 'Industry Category Tabbed Logo Showcase', '📑 산업군별(핀테크/커머스/AI) 탭 구분 로고', '금융, 제조, 이커머스 등 산업 분야별 탭을 눌러 해당 고객사 로고를 확인'],
  ['logo-press-featured-bar', '“Featured on TechCrunch, Forbes & Wired”', '📰 “TechCrunch, 포브스, 와이어드 보도” 프레스 바', '공신력 있는 글로벌 6대 IT 미디어의 헤드라인 인용구와 매체 로고'],
  ['logo-investor-backers-cluster', 'Backed by Tier-1 Silicon Valley VCs', '🦄 실리콘밸리 톱티어 VC 투자사 클러스터', 'Y Combinator, a16z, 세콰이어 등 글로벌 최고의 투자사 로고 집합'],
  ['logo-fortune-500-badge', 'Trusted by 42% of Fortune 500 Companies', '🌐 포춘 500대 기업의 42%가 선택한 플랫폼', '신뢰도를 숫자로 증명하는 통계 헤드라인과 대표 기업 8사 엠블럼'],
  ['logo-open-source-contributors', 'Over 1,200 Open-Source GitHub Contributors', '🐙 1,200명 오픈소스 기여자 아바타 모자이크', '깃허브 스타 20k를 기록한 전 세계 개발자 기여자들의 미니 프로필 사진'],
  ['logo-academic-research-labs', 'Partnered with MIT, Stanford & KAIST Labs', '🏛️ MIT, 스탠퍼드, 카이스트 연구실 협력', '세계 최고 연구 기관 및 대학 랩실과의 산학 협력 연구 증명 배지'],
  ['logo-cert-security-shield', 'Global Official Security Certification Badges', '🛡️ 글로벌 공인 보안 인증 마크 실드', 'ISO 27001, SOC2, HIPAA, GDPR 공식 마크가 금속 뱃지처럼 진열'],
  ['logo-hairline-divided-strip', 'Swiss Hairline Divided 6-Logo Strip', '📏 스위스 헤어라인 6-로고 슬림 스트립', '0.5px 얇은 세로선으로 정갈하게 나뉜 미니멀 1열 로고 스트립'],
  ['logo-counter-case-links', 'Logo Badges with One-Click Case Study Links', '🔗 성공 사례 바로가기 링크 일체형 로고', '로고를 클릭하면 해당 고객사의 5분 심층 사례 PDF로 즉시 연결'],
  ['logo-glowing-ambient-aurora', 'Aurora Ambient Glow Behind Partner Logos', '🌌 파트너 로고 뒤 오로라 앰비언트 발광', '로고 모음 뒷배경에 은은한 오로라 빛이 아른거리며 품격을 높여주는 연출'],

  // Security & Compliance (12)
  ['security-soc2-type2-card', 'SOC2 Type II Certified Official Compliance Card', '🔒 SOC2 Type II 공식 보안 감사 인증 카드', '국제 회계법인의 엄격한 보안 통제 감사를 100% 통과했음을 증명하는 서류'],
  ['security-iso-27001-badge', 'ISO/IEC 27001 Information Security Standard', '📜 ISO 27001 정보보안 경영시스템 국제 표준', '글로벌 정보보호 관리체계 인증 번호와 유효 기간이 각인된 공식 인증서'],
  ['security-gdpr-hipaa-shield', 'GDPR & HIPAA Medical Grade Privacy Shield', '🩺 GDPR & HIPAA 의료 등급 개인정보 보호 실드', '환자 의료 데이터 및 유럽 시민권자 데이터를 완벽히 보호하는 암호화 보증'],
  ['security-bank-grade-aes256', 'Bank-Grade AES-256 Bit End-to-End Encryption', '🏦 금융권 수준 AES-256비트 종단간 암호화', '전송 중 데이터와 저장 데이터 모두 군사 등급으로 암호화됨을 알리는 배너'],
  ['security-pentest-audit-report', 'Quarterly Penetration Test Clean Report Card', '🕵️ 분기별 침투 모의해킹 취약점 무결점 리포트', '전문 화이트해커 집단의 최신 모의 침투 테스트 통과 요약 리포트'],
  ['security-24-7-sla-guarantee', '24/7/365 Dedicated Enterprise Support SLA', '🚨 24/7/365 전담 엔터프라이즈 엔지니어 SLA', '장애 발생 시 15분 이내 응답을 보증하는 1:1 전담 서포트 채널 보증서'],
  ['security-zero-trust-architecture', 'Zero-Trust Perimeter-Less Security Architecture', '🛡️ 제로 트러스트(Zero-Trust) 무경계 보안 아키텍처', '단 한 건의 비인가 접근도 허용하지 않는 현대적 제로 트러스트 흐름도'],
  ['security-bug-bounty-hackerone', 'HackerOne Official Bug Bounty Program', '🐞 해커원 공식 버그 바운티 포상 프로그램', '전 세계 보안 연구원들에게 취약점 제보 포상금을 지급하는 투명성 증명'],
  ['security-data-residency-map', 'Multi-Region Data Residency & Sovereignty', '🗺️ 멀티 리전 데이터 주권 및 현지 보관 보장', '한국, 미국, EU 등 고객이 원하는 국가의 서버에만 데이터를 보관'],
  ['security-statuspage-incident', 'Transparent StatusPage Live Incident History', '📊 투명한 실시간 장애 이력 스테이터스 페이지', '숨김없이 투명하게 공개되는 최근 1년간의 서버 장애 이력 및 복구 시간'],
  ['security-nda-enterprise-contract', 'Enterprise Grade Custom NDA & Contract Terms', '📝 맞춤형 비밀유지계약(NDA) 및 엔터프라이즈 계약', '대기업 법무팀의 까다로운 특약 조건을 100% 수용 가능한 유연한 계약 체계'],
  ['security-sbom-license-audit', 'Software Bill of Materials (SBOM) Verified', '📦 소프트웨어 자재명세서(SBOM) 오픈소스 검증', '모든 종속성 패키지의 라이선스 위반 및 보안 취약점을 사전 검증 완료'],

  // Case Studies & Impact (12)
  ['casestudy-fintech-transformation', 'Fintech Giant: 4.8x Efficiency Transformation', '🚀 글로벌 핀테크: 업무 효율 4.8배 폭발적 혁신', '기존 수작업 대사 업무를 자동화하여 월 1,200시간을 절감한 대표 사례'],
  ['casestudy-ecommerce-scale', 'E-Commerce: Black Friday 120,000 TPS Withstood', '🛍️ 이커머스: 블랙프라이데이 12만 TPS 무장애 달성', '트래픽 폭주 상황에서도 지연시간 18ms를 유지하며 서버 다운 제로 기록'],
  ['casestudy-healthcare-ai', 'University Hospital: 99.4% Diagnosis Assistance', '🏥 대학병원: 99.4% 정확도의 AI 진단 보조 시스템', '의료진의 판독 피로도를 60% 낮춘 임상 실험 결과와 의사 인터뷰'],
  ['casestudy-edutech-growth', 'EdTech Startup: From 10k to 1M Users in 6 Months', '📚 에듀테크: 6개월 만에 1만에서 100만 유저 급성장', '서버 증설 비용 없이 클라우드 아키텍처 최적화로 일궈낸 급성장 일화'],
  ['casestudy-saas-churn-reduction', 'B2B SaaS: Churn Dropped from 8.2% to 1.1%', '📉 B2B SaaS: 이탈률 8.2%에서 1.1%로 기적적 개선', '온보딩 인터랙션 개선만으로 고객 유지율을 7배 끌어올린 심층 분석'],
  ['casestudy-global-logistics-iot', 'Global Shipping: Realtime Tracking of 500k Vessels', '🚢 해운 물류: 전 세계 50만 척 선박 실시간 IoT 관제', '위성 통신 레이턴시를 극복하고 글로벌 해상 물류를 시각화한 프로젝트'],
  ['casestudy-problem-solution-outcome', '3-Part Card: The Challenge, The Solution, The Impact', '🧩 3단계 완벽 구조: 난관, 솔루션, 정량적 성과', '문제-해결-결과의 표준적이고 명쾌한 3단 스토리보드로 신뢰감 형성'],
  ['casestudy-video-walkthrough-modal', '5-Minute Deep Dive Video Walkthrough Modal', '🎬 5분 고객사 현장 심층 인터뷰 영상 팝업', '개발 총괄 이사가 직접 아키텍처 화면을 띄워놓고 설명하는 고화질 영상'],
  ['casestudy-milestone-growth-chart', '3-Year Milestone Journey Growth Line Chart', '📈 3개년 동반 성장 마일스톤 누적 그래프', '시드 투자부터 시리즈 C까지 당사 솔루션과 함께 성장한 고객사의 여정'],
  ['casestudy-trophy-awards-showcase', 'Global Innovation Design & Tech Trophy Showcase', '🏆 글로벌 혁신 테크 & 디자인 어워드 수상작', 'CES 혁신상, iF 디자인 어워드, Red Dot 본상을 수상한 기술력 입증'],
  ['casestudy-patent-grant-display', '18 Granted Global Patents & Technology Rights', '📜 18건의 등록 완료된 글로벌 특허 기술권', '독자적인 AI 압축 알고리즘과 보안 프로토콜 특허 번호 목록 전시'],
  ['casestudy-founder-letter-promise', 'Personal Letter & Commitment from the Founder', '✉️ 창업자의 자필 서명과 철학이 담긴 약속', '“우리는 고객의 성공 전까지 멈추지 않습니다” 창업팀의 진정성 있는 편지']
];

const proofList = proofNames.map(s => item(
  `proof-${s[0]}`,
  'proof',
  s[1],
  s[2],
  s[0].startsWith('kpi') ? 'Linear HUD' : s[0].startsWith('review') ? 'Bento Grid 2.0' : s[0].startsWith('logo') ? 'Minimalist Editorial' : s[0].startsWith('security') ? 'Liquid Glass' : 'Asymmetric Split',
  s[0].startsWith('logo') ? 'marquee-ticker' : s[0].startsWith('casestudy') ? 'split-60-40' : s[0].startsWith('review') ? 'masonry-3col' : 'bento-12col',
  s[0].startsWith('kpi') ? 'data' : s[0].startsWith('logo') ? 'visual' : 'hybrid',
  s[0].startsWith('kpi') ? 'ultra-dense' : 'balanced',
  s[3],
  s[0],
  ['압도적 정량 지표', '고객 신뢰도 검증', '원클릭 증빙 연동'],
  ['Social Proof', 'Trust', 'Credibility']
));

console.log(`Proof total: ${proofList.length}`);

// 4. PRICING & COMPARISON (60 items)
const pricingSeeds = [
  // 3-Tier Cards (15)
  ['3tier-popular-neon-glow', 'Center Card Highlighted with Neon Laser Glow', '🌟 중앙 프로 플랜 네온 레이저 발광 하이라이트', '가장 인기 있는 가운데 카드가 위로 16px 솟아오르고 네온 에메랄드 테두리로 발광하는 정석 3단'],
  ['3tier-frosted-glass-depth', 'Frosted Glass 3-Tier with Variable Blur Depth', '❄️ 투명도 단차 프로스티드 글래스 3단 카드', '스타터는 10px 블러, 프로는 30px 블러, 엔터프라이즈는 60px 딥 블러로 깊이감을 차등 부여'],
  ['3tier-swiss-hairline-minimal', 'Swiss Monochrome Hairline 3-Tier Pricing', '📏 스위스 흑백 헤어라인 미니멀 3단 요금제', '어떠한 화려한 색도 배제하고 0.5px 정밀한 외곽선과 단정한 폰트 크기만으로 위계를 세운 구성'],
  ['3tier-neo-brutalist-shadow', 'Neo-Brutalist 3-Tier with Hard Drop Shadow', '🧱 네오 브루탈리스트 4px 하드 섀도우 3단', '두꺼운 3px 검은 외곽선과 그림자 번짐 없는 6px 하드 블랙 섀도우가 경쾌한 주목성을 부여'],
  ['3tier-oled-laser-matrix', 'OLED Dark Mode 3-Tier with Cyan Hairline', '🌌 OLED 딥블랙 & 사이언 레이저 3단 요금제', '트루블랙(#000) 배경 위에 전기빛 사이언과 마젠타 얇은 레이저 선이 카드를 감싸는 하이테크'],
  ['3tier-pill-badge-floating', 'Floating Pill Badges 3-Tier Pricing', '🏷️ 플로팅 알약 배지 3단 요금제 (Best Value)', '카드 상단 정중앙에 “🔥 가장 많은 선택” 알약 뱃지가 반쯤 걸쳐진 입체 요금제'],
  ['3tier-annual-discount-toggle', 'Bento 3-Tier with 20% Annual Discount Switch', '🔄 연간 20% 할인 토글러 내장 벤토 3단', '상단에 “월간 결제” vs “연간 결제 (2개월 무료!)” 스위치가 달려 숫자가 실시간 슬라이드'],
  ['3tier-checklist-dense', 'High-Density Feature Checklist 3-Tier Cards', '📋 고밀도 기능 체크리스트 3단 카드', '각 티어마다 10~15개의 상세 기능 체크 항목이 빼곡히 들어차 가성비를 체감시키는 구조'],
  ['3tier-free-pro-enterprise', 'Free Forever vs Pro vs Enterprise Contrast', '⚖️ 완전 무료 vs 프로 vs 엔터프라이즈 극명 대비', '개인 무료 체험을 장려하면서 엔터프라이즈의 보안/전담 기능을 뚜렷하게 대조'],
  ['3tier-stacked-card-deck', 'Z-Index Layered Overlapping 3-Card Deck', '🃏 Z-인덱스 겹침형 3단 카드 덱', '3장의 카드가 부채꼴처럼 살짝 겹쳐져 호버 시 마우스가 올라간 카드가 맨 앞으로 튀어나옴'],
  ['3tier-asymmetric-hero-pro', 'Asymmetric 60% Giant Pro Card + 2 Small Wings', '👑 60% 자이언트 프로 카드 + 양날개 미니 카드', '프로 플랜에 60%의 압도적 가로폭을 할당하고 양쪽에 무료와 기업 플랜을 날개처럼 배치'],
  ['3tier-horizontal-strip-row', 'Compact Horizontal 3-Row Pricing Strip', '➖ 가로 3열 컴팩트 스트립 요금제', '세로 카드가 아닌 가로로 길게 뻗은 3개의 가로 행 스트립으로 모바일에서도 한눈에 파악'],
  ['3tier-color-coded-tiers', 'Color-Coded Blue/Purple/Gold Tier Badges', '🎨 블루/퍼플/골드 컬러 코딩 티어 배지', '스타터는 차분한 블루, 프로는 환상적인 퍼플, 엔터프라이즈는 럭셔리 골드 포인트'],
  ['3tier-gradient-header-cards', 'Aurora Gradient Header 3-Tier Pricing', '🌈 오로라 그라디언트 헤더 3단 카드', '카드 상단 100px 영역에만 화려한 오로라 빛 그라디언트가 채워진 세련된 카드'],
  ['3tier-interactive-hover-zoom', 'Spring Kinetic Hover Zoom 3-Tier Pricing', '🚀 스프링 키네틱 호버 줌 3단 요금제', '마우스 호버 시 1.05배 부드럽게 확대되며 하단 CTA 버튼에 빛이 흐르는 역동적 인터랙션'],

  // Comparison Matrices (15)
  ['matrix-sticky-header-table', 'Sticky Header Full Feature Comparison Matrix', '📌 스티키 헤더 고정 풀 피처 비교 매트릭스', '스크롤을 내려도 상단 티어 이름과 가격이 브라우저 상단에 고정되어 긴 표를 편하게 열람'],
  ['matrix-accordion-categories', 'Accordion Expandable Feature Comparison Table', '📂 아코디언 카테고리 접이식 비교표', '보안, 분석, 협업 등 카테고리 헤더를 클릭하여 원하는 영역만 펼쳐보는 깔끔한 비교표'],
  ['matrix-check-vs-cross-icons', 'Green Check vs Gray Dash Visual Indicator Table', '🟢 초록 체크 vs 회색 대시 직관적 지원 여부 표', '불필요한 글자 대신 명쾌한 그린 체크 아이콘과 회색 대시 기호로 지원 여부를 직관화'],
  ['matrix-scorecard-rating-grid', '5-Star Feature Scorecard Comparison Grid', '⭐ 5점 만점 기능별 성적표 비교 그리드', '단순 지원 여부를 넘어 기능 완성도를 별점과 점수로 상세히 채점한 스코어카드'],
  ['matrix-plan-limit-slider', 'Dynamic Plan Limit Highlight Slider', '🎚️ 플랜별 한도 하이라이트 동적 슬라이더', '사용자가 원하는 일일 API 호출량을 선택하면 충족하는 티어가 자동으로 밝게 점등'],
  ['matrix-diff-only-toggle', '“Show Only Differences” Toggle Matrix Table', '🔍 “차이점만 모아보기” 필터 토글 비교표', '모든 플랜이 공통으로 지원하는 항목을 숨기고 차이나는 핵심 항목만 골라보는 똑똑한 표'],
  ['matrix-enterprise-sla-checklist', 'Dedicated Enterprise SLA & Compliance Sheet', '🏢 전담 엔터프라이즈 SLA & 컴플라이언스 시트', 'SOC2, 싱글사인온(SSO), 전담 매니저 배정 여부를 집중 조명한 B2B 맞춤 비교표'],
  ['matrix-addon-modular-selector', 'Modular Add-On Feature Checkbox Matrix', '🧩 모듈러 추가 옵션(Add-on) 체크박스 표', '기본 플랜 위에 필요한 애드온(전용 IP, 감사 로그)을 체크하여 총액을 합산해보는 표'],
  ['matrix-security-deep-dive-grid', 'Bank-Grade Security Deep-Dive Comparison', '🔒 금융권 보안 심층 비교 그리드', '데이터 암호화 방식, 백업 주기, 재해 복구(DR) 시간을 조목조목 비교한 테크 시트'],
  ['matrix-api-quota-rate-limits', 'API Quota & Rate Limit Technical Matrix', '⚡ API 쿼터 & 속도 제한(Rate Limit) 기술 비교표', '초당 요청 수(RPS), 동시 연결 수, 웹훅 지원 여부를 개발자 관점에서 정밀 기술'],
  ['matrix-team-seats-volume-scale', 'Team Seat Volume Discount Step Matrix', '👥 팀 인원수 구간별 볼륨 할인 매트릭스', '5인, 20인, 100인 구간별로 1인당 단가가 40%까지 저렴해지는 계단식 할인표'],
  ['matrix-cloud-vs-onpremise', 'Cloud SaaS vs On-Premise Self-Hosted Matrix', '☁️ 클라우드 SaaS vs 온프레미스 설치형 대조표', '인프라 관리 주체, 데이터 소유권, 배포 방식을 양대 산맥으로 비교한 기업용 표'],
  ['matrix-third-party-integrations', '100+ Integrations Ecosystem Matrix (Slack/Notion)', '🔌 100+ 서드파티 연동 생태계 지원 매트릭스', '슬랙, 노션, 깃허브, 피그마 등 연동 가능한 툴의 로고와 지원 수준을 뱃지로 정리'],
  ['matrix-support-response-time', 'SLA Support Response Time Tiers (15m vs 24h)', '⏱️ 지원 응답 시간 티어별 보증표 (15분 vs 24시간)', '이메일 지원(24시간)부터 슬랙 전용 채널(15분)까지 응답 속도를 차등화한 명세표'],
  ['matrix-currency-switcher-table', 'Global Multi-Currency Auto-Converted Matrix', '🌍 글로벌 다통화 자동 환산 비교표 (USD/EUR/JPY/KRW)', '방문자 국가 IP를 감지하여 현지 통화와 부가세 포함 금액으로 자동 표시되는 글로벌 표'],

  // Interactive Calculators & Usage-Based (15)
  ['calc-mau-slider-volume', 'Monthly Active Users (MAU) Drag-to-Price Slider', '👥 월간 활성 사용자(MAU) 드래그 슬라이더 계산기', '1만 명부터 1,000만 명까지 슬라이더를 부드럽게 당기면 월 청구 예상액이 즉각 반응'],
  ['calc-storage-gb-stepper', 'Cloud Storage GB/TB Capacity Dynamic Stepper', '💾 클라우드 저장 공간 GB/TB 용량 동적 스텝퍼', '필요한 데이터 저장 용량을 기가바이트 단위로 조작하여 최적의 플랜을 추천받는 계산기'],
  ['calc-team-seats-counter', 'Team Members Number Stepper with Instant Total', '🔢 팀원 수 플러스/마이너스 카운터 & 즉시 견적', '[ - ] 12명 [ + ] 버튼을 눌러 인원수에 따른 실시간 할인 적용 총액을 산출'],
  ['calc-token-api-usage', 'AI Token & API Credits Consumption Forecaster', '🪙 AI 토큰 & API 크레딧 소모량 예측 계산기', '월간 프롬프트 생성 횟수를 입력하면 필요한 토큰량과 최적 크레딧 번들을 안내'],
  ['calc-cost-saving-vs-legacy', 'Annual Cost Saving Simulator vs Legacy System', '💵 기존 레거시 대비 연간 비용 절감 시뮬레이터', '현재 지출 중인 인건비와 외주비를 입력하면 연간 수천만 원 절감 효과를 그래프로 증명'],
  ['calc-pay-as-you-go-bundles', 'Prepaid Credit Bundles with Bonus Credits', '🎁 종량제 선불 크레딧 번들 (보너스 충전 혜택)', '10만 원 충전 시 +2만 원 보너스 등 게임 캐시처럼 직관적인 크레딧 충전식 카드'],
  ['calc-custom-enterprise-rfp', 'Interactive Custom Enterprise RFP Configurator', '📑 대기업 맞춤 견적서 실시간 조합 계산기', '전용망 구축, 온사이트 교육, 24시간 핫라인을 체크하면 맞춤 견적 요약서가 생성'],
  ['calc-hourly-vs-monthly-flip', 'Micro-Billing Hourly vs Monthly Rate Switcher', '⏱️ 초단위 마이크로 과금 시간당 vs 월간 전환기', '서버 인스턴스 시간당 $0.04 과금과 월간 고정 요금을 실시간 환산해 비교'],
  ['calc-startup-discount-claim', 'Early-Stage Startup 80% Discount Claimer', '🚀 초기 스타트업 80% 파격 할인 자격 확인기', '투자 단계(Seed/Pre-A)를 선택하면 80% 지원금을 즉시 적용해주는 특별 계산기'],
  ['calc-open-source-credit-grant', 'Open Source Maintainer 100% Free Grant Card', '🐙 오픈소스 메인테이너 100% 무료 지원 신청 카드', '깃허브 저장소 URL을 입력하면 즉시 무료 Pro 권한을 부여하는 개발자 친화 카드'],
  ['calc-fair-use-meter', 'Transparent Fair-Use Policy Traffic Meter', '📊 투명한 공정 사용 정책(Fair-Use) 트래픽 미터', '숨겨진 추가 요금 없이 허용되는 대역폭 한도를 게이지 바로 투명하게 사전 고지'],
  ['calc-overage-charge-estimator', 'Over-Quota Overage Charge Transparent Slider', '📈 초과 사용량 단가 투명 계산기', '기본 할당량을 초과했을 때 건당 얼마가 청구되는지 미리 계산해보는 안심 도구'],
  ['calc-annual-upfront-badge', 'Pay Annually and Save 2 Months Free Ribbon', '🎀 연간 선납 2개월 무료 혜택 뱃지 요금제', '연간 일시불 결제 시 12개월 중 2개월 치를 완전히 무료로 공제해주는 직관적 혜택'],
  ['calc-roi-payback-months', 'Investment Payback Period Calculator (Weeks/Months)', '⏳ 투자비 회수 기간(ROI) 주/월 단위 계산기', '투자 대비 수익 회수 시점을 주 단위로 쪼개어 의사결정권자를 설득하는 계산기'],
  ['calc-custom-split-billing', 'Multi-Department Split Billing Configurator', '🏢 다부서 비용 분할 청구 설정 시뮬레이터', '마케팅팀과 개발팀이 비용을 나누어 청구할 수 있도록 부서별 견적을 분할'],

  // Single Plan / Lifetime / Niche (15)
  ['single-all-in-one-bold', 'All-in-One Bold Single Plan Card ($49/mo)', '📦 모든 기능 올인원 단일 플랜 ($49/월)', '복잡한 등급 고민을 끝내주는, 모든 기능이 다 들어간 단 하나의 볼드한 사각 카드'],
  ['single-lifetime-deal-countdown', 'Lifetime Deal (LTD) with 48H Countdown Clock', '⏰ 48시간 한정 평생 소장 라이선스(LTD) 카드', '한 번 결제로 평생 무료 업데이트를 받는 한정 수량 카운트다운 타이머 카드'],
  ['single-pay-once-forever', '“Buy Once, Use Forever” Clean Guarantee Card', '💎 “한 번 구매, 평생 이용” 클린 보증 카드', '구독 피로감에 지친 현대인을 위한 영구 소장 단일 라이선스 보증서'],
  ['single-early-bird-tier', 'Early-Bird Supporter Tier (Only 42 Spots Left)', '🐦 얼리버드 서포터 한정 티어 (단 42자리 잔여)', '선착순 100명 한정 파격가 제공, 실시간 잔여 좌석 프로그레스 바 표시'],
  ['single-free-forever-oss', 'Community Free Forever Open-Source Card', '💚 커뮤니티 평생 무료 오픈소스 플랜', '개인 개발자와 학생은 평생 0원으로 이용할 수 있는 영구 무료 카드'],
  ['single-pay-what-you-want', 'Pay What You Want (PWYW) Voluntary Slider', '💝 원하는 만큼 후원하는 자율 가격 슬라이더', '기본 $5부터 사용자가 원하는 금액을 직접 슬라이더로 올려 기부하는 모델'],
  ['single-nonprofit-education', 'Non-Profit & Student 100% Free Education Pass', '🎓 비영리 단체 & 학생 100% 무료 에듀케이션 패스', '학교 이메일(.ac.kr / .edu) 인증 시 즉시 무료로 열리는 교육용 카드'],
  ['single-high-ticket-enterprise', 'Executive Briefing High-Ticket Enterprise Pass', '👔 경영진 브리핑 전용 하이티켓 엔터프라이즈 패스', '가격 대신 [경영진 1:1 상담 예약] 버튼이 크게 들어간 B2B 엔터프라이즈'],
  ['single-freemium-gateway', 'Freemium Conversion Gateway Card (No Card Needed)', '🚪 신용카드 등록 없는 프리미엄 게이트웨이', '카드 번호 입력 없이 이메일만으로 지금 즉시 시작할 수 있음을 강조'],
  ['single-money-back-30day', '100% Risk-Free 30-Day Money-Back Guarantee Card', '🛡️ 100% 무조건 30일 환불 보장 실드 카드', '불만족 시 이유 불문 100% 전액 환불해주는 황금빛 보증 도장 각인 카드'],
  ['single-no-credit-card-pill', '“No Credit Card Required” Micro Highlight Card', '💳 “신용카드 필요 없음” 안심 마이크로 카드', '가입 문턱을 낮추기 위해 신용카드 불필요 뱃지를 전면에 내세운 안심 요금제'],
  ['single-referral-credit-bonus', 'Invite Friends and Get $50 Credit Card', '🤝 친구 초대하고 $50 크레딧 적립 카드', '동료 디자이너를 초대할 때마다 양쪽 모두에게 크레딧을 지급하는 리퍼럴 카드'],
  ['single-black-friday-banner', 'Seasonal Black Friday 50% Off Banner Card', '🛍️ 블랙프라이데이 시즌 50% 반값 세일 배너', '형광 네온 레드 테두리와 함께 파격적인 반값 할인을 알리는 시즌 한정 카드'],
  ['single-custom-rfp-submission', 'Submit RFP for Custom Multi-Year Contract', '📬 다년 계약 맞춤 RFP 제안서 제출 카드', '기업 구매 조달 시스템에 맞춘 RFP 파일 업로드 및 법무 검토 지원 카드'],
  ['single-whitelabel-agency', 'White-Label Agency Reseller License Tier', '🏢 화이트라벨 에이전시 리셀러 라이선스', '자사 로고를 떼고 에이전시 브랜드로 클라이언트에게 재판매할 수 있는 권한']
];

const pricingList = pricingSeeds.map(s => item(
  `pricing-${s[0]}`,
  'pricing',
  s[1],
  s[2],
  s[0].startsWith('calc') ? 'Linear HUD' : s[0].startsWith('matrix') ? 'Bento Grid 2.0' : s[0].includes('neo') ? 'Swiss & Neo-Brutalist' : s[0].includes('glass') ? 'Liquid Glass' : 'Bento Grid 2.0',
  s[0].startsWith('matrix') ? 'bento-12col' : s[0].startsWith('calc') ? 'bento-asymmetric' : 'bento-3col',
  s[0].startsWith('calc') ? 'interactive' : 'hybrid',
  s[0].startsWith('matrix') ? 'ultra-dense' : 'balanced',
  s[3],
  s[0],
  ['전환율 극대화 설계', '투명한 가격 체계', '원클릭 결제 연동'],
  ['Pricing', 'Conversion', 'SaaS']
));

console.log(`Pricing total: ${pricingList.length}`);

// 5. CTA & CONVERSION / ENDING (60 items)
const ctaSeeds = [
  // Giant Minimal & Ambient Banners (15)
  ['ambient-gradient-fullbleed', 'Full-Bleed Aurora Ambient Gradient CTA Banner', '🌌 풀블리드 오로라 앰비언트 그라디언트 CTA', '화면 전체를 가득 채우는 오로라 빛과 중앙의 볼드한 헤드라인 + 단일 메인 버튼'],
  ['darkroom-spotlight-center', 'Darkroom Spotlight Center Focus CTA', '🔦 다크룸 스포트라이트 중앙 포커스 CTA', '어두운 공간 한가운데 위에서 스포트라이트 조명이 쏟아지듯 버튼을 비추는 연출'],
  ['glowing-laser-edge-card', 'Glowing Laser Edge Border Floating CTA', '⚡ 발광 레이저 에지 보더 플로팅 CTA 카드', '카드 둘레를 따라 에메랄드/사이언 레이저 선이 부드럽게 순환하는 입체 카드'],
  ['floating-capsule-dock-cta', 'VisionOS Floating Capsule Action Dock', '💊 VisionOS 부유형 캡슐 액션 독 CTA', '화면 하단에 떠있는 반투명 알약 캡슐 바 안에 카피와 시작하기 버튼 탑재'],
  ['monospace-developer-cli-cta', 'Monospaced Developer One-Liner CLI CTA', '💻 모노스페이스 개발자 원라이너 CLI CTA', '`curl -sL https://core.sh | bash` 한 줄 명령어와 원클릭 복사 버튼'],
  ['giant-display-single-action', 'Monumental Display Copy with Single Giant Action', '📰 모뉴멘탈 자이언트 카피 & 거대 단일 액션', '80pt 크기의 강렬한 한 줄 질문(“준비되셨습니까?”)과 묵직한 풀사이즈 버튼'],
  ['aurora-borealis-glass-cta', 'Frosted Glass Aurora Borealis Window CTA', '❄️ 프로스티드 글래스 오로라 윈도우 CTA', '유리창 너머로 북극광이 일렁이는 듯한 환상적인 글래스모피즘 CTA'],
  ['swiss-hairline-boxed-cta', 'Swiss Strict Hairline Minimal Boxed CTA', '📏 스위스 엄격한 헤어라인 박스드 CTA', '0.5px 가로세로 선으로만 구획된 미술관 도록 같은 미니멀 엔딩 박스'],
  ['neo-brutalist-thick-stroke-cta', 'Neo-Brutalist 4px Solid Black Stroke CTA', '🧱 네오 브루탈리스트 4px 솔리드 블랙 스트로크 CTA', '두꺼운 4px 외곽선과 쨍한 노란색 배경, 하드 섀도우가 눈을 때리는 강력한 CTA'],
  ['asymmetric-diagonal-slice-cta', 'Asymmetric Diagonal Angled Slice CTA', '📐 비대칭 사선 앵글 슬라이스 CTA', '-6도 기울어진 사선 컷아웃 배경 위에 텍스트와 버튼이 얹혀진 역동적 레이아웃'],
  ['video-background-ambient-cta', 'Ambient Looping Video Backdrop Dark CTA', '🎬 앰비언트 비디오 루프 배경 다크 CTA', '잔잔하게 움직이는 도심 야경 비디오 루프 위에 부유하는 CTA 컨테이너'],
  ['micro-grid-textured-dark-cta', 'Micro-Grid Technical Texture Dark CTA', '📐 마이크로 모눈 그리드 텍스처 다크 CTA', '엔지니어링 모눈종이 배경 위에 청사진 십자선 마커가 배치된 테크 CTA'],
  ['iridescent-chrome-shine-cta', 'Iridescent Chrome Sheen Liquid Metal CTA', '🪞 이리디센트 크롬 광채 리퀴드 메탈 CTA', '빛을 반사하는 유동성 액체 금속 질감의 테두리가 고급감을 자극하는 배너'],
  ['monochrome-stark-contrast-cta', '100% Monochrome Stark Black/White Contrast CTA', '⚖️ 100% 무채색 흑백 절대 명암비 CTA', '오직 블랙과 화이트의 극한 대비만으로 가장 순수한 전환을 이끌어내는 카드'],
  ['spatial-floating-orb-cta', 'Spatial Floating Glowing Orb Centerpiece CTA', '🔮 공간 부유형 발광 오브 중심 CTA', '중앙에 공중에 뜬 3D 크리스탈 오브가 천천히 회전하며 시선을 끌어당김'],

  // Lead Capture & Forms (15)
  ['lead-single-email-instant', 'Single-Line Email Input with Instant Magic Submit', '✉️ 한 줄 이메일 입력 & 매직 원클릭 전송', '이메일 주소를 적고 엔터를 누르면 마법처럼 즉시 가입 완료되는 인라인 폼'],
  ['lead-two-step-onboarding', 'Two-Step Quick Onboarding Progressive Form', '🪜 2단계 점진적 퀵 온보딩 폼', 'Step 1: 이메일 입력 → Step 2: 팀 이름 입력으로 심리적 장벽을 낮춘 폼'],
  ['lead-free-audit-url-analyzer', 'Instant Free SEO/Speed Audit URL Analyzer', '🔍 무료 성능/SEO 진단 URL 분석기 인풋', '웹사이트 URL을 입력하면 3초 만에 100점 만점 진단 리포트를 뽑아주는 폼'],
  ['lead-interactive-quiz-launcher', 'Interactive 3-Question Needs Assessment Quiz', '🧩 인터랙티브 3문항 맞춤 솔루션 진단 퀴즈', '“현재 팀 규모는?” “가장 큰 병목은?” 3개 클릭으로 맞춤 플랜을 추천'],
  ['lead-calendly-1click-scheduler', 'Calendly 1-Click Executive Meeting Scheduler', '📅 캘린들리 1클릭 15분 미팅 예약 위젯', '캘린더 날짜와 시간을 클릭하여 영업 대표와 즉시 화상 통화를 잡는 위젯'],
  ['lead-phone-sms-invite-sender', 'Mobile Phone SMS App Link Direct Sender', '📱 휴대폰 번호 입력 앱 다운로드 SMS 발송기', '전화번호를 입력하면 1초 만에 스마트폰으로 설치 링크가 전송되는 폼'],
  ['lead-domain-name-checker', 'Instant Domain / Workspace Availability Checker', '🌐 워크스페이스 / 도메인 이름 중복 확인 인풋', '“myteam.core.app” 원하는 팀 주소를 쳐서 사용 가능한지 실시간 체크'],
  ['lead-roi-lead-capture-form', 'Custom ROI Report PDF Download Lead Capture', '📊 맞춤형 ROI 분석 리포트 PDF 다운로드 폼', '예상 절감액을 확인한 뒤 상세 10장짜리 분석 보고서를 이메일로 수령'],
  ['lead-multi-select-goals', 'Multi-Select Goal Checkboxes with Action Button', '☑️ 다중 선택 목표 체크박스 결합 폼', '“속도 개선”, “비용 절감”, “보안 강화” 관심사를 체크하고 시작하기'],
  ['lead-whitepaper-download-card', 'Exclusive 2026 Industry Whitepaper Download', '📑 2026 최신 업계 백서 무료 다운로드 카드', '표지 미리보기와 목차가 깔끔히 정리된 전문 테크 리포트 다운로드 폼'],
  ['lead-early-access-waitlist', 'Early Access Waitlist with Live Queue Number', '⏳ 사전 예약 대기자 명단 & 실시간 순번 발급', '신청 즉시 “현재 대기 번호 #1,420번” 실시간 순번 티켓을 발급하는 폼'],
  ['lead-instant-api-key-issue', 'One-Click Instant Free API Key Generator', '🔑 원클릭 즉시 무료 API 키 발급 인풋', '카드 등록 없이 이메일만으로 100회 무료 테스트 API 키를 즉시 화면에 복사'],
  ['lead-company-size-selector', 'Company Size & Industry Segmented Onboarding', '🏢 기업 규모 및 업종 선택 세그먼트 폼', '스타트업 / 중견 / 대기업 라디오 버튼을 선택하여 맞춤 데모를 요청'],
  ['lead-feedback-drawer-prompt', 'Slide-Out Feedback & Consultation Drawer', '💬 슬라이드아웃 1:1 상담 문의 드로어 폼', '버튼 클릭 시 우측에서 부드럽게 열리는 1:1 전담 컨설팅 문의 창'],
  ['lead-live-demo-video-trigger', 'Interactive Live Interactive Sandbox Trigger', '🎮 브라우저 내 1분 라이브 샌드박스 실행 버튼', '가입 없이 브라우저 안에서 직접 코드를 쳐보고 실행해보는 체험 트리거']
];

// Additional CTA items (Urgency & Reassurance, 30 items)
const ctaUrgencyReassurance = [
  // Urgency & Tickets (15)
  ['urgency-perforated-coupon-ticket', 'Perforated Tear-Off 30% Discount Coupon Ticket', '🎟️ 뜯어 쓰는 절취선 30% 할인 쿠폰 티켓', '우측 점선을 마우스로 뜯는 듯한 인터랙션과 함께 쿠폰 코드가 자동 복사'],
  ['urgency-golden-vip-pass', 'Golden VIP Lifetime Access Metal Pass Card', '🥇 골든 VIP 평생 이용권 메탈 패스 카드', '금빛 반사광이 흐르는 VIP 한정판 카드 메타포의 고급스러운 전환 유도'],
  ['urgency-live-countdown-48h', 'Live 48-Hour Countdown Clock Urgent Banner', '⏰ 48시간 실시간 카운트다운 타이머 배너', '“01일 23시간 42분 18초 남음” 1초마다 줄어드는 긴박감 넘치는 배너'],
  ['urgency-limited-seats-progress', 'Limited 50 Spots Progress Bar (38 Claimed)', '⏳ 선착순 50명 한정 프로그레스 바 (38명 등록)', '정원 마감 게이지가 76%까지 차올라 조기 마감을 경고하는 레이아웃'],
  ['urgency-pulsing-flash-sale', 'Animated Red Pulsing Flash Sale Alert Badge', '🚨 빨간색 점멸 플래시 세일 알림 뱃지', '실시간 번개 세일 뱃지가 두근거리듯 펄스하며 시선을 집중시키는 구조'],
  ['urgency-mystery-gift-reveal', 'Click to Reveal Secret Bonus Package Card', '🎁 클릭하여 시크릿 보너스 패키지 열기 카드', '물음표 상자를 클릭하면 $200 상당의 추가 템플릿 번들이 팡 터지는 연출'],
  ['urgency-scratch-card-discount', 'Interactive Scratch-to-Reveal 40% Off Card', '🪙 동전으로 긁는 복권 스크래치 할인 카드', '마우스로 은색 표면을 긁어내면 숨겨진 40% 할인 코드가 나타나는 재미'],
  ['urgency-lucky-spin-wheel', 'Gamified Lucky Wheel Discount Selector', '🎡 게이미피케이션 룰렛 할인 추첨기', '돌려돌려 돌림판을 돌려 10%~50% 랜덤 할인을 즉석에서 뽑아 적용'],
  ['urgency-price-increase-warning', 'Notice of Price Increase Next Month Banner', '📈 다음 달 정가 인상 예고 공식 공지 배너', '“다음 분기부터 월 $79로 인상됩니다” 현 가격 동결을 위한 서두름 유도'],
  ['urgency-first-100-founders', 'First 100 Founding Members Exclusive Shield', '🛡️ 최초 100인 파운딩 멤버 영구 혜택 실드', '초기 멤버 100인에게만 주어지는 영구 프라이빗 채널 입장권 뱃지'],
  ['urgency-early-supporter-token', 'Numbered Early Supporter Digital Certificate', '📜 일련번호가 각인된 공식 얼리 서포터 인증서', '“SUPPORTER #084” 고유 번호가 찍힌 인증서 카드로 소장 가치 부여'],
  ['urgency-referral-sharing-incentive', 'Dual-Sided Referral Sharing Incentive Strip', '🤝 친구와 나 모두 3만 원 적립 추천 스트립', '초대 링크 1클릭 복사 버튼과 함께 양방향 보상을 약속하는 가로 바'],
  ['urgency-group-bulk-discount', 'Unlock 5+ Team Seat Bulk Discount Tier', '👥 5인 이상 단체 구매 추가 30% 할인 언락', '인원수가 채워질 때마다 자물쇠가 풀리며 할인이 커지는 그룹 바'],
  ['urgency-seasonal-promo-pill', 'Spring Promo Code Auto-Applied Pill Notification', '🌸 봄맞이 프로모션 코드 자동 적용 캡슐', '결제 페이지 이동 시 쿠폰 코드가 자동으로 쏙 들어가는 안심 알약 바'],
  ['urgency-holiday-gift-redeem', 'Holiday Special Gift Redemption Voucher', '🎄 연말연시 스페셜 기프트 바우처 카드', '선물 포장 리본 그래픽과 함께 소중한 팀원에게 라이선스를 선물하는 카드'],

  // Reassurance, FAQ & Ending (15)
  ['reassure-faq-accordion-cta', 'Split FAQ Accordion on Left + Sticky CTA Right', '❓ 좌측 FAQ 아코디언 + 우측 스티키 CTA', '가장 자주 묻는 5대 질문을 풀면서 우측에서 즉시 시작할 수 있는 최적 결합'],
  ['reassure-money-back-shield-big', '100% Risk-Free 30-Day Refund Assurance Shield', '🛡️ 100% 위험 제로 30일 환불 보증 실드', '아무런 조건 없이 30일 이내 환불해 준다는 큼직한 황금 도장 보증서'],
  ['reassure-support-team-online', 'Live Support Avatar Duo with “Online Now (2m)”', '🟢 실시간 상담원 아바타 & “현재 접속 중(응답 2분)”', '실제 고객 지원 팀원의 밝은 얼굴 사진과 초록색 접속 중 펄스 라이트'],
  ['reassure-no-contract-lockin', '“Cancel Anytime with 1-Click” Reassurance Pill', '🔓 “언제든 1클릭으로 위약금 없이 해지 가능”', '약정이나 위약금 없이 마이페이지에서 단 1클릭으로 해지됨을 공언'],
  ['reassure-founder-signature-letter', 'Founder Personal Letter & Hand-Drawn Signature', '✍️ 창업자의 친필 서명과 고객을 향한 편지', '서비스를 만든 이유와 품질에 대한 자부심이 담긴 창업자 서명 카드'],
  ['reassure-security-badge-cluster', 'SOC2, ISO, GDPR 4-Shield Compliance Cluster', '🔒 4대 국제 표준 보안 인증 마크 클러스터', '금융권 수준의 안전한 결제 시스템과 데이터 보호 체계를 재확인'],
  ['reassure-concierge-migration', 'Free Concierge Data Migration Service Included', '🚚 타사 데이터 무료 대행 이전(마이그레이션) 보장', '기존에 쓰던 복잡한 데이터를 전담 엔지니어가 무료로 다 옮겨줌을 약속'],
  ['reassure-community-discord-invite', 'Join 24,000 Active Creators Discord Community', '👾 24,000명 디스코드 커뮤니티 초대 배너', '구매 후 혼자가 아니라 수만 명의 동료들과 실시간 팁을 나눌 수 있는 방'],
  ['reassure-github-oauth-1click', 'Instant 1-Click GitHub / Google OAuth Button', '🐙 깃허브 / 구글 계정으로 1초 만에 로그인', '비밀번호 설정 없이 평소 쓰던 개발자 계정으로 즉시 시작하는 버튼'],
  ['reassure-qr-code-mobile-app', 'Scan QR Code to Download Companion Mobile App', '📲 QR 코드 스캔 모바일 컴패니언 앱 다운로드', '카메라로 QR을 비추면 바로 앱스토어로 연결되는 온보딩 카드'],
  ['reassure-chrome-extension-install', 'Chrome Web Store 5-Star Extension Badge', '🧩 크롬 웹스토어 5성급 공식 확장 프로그램 설치', '크롬 브라우저 상단에서 바로 쓰는 확장 도구 원클릭 추가 배너'],
  ['reassure-terminal-sdk-install', 'Copy Terminal Install Command with Live Check', '💻 터미널 설치 명령어 복사 & 복사 완료 피드백', '`npm install @core/cli -g` 복사 시 초록색 체크 마크로 전환'],
  ['reassure-live-chat-floating-summon', 'Floating Live Chat Consultation Summon Widget', '💬 우하단 실시간 1:1 채팅 상담 호출 위젯', '궁금한 점이 있을 때 즉시 물어볼 수 있는 플로팅 챗봇 트리거'],
  ['reassure-exit-intent-modal-bar', 'Exit-Intent Gentle Floating Discount Bar', '👋 이탈 방지 부드러운 플로팅 할인 바', '마우스가 창 밖으로 나갈 때 부드럽게 고개를 드는 특별 제안 바'],
  ['reassure-sticky-bottom-banner', 'Persistent Sticky Bottom Action Strip', '📌 화면 하단 항상 고정되는 슬림 액션 바', '스크롤을 아무리 내려도 항상 손닿는 거리에 머무는 미니멀 전환 바']
];

const allCtaSeeds = [...ctaSeeds, ...ctaUrgencyReassurance];
const ctaList = allCtaSeeds.map(s => item(
  `cta-${s[0]}`,
  'cta',
  s[1],
  s[2],
  s[0].startsWith('ambient') ? 'Liquid Glass' : s[0].startsWith('neo') ? 'Swiss & Neo-Brutalist' : s[0].startsWith('lead') ? 'GenUI & AI-Native' : s[0].startsWith('urgency') ? 'Bento Grid 2.0' : 'Minimalist Editorial',
  s[0].startsWith('lead') ? '1col-center' : s[0].startsWith('reassure-faq') ? 'split-60-40' : s[0].startsWith('floating') ? 'floating-dock' : '1col-center',
  s[0].startsWith('lead') ? 'interactive' : 'hybrid',
  s[0].startsWith('reassure-faq') ? 'compact' : 'balanced',
  s[3],
  s[0],
  ['원클릭 전환 최적화', '심리적 장벽 제거', '즉각적인 행동 유도'],
  ['CTA', 'Conversion', 'Ending']
));

console.log(`CTA total: ${ctaList.length}`);

// 6. NAVIGATION & MEGA FOOTER (60 items)
const navFooterSeeds = [
  // Navbars (30)
  ['nav-glass-capsule-island', 'VisionOS Floating Glass Capsule Island Nav', '🏝️ VisionOS 부유형 글래스 캡슐 아일랜드 GNB', '상단 화면에 둥둥 떠있는 반투명 유리 알약 바, 로고와 메뉴가 콤팩트하게 정렬'],
  ['nav-swiss-hairline-1line', 'Swiss 1-Line Strict Minimalist Text Nav', '📏 스위스 1-라인 엄격한 흑백 미니멀 GNB', '0.5px 가로선 하나로 구분된 정갈한 고딕 서체의 1열 텍스트 네비게이션'],
  ['nav-standard-left-center-right', 'Classic Left-Logo Center-Links Right-CTA Nav', '🏛️ 클래식 좌측 로고 + 중앙 링크 + 우측 CTA GNB', '웹 표준의 가장 익숙하고 실패 없는 3분할 클래식 네비게이션 바'],
  ['nav-mega-menu-dropdown', 'Enterprise Multi-Column Bento Mega Menu Nav', '🍱 엔터프라이즈 멀티 칼럼 벤토 메가 메뉴 GNB', '“제품” 호버 시 솔루션, 템플릿, 고객사 카드가 풍성하게 열리는 대형 메뉴'],
  ['nav-prompt-search-integrated', 'Integrated Natural Language Prompt Bar Nav', '🤖 자연어 프롬프트 검색창 일체형 GNB', 'GNB 중앙에 `Search or Ask AI... [⌘K]` 인풋 필드가 내장된 최신 트렌드'],
  ['nav-terminal-hud-latency', 'Terminal HUD Monospace Nav with Live Ping Indicator', '📟 터미널 HUD 모노스페이스 GNB (실시간 핑 12ms)', '초록색 핑 점멸 라이트, 서버 상태, 터미널 폰트로 무장한 개발자용 상단바'],
  ['nav-fullscreen-overlay-modal', 'Bold Fullscreen Overlay Hamburger Modal Nav', '🍔 전폭 풀스크린 햄버거 오버레이 메뉴 GNB', '메뉴 버튼 클릭 시 화면 전체가 칠흑같이 어두워지며 60pt 대형 링크가 등장'],
  ['nav-mobile-bottom-dock', 'Mobile Native Bottom Tab Bar Dock Nav', '📱 모바일 네이티브 하단 탭 바 독(Dock) 네비게이션', '스마트폰 엄지손가락 영역에 5개 주요 탭 아이콘이 상시 고정된 하단 독'],
  ['nav-vertical-collapsible-sidebar', 'Collapsible Left Vertical Sidebar Nav (Linear Style)', '📁 접이식 좌측 세로 사이드바 GNB (Linear 스타일)', '좌측에 세로로 길게 뻗은 사이드바, 아이콘 모드와 확장 모드를 토글 지원'],
  ['nav-split-center-logo', 'Split Nav with Centered Brand Monogram', '⚜️ 중앙 브랜드 모노그램 좌우 대칭 분할 GNB', '가운데 정렬된 럭셔리 심볼을 기준으로 좌측 3개, 우측 3개 링크가 완벽 대칭'],
  ['nav-minimalist-icon-dock', 'Ultra-Minimalist Icon-Only Floating Dock Nav', '🎛️ 울트라 미니멀 아이콘 전용 플로팅 독 GNB', '글자 없이 오직 정밀한 벡터 아이콘 4개만 떠있어 호버 시 툴팁을 제공'],
  ['nav-stacked-notification-banner', 'Stacked Announcement Notification Bar + Nav', '📢 상단 공지 배너 + 네비게이션 2단 스택 GNB', '“🎉 2.0 버전 대규모 릴리즈!” 알림 바가 상단에 착 달라붙은 2단 구조'],
  ['nav-breadcrumb-trail-topbar', 'Dynamic Breadcrumb Trail Integrated Topbar', '🍞 동적 브레드크럼(경로 추적) 일체형 상단바', '`Home / Products / AI Studio / Settings` 현재 위치가 명확히 보이는 바'],
  ['nav-ecommerce-cart-drawer', 'E-Commerce Sticky Nav with Slide-Out Cart', '🛍️ 슬라이드아웃 장바구니 일체형 이커머스 GNB', '우측 상단에 담긴 상품 개수 뱃지와 클릭 시 열리는 사이드 장바구니'],
  ['nav-developer-git-status', 'Developer Git Branch Selector Integrated Nav', '🌿 Git 브랜치(main/dev) 셀렉터 일체형 GNB', '현재 보고 있는 문서나 프로젝트의 브랜치를 즉시 스위칭할 수 있는 상단바'],
  ['nav-currency-language-globe', 'Global Multi-Language & Currency Selector Nav', '🌍 글로벌 다국어 & 통화 변환 드롭다운 GNB', '지구본 아이콘을 눌러 한국어, 영어, 일본어 및 통화를 1초 만에 변경'],
  ['nav-dynamic-scroll-shrink', 'Dynamic Scroll-Morphing Shrink & Blur Nav', '📜 스크롤 시 자동 축소 및 블러 강화 모핑 GNB', '페이지를 아래로 내리면 패딩이 줄어들며 얇은 유리바로 매끄럽게 변신'],
  ['nav-tabbed-category-header', 'Tabbed Category Horizon Header Nav', '📑 수평 탭 카테고리 일체형 헤더 GNB', '상단바 바로 아래에 주요 하위 카테고리 6개가 가로 탭으로 연결된 구성'],
  ['nav-transparent-hero-blend', 'Transparent Gradient Hero Seamless Blend Nav', '🌅 히어로 배경과 매끄럽게 녹아드는 투명 GNB', '경계선 없이 히어로 섹션의 화보나 그래픽 위로 자연스럽게 스며든 상단바'],
  ['nav-command-k-spotlight', 'Command-K Quick Palette Trigger Badge Nav', '⌨️ [⌘K] 퀵 검색 팔레트 호출 배지 GNB', '누르면 맥OS 스포트라이트처럼 화면 중앙에 검색창이 열리는 트리거 버튼'],
  ['nav-user-profile-avatar-pill', 'User Profile Avatar & Credit Balance Pill Nav', '👤 사용자 프로필 아바타 & 보유 크레딧 캡슐 GNB', '로그인 후 내 잔여 토큰(1,420 크레딧)과 프로필 썸네일이 보이는 앱형 상단바'],
  ['nav-brutalist-thick-border', 'Neo-Brutalist Thick 3px Black Border Nav', '🧱 네오 브루탈리스트 3px 볼드 블랙 보더 GNB', '선명한 3px 검은 실선과 비비드 컬러 버튼이 레트로한 감각을 뽐내는 바'],
  ['nav-luxury-lettermark-serif', 'Haute Couture Luxury Lettermark Serif Nav', '✨ 오트 쿠튀르 럭셔리 세리프 레터마크 GNB', '파리 패션 하우스처럼 우아한 세리프 로고와 넉넉한 글자 자간이 돋보이는 바'],
  ['nav-video-reel-peek-header', 'Micro Video Reel Peek on Menu Hover Nav', '🎞️ 메뉴 호버 시 마이크로 비디오 엿보기 GNB', '메뉴에 마우스를 올리면 작은 썸네일 영상이 재생되며 흥미를 유발'],
  ['nav-multi-brand-switcher', 'Parent Company Multi-Brand Switcher Nav', '🏢 모회사 산하 패밀리 브랜드 셀렉터 GNB', '상단 초미니 바에서 계열사 4개 서비스 간을 자유롭게 오가는 스위처'],
  ['nav-live-cluster-health-light', 'Live Cluster Health Pulse Indicator Nav', '🟢 실시간 클러스터 헬스 펄스 라이트 GNB', '우측 상단에 작은 녹색 불이 반짝이며 `All Systems Normal`을 알림'],
  ['nav-dark-light-mode-toggle', 'Tactile Sliding Sun/Moon Theme Toggle Nav', '🌓 슬라이딩 해/달 테마 스위치 내장 GNB', '해와 달 아이콘이 부드럽게 굴러가며 라이트/다크 모드를 바꾸는 스위치'],
  ['nav-quick-demo-launcher', 'Instant 60-Sec Demo Launcher Modal Nav', '🚀 즉석 60초 인터랙티브 데모 팝업 버튼 GNB', '상단바에서 바로 팝업창을 띄워 핵심 기능을 1분 만에 둘러보는 버튼'],
  ['nav-glassmorphism-frosted-deep', 'Deep 60px Frosted Glass Blur Sticky Nav', '❄️ 딥 60px 프로스티드 글래스 블러 스티키 GNB', '유리 뒤로 지나가는 본문 텍스트가 안개처럼 환상적으로 번지는 글래스 바'],
  ['nav-isometric-cube-logo', '3D Rotating Isometric Cube Logo Nav', '🧊 3D 회전 아이소메트릭 큐브 로고 GNB', '좌측 상단에서 3D 큐브 로고가 마우스 시선에 따라 각도를 바꾸는 인터랙티브'],

  // Mega Footers (30)
  ['footer-classic-4col-sitemap', 'Classic 4-Column Enterprise Categorized Sitemap', '🏛️ 클래식 4단 엔터프라이즈 카테고리 사이트맵', '제품, 솔루션, 회사, 법적 고지가 4개의 단정한 열로 깔끔히 정렬된 정통 푸터'],
  ['footer-newsletter-signup-split', '5-Column Mega Footer with Live Newsletter Box', '📬 5단 메가 푸터 & 뉴스레터 구독 박스 일체형', '좌측에 최신 테크 리포트 구독 인풋, 우측에 4단 링크가 펼쳐진 종합 푸터'],
  ['footer-giant-brand-lettermark', 'Monumental Brand Lettermark Brutalist Footer', '📰 모뉴멘탈 자이언트 브랜드 레터마크 푸터', '화면 가로폭 전체를 꽉 채우는 120pt 초대형 로고 타이포가 압도하는 엔딩'],
  ['footer-minimal-1line-strip', 'Ultra-Minimalist 1-Line Copyright & Social Strip', '📏 울트라 미니멀 1-라인 저작권 & 소셜 스트립', '여백을 아끼고 단 한 줄의 깔끔한 가로선 위에 카피라이트와 SNS 링크만 배치'],
  ['footer-terminal-cli-command', 'Terminal Monospace Command-Line Footer', '💻 터미널 모노스페이스 커맨드라인 푸터', '`$ core --version 2.6.0` 텔레메트리 정보와 깃허브 커밋 해시가 각인된 푸터'],
  ['footer-bento-grid-widgets', 'Bento Grid Modular Footer with Status & Links', '🍱 벤토 그리드 모듈러 푸터 (서버 상태 + 소셜)', '각기 다른 사각 카드 안에 상태판, 뉴스레터, 링크, 어워드가 정돈된 벤토'],
  ['footer-global-office-locations', 'Multi-Region Global Office Cards (SF/Seoul/London)', '🗺️ 글로벌 지사 카드 푸터 (샌프란시스코/서울/런던)', '세계 3대 거점 지사의 현지 시각, 사무실 주소, 연락처가 담긴 글로벌 푸터'],
  ['footer-infinite-social-marquee', 'Infinite Rolling Social Icon & Tag Marquee Footer', '🌊 무한 롤링 소셜 아이콘 & 해시태그 마퀴 푸터', '디스코드, X, 깃허브, 유튜브 아이콘이 가로로 끝없이 흘러가는 역동적 푸터'],
  ['footer-statuspage-live-embed', 'Embedded Live StatusPage 90-Day History Footer', '🟢 90일 무중단 가동 이력 위젯 내장 푸터', '푸터 하단에 최근 90일간의 서버 가동률 막대가 실시간 임베드된 신뢰 푸터'],
  ['footer-legal-regulatory-accordion', 'Collapsible Legal & Regulatory Compliance Accordion', '📜 접이식 법적 고지 & 규제 준수 아코디언 푸터', '이용약관, 개인정보처리방침, 사업자정보를 깔끔하게 접었다 펴는 구조'],
  ['footer-oled-luxury-dark', 'OLED Deep Black Luxury High-Fashion Footer', '🌌 OLED 딥블랙 럭셔리 하이패션 푸터', '칠흑 같은 블랙 배경 위에 0.5px 미세 은색 헤어라인과 얇은 세리프 링크'],
  ['footer-back-to-top-floating', 'Back-to-Top Rocket Button Integrated Footer', '🚀 맨 위로 가기 로켓 버튼 일체형 푸터', '클릭 시 스크롤이 부드럽게 최상단으로 솟구쳐 올라가는 인터랙션 버튼 탑재'],
  ['footer-app-store-badges-dual', 'App Store & Google Play Official Download Badges', '📲 앱스토어 & 구글플레이 공식 다운로드 배지 푸터', '스마트폰 앱을 손쉽게 내려받을 수 있는 공식 앱 마켓 블랙 배지 진열'],
  ['footer-timezone-clock-matrix', 'Realtime World Timezone Clocks (KST/PST/UTC)', '⏱️ 실시간 세계 주요 도시 시계 매트릭스 푸터', '서울, 런던, 뉴욕의 현재 시각이 초 단위로 째깍거리는 인터내셔널 감성'],
  ['footer-brand-mascot-illustration', 'Charming 3D Brand Mascot Character Farewell', '👋 친근한 3D 브랜드 마스코트 작별 인사 푸터', '귀여운 3D 캐릭터가 손을 흔들며 다음 방문을 기약하는 따뜻한 무드'],
  ['footer-swiss-broadside-columns', 'Swiss Strict Broadside 6-Column Grid Footer', '📐 스위스 엄격한 브로드시트 6단 그리드 푸터', '스위스 양식의 엄격한 6분할 그리드선 위에 일목요연하게 정리된 방대한 링크'],
  ['footer-investor-relations-esg', 'Investor Relations & ESG Sustainability Links', '📊 투자자 정보(IR) & ESG 지속가능경영 푸터', '투자사 공시 보고서, 주주 서한, 친환경 지속가능성 리포트 전용 링크 열'],
  ['footer-customer-support-cards', 'Quick Customer Support Helpline Cards Footer', '🎧 고객센터 핫라인 & 1:1 상담 접수 카드 푸터', '운영 시간, 카카오톡 상담, 이메일 문의 채널을 큼직한 3개 카드로 강조'],
  ['footer-community-discord-showcase', 'Community Hub Showcase with Member Count Badge', '👾 커뮤니티 허브 푸터 (디스코드 2만 명 참여 배지)', '열정적인 사용자 커뮤니티로 연결되는 전용 초대장 배너가 포함된 엔딩'],
  ['footer-security-certification-strip', 'Full Security Certification Official Shield Bar', '🛡️ 보안 인증 마크(ISO/SOC2) 공식 실드 바 푸터', '국제 정보보호 인증 로고 6종이 금속 질감 배지로 단정하게 진열된 하단 바'],
  ['footer-career-hiring-banner', '“We Are Hiring! Join Our Team” Pulse Banner', '💼 “우리는 채용 중입니다! 12개 직군 오픈” 배너', '초록색 인재 영입 펄스 배지와 함께 채용 공고 페이지로 유도하는 배너'],
  ['footer-product-changelog-teaser', 'Latest Changelog v2.6 Release Notes Teaser', '📦 최신 릴리즈 v2.6 변경점 티저 위젯 푸터', '“신규 기능 4종 추가, 속도 20% 개선” 최신 패치노트 한 줄 티저'],
  ['footer-api-docs-rss-feed', 'Developer RSS Feed & API Documentation Quickbar', '📡 개발자 RSS 피드 & API 도큐먼트 퀵바 푸터', '엔지니어들이 즐겨찾는 기술 블로그 RSS 및 API 참조 링크 모음'],
  ['footer-ambient-aurora-glow', 'Subtle Ambient Aurora Glow Behind Footer Canvas', '🌌 푸터 캔버스 뒷배경 은은한 오로라 글로우', '웹사이트의 가장 마지막 바닥에서 은은하게 피어오르는 보라색 앰비언트 빛'],
  ['footer-trademark-open-source', 'Open Source MIT License & Attribution Block', '⚖️ 오픈소스 MIT 라이선스 & 오픈소스 기여 표기', '누구나 자유롭게 기여할 수 있는 오픈소스 정신을 명시한 라이선스 블록'],
  ['footer-multi-language-flag-picker', 'Country Flag Multi-Language Selector Dropdown', '🚩 국기 아이콘 다국어 셀렉터 드롭다운 푸터', '전 세계 16개국 국기 아이콘과 함께 로컬라이제이션을 지원하는 선택기'],
  ['footer-micro-site-quicktabs', 'Ecosystem Micro-Sites Quick Tab Switcher', '🌐 패밀리 마이크로사이트 퀵 탭 스위처 푸터', '블로그, 문서, 포럼, 쇼케이스 등 4개 서브 도메인을 1클릭 전환'],
  ['footer-mobile-accordion-stack', 'Mobile-Optimized Seamless Accordion Footer', '📱 모바일 최적화 원터치 아코디언 폴딩 푸터', '모바일 화면에서 수직 길이가 늘어지지 않도록 깔끔하게 접히는 아코디언'],
  ['footer-minimal-centered-credits', 'Artistic Museum Catalog Centered Credits Footer', '🏛️ 미술관 도록풍 중앙 정렬 크레딧 푸터', '기획자, 디자이너, 개발자의 이름이 영화 엔딩 크레딧처럼 우아하게 흐름'],
  ['footer-dynamic-quote-generator', 'Daily Inspiring Design Philosophy Quote Footer', '💬 오늘의 디자인 영감 명언 한 줄 생성 푸터', '페이지를 새로고침할 때마다 세계적 거장 디자이너들의 명언이 랜덤 출력']
];

const navFooterList = navFooterSeeds.map(s => item(
  `nav_footer-${s[0]}`,
  'nav_footer',
  s[1],
  s[2],
  s[0].startsWith('nav-glass') || s[0].startsWith('footer-oled') ? 'Liquid Glass' : s[0].startsWith('nav-swiss') || s[0].startsWith('footer-swiss') ? 'Swiss & Neo-Brutalist' : s[0].startsWith('nav-terminal') || s[0].startsWith('footer-terminal') ? 'Linear HUD' : 'Minimalist Editorial',
  s[0].startsWith('nav-mobile') ? 'floating-dock' : s[0].startsWith('footer-bento') ? 'bento-12col' : s[0].startsWith('footer-classic') ? 'bento-3col' : '1col-center',
  s[0].startsWith('nav-prompt') ? 'interactive' : 'hybrid',
  s[0].startsWith('footer-classic') || s[0].startsWith('nav-mega') ? 'compact' : 'balanced',
  s[3],
  s[0],
  ['글로벌 디자인 트렌드', '완벽한 정보 아키텍처', '반응형 모바일 지원'],
  ['Navigation', 'Footer', 'Information-Architecture']
));

console.log(`Nav/Footer total: ${navFooterList.length}`);

// Combine all 6 parts
const ALL_LAYOUT_REFERENCES = [
  ...heroList,
  ...featureList,
  ...proofList,
  ...pricingList,
  ...ctaList,
  ...navFooterList
];

console.log(`GRAND TOTAL: ${ALL_LAYOUT_REFERENCES.length} Layout References!`);

// Write out to src/data/layout-references.ts
const tsContent = `// =========================================================================
// 🚀 368+ Comprehensive Design Layout References Architecture (2025~2026)
// =========================================================================
// 각 파트별 60개 이상의 구조적, 배치적, 그리드적 차별화를 지닌 글로벌 레퍼런스 모음집
// Figma Community, Mobbin, Godly, Awwwards 트렌드를 정밀 반영

export type ReferencePartKey = 'hero' | 'feature' | 'proof' | 'pricing' | 'cta' | 'nav_footer';

export type TrendCategory = 
  | 'Bento Grid 2.0'
  | 'GenUI & AI-Native'
  | 'Liquid Glass'
  | 'Swiss & Neo-Brutalist'
  | 'Linear HUD'
  | 'Spatial 3D & Clay'
  | 'Asymmetric Split'
  | 'Minimalist Editorial';

export type GridGeometry = 
  | '1col-center'
  | 'split-50-50'
  | 'split-60-40'
  | 'split-70-30'
  | 'bento-12col'
  | 'bento-3col'
  | 'bento-asymmetric'
  | 'masonry-3col'
  | 'masonry-4col'
  | 'fullbleed-cinematic'
  | 'diagonal-angle'
  | 'stacked-zindex'
  | 'interactive-tabs'
  | 'accordion-vertical'
  | 'timeline-vertical'
  | 'carousel-filmstrip'
  | 'terminal-window'
  | 'comparison-slider'
  | 'marquee-ticker'
  | 'floating-dock';

export interface LayoutReference {
  id: string;
  part: ReferencePartKey;
  name: string;
  koreanName: string;
  trend: TrendCategory;
  gridGeometry: GridGeometry;
  focalAnchor: 'visual' | 'typo' | 'data' | 'hybrid' | 'interactive';
  density: 'airy' | 'balanced' | 'compact' | 'ultra-dense';
  description: string;
  wireframeShape: string;
  keyFeatures: string[];
  tags: string[];
  promptDirectives: {
    figma: string;
    tailwind: string;
    aiImage: string;
  };
  customOptions?: {
    showBadge?: boolean;
    showSecondaryCta?: boolean;
    showLiveStatus?: boolean;
    showHotspots?: boolean;
    showGridLines?: boolean;
    showMarquee?: boolean;
    showSparkline?: boolean;
    splitRatio?: '50:50' | '60:40' | '70:30' | 'reversed';
  };
}

export const PART_METADATA: Record<ReferencePartKey, { label: string; count: number; icon: string; description: string }> = {
  hero: { label: '히어로 쇼케이스', count: ${heroList.length}, icon: 'Sparkles', description: '첫 3초 시선을 사로잡는 최상단 쇼케이스 및 핵심 제안' },
  feature: { label: '기능 & 벤토 그리드', count: ${featureList.length}, icon: 'LayoutGrid', description: '프로덕트 기능과 아키텍처를 증명하는 벤토 및 인터랙티브 모듈' },
  proof: { label: '소셜 프루프 & 지표', count: ${proofList.length}, icon: 'Award', description: '신뢰도를 입증하는 실시간 KPI, 고객 리뷰, 보안 인증서' },
  pricing: { label: '가격표 & 비교 매트릭스', count: ${pricingList.length}, icon: 'CreditCard', description: '전환을 완성하는 3단 티어, 피처 비교표, 실시간 계산기' },
  cta: { label: '전환 유도 & CTA 배너', count: ${ctaList.length}, icon: 'Zap', description: '이탈을 방지하고 즉각적인 실행을 유도하는 리드 폼과 배너' },
  nav_footer: { label: 'GNB & 메가 푸터', count: ${navFooterList.length}, icon: 'Compass', description: '페이지 상하단의 완성도를 책임지는 네비게이션 및 사이트맵' },
};

export const ALL_LAYOUT_REFERENCES: LayoutReference[] = ${JSON.stringify(ALL_LAYOUT_REFERENCES, null, 2)};

export const HERO_LAYOUTS = ALL_LAYOUT_REFERENCES.filter(r => r.part === 'hero');
export const FEATURE_LAYOUTS = ALL_LAYOUT_REFERENCES.filter(r => r.part === 'feature');
export const PROOF_LAYOUTS = ALL_LAYOUT_REFERENCES.filter(r => r.part === 'proof');
export const PRICING_LAYOUTS = ALL_LAYOUT_REFERENCES.filter(r => r.part === 'pricing');
export const CTA_LAYOUTS = ALL_LAYOUT_REFERENCES.filter(r => r.part === 'cta');
export const NAV_FOOTER_LAYOUTS = ALL_LAYOUT_REFERENCES.filter(r => r.part === 'nav_footer');

export function getLayoutsByPart(part: ReferencePartKey): LayoutReference[] {
  return ALL_LAYOUT_REFERENCES.filter(r => r.part === part);
}

export function getLayoutById(id: string): LayoutReference | undefined {
  return ALL_LAYOUT_REFERENCES.find(r => r.id === id);
}
`;

fs.writeFileSync(path.resolve('src/data/layout-references.ts'), tsContent, 'utf-8');
console.log('Successfully wrote src/data/layout-references.ts!');
