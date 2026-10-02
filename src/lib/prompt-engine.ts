import { DesignDomain, SubPurposeOption, TailoredMoodOption } from '@/data/domains';
import { VisualStyleOption, ColorThemeOption, DesignElementOption, ButtonStyleOption, TypographyOption, getMatchingButtonStyle } from '@/data/design-options';
import { DomainComponentOption } from '@/data/component-presets';
import type { StudioDocument, StudioNode } from '@/studio/types';

export type TargetAI = 'chatgpt_claude' | 'v0_code' | 'gamma_slide' | 'midjourney';

export interface SelectedComponents {
  nav?: DomainComponentOption;
  mainDeck?: DomainComponentOption;
  metric?: DomainComponentOption;
  footer?: DomainComponentOption;
}

export interface PromptResult {
  title: string;
  targetAI: TargetAI;
  promptText: string;
  charCount: number;
  wordCount: number;
}

function flattenBlueprintNodes(node: StudioNode): StudioNode[] {
  return [node, ...node.children.flatMap(flattenBlueprintNodes)];
}

function createBlueprintPayload(blueprint?: StudioDocument): string {
  if (!blueprint) return '';
  const page = blueprint.pages.find((item) => item.id === blueprint.activePageId) ?? blueprint.pages[0];
  if (!page) return '';

  const nodes = flattenBlueprintNodes(page.root)
    .filter((node) => node.kind !== 'page')
    .map((node, order) => ({
      order: order + 1,
      id: node.id,
      kind: node.kind,
      componentId: node.componentId,
      name: node.koreanName ?? node.name,
      category: node.category,
      variant: node.variant,
      promptDirective: node.promptDirective,
      props: node.props,
      layout: node.layout,
      responsive: node.responsive,
      hidden: node.hidden ?? false,
      locked: node.locked ?? false,
    }));

  return JSON.stringify({
    schemaVersion: blueprint.version,
    page: {
      id: page.id,
      name: page.name,
      slug: page.slug,
      layoutPreset: page.layoutPreset,
    },
    content: blueprint.content,
    themeSelection: blueprint.theme,
    generationPolicy: blueprint.generation,
    nodes,
  }, null, 2);
}

export function generateDesignPrompt(
  domain: DesignDomain,
  style: VisualStyleOption,
  colorTheme: ColorThemeOption,
  activeElements: DesignElementOption[],
  targetAI: TargetAI,
  components?: SelectedComponents,
  subPurpose?: SubPurposeOption,
  tailoredMood?: TailoredMoodOption,
  buttonStyle?: ButtonStyleOption,
  typography?: TypographyOption,
  layoutPreset?: string,
  blueprint?: StudioDocument,
): PromptResult {
  if (targetAI === 'v0_code') {
    return generateV0CodePrompt(domain, style, colorTheme, activeElements, components, subPurpose, tailoredMood, typography, layoutPreset, blueprint);
  } else if (targetAI === 'gamma_slide') {
    return generateGammaSlidePrompt(domain, style, colorTheme, activeElements, components, subPurpose, tailoredMood, typography);
  } else if (targetAI === 'midjourney') {
    return generateMidjourneyPrompt(domain, style, colorTheme, activeElements, components, subPurpose, tailoredMood);
  } else {
    return generateDefaultXmlPrompt(domain, style, colorTheme, activeElements, components, subPurpose, tailoredMood, buttonStyle, typography, layoutPreset, blueprint);
  }
}

/**
 * 1. 산업 표준 XML Delimiter + 디자인 시스템 & 컴포넌트 청사진 프롬프트 (ChatGPT / Claude용)
 */
function generateDefaultXmlPrompt(
  domain: DesignDomain,
  style: VisualStyleOption,
  colorTheme: ColorThemeOption,
  activeElements: DesignElementOption[],
  components?: SelectedComponents,
  subPurpose?: SubPurposeOption,
  tailoredMood?: TailoredMoodOption,
  buttonStyle?: ButtonStyleOption,
  typography?: TypographyOption,
  layoutPreset?: string,
  blueprint?: StudioDocument,
): PromptResult {
  const elementsDirectives = activeElements.map((el, i) => `  ${i + 1}. [${el.koreanName}]: ${el.promptDirective}`).join('\n');
  const harmonyInfo = colorTheme.harmonyMode ? `\n- Color Harmony Theory: ${colorTheme.harmonyMode}` : '';
  const effectiveBtn = buttonStyle || getMatchingButtonStyle(style.id);
  const buttonSection = effectiveBtn ? `
<button_design_system>
- Button Style Model: ${effectiveBtn.koreanName} (${effectiveBtn.name})
- Border Radius: ${effectiveBtn.borderRadius}
- Border Width: ${effectiveBtn.borderWidth}
- Shadow: ${effectiveBtn.shadowType}
- Directives: ${effectiveBtn.promptDirective}
</button_design_system>` : '';

  const typographySection = typography ? `
<typography_system>
- Typography Style: ${typography.koreanName} (${typography.name})
- Font Category: ${typography.category}
- Font Family Stack: ${typography.fontFamily}
- Headline Display Font: ${typography.headlineFont}
- Body Text Font: ${typography.bodyFont}
- Directives: ${typography.promptDirective}
</typography_system>` : '';

  const layoutSection = layoutPreset ? `
<layout_architecture>
- Layout Model: ${layoutPreset === 'sidebar_main' ? 'SaaS Left Sidebar + Main Content Grid' : layoutPreset === 'holy_grail' ? '3-Column Holy Grail (Sidebar + Center Feed + Right Aside)' : layoutPreset === 'bento_grid' ? 'Modular 12-Column Bento Grid' : 'Single Column Vertical Stack'}
- Architecture Directives: ${layoutPreset === 'sidebar_main' ? 'Structure with left sidebar and responsive 12-column main body.' : layoutPreset === 'holy_grail' ? 'Structure with left navigation (240px), center feed, and right inspector panel (280px).' : layoutPreset === 'bento_grid' ? 'Structure with responsive 12-column bento widgets with asymmetric spans.' : 'Structure with classic landing flow.'}
</layout_architecture>` : '';
  const blueprintPayload = createBlueprintPayload(blueprint);
  const blueprintSection = blueprintPayload ? `
<ui_blueprint source_of_truth="true">
아래 JSON은 현재 스튜디오에서 사용자가 직접 조립한 화면의 유일한 구조 원본입니다. 노드 순서, 슬롯, 컬럼 너비, 반응형 규칙, 잠금 필드를 임의로 누락하거나 재배치하지 마세요.
${blueprintPayload}
</ui_blueprint>` : '';

  const compList: string[] = [];
  if (components?.nav) {
    compList.push(`1. Primary Header/Nav: ${components.nav.koreanName} (${components.nav.name})\n   - Directive: ${components.nav.promptDirective}`);
  }
  if (components?.mainDeck) {
    compList.push(`2. Main Showcase/Hero: ${components.mainDeck.koreanName} (${components.mainDeck.name})\n   - Directive: ${components.mainDeck.promptDirective}`);
    if (components.mainDeck.visualKeywords) {
      compList.push(`   - Visual Atmosphere: ${components.mainDeck.visualKeywords}`);
    }
  }
  if (components?.metric) {
    compList.push(`3. Body/Data Metrics: ${components.metric.koreanName} (${components.metric.name})\n   - Directive: ${components.metric.promptDirective}`);
  }
  if (components?.footer) {
    compList.push(`4. Conversion/Footer: ${components.footer.koreanName} (${components.footer.name})\n   - Directive: ${components.footer.promptDirective}`);
  }

  const componentsSection = !blueprint && compList.length > 0 ? `
<selected_component_blueprint>
${compList.join('\n\n')}
</selected_component_blueprint>` : '';

  const text = `<design_system_brief version="8.0">
<role>
당신은 세계 최고 수준의 수석 비주얼 아키텍트이자 크리에이티브 디렉터입니다.
사용자가 제공할 원고/자료 내용을 바탕으로, 아래에 정의된 <visual_style_dna>, <color_tokens>, <selected_component_blueprint>를 100% 엄격하게 준수하여 시각적 완성도와 차별화가 극대화된 디자인 결과물과 레이아웃 명세를 생성하세요.
</role>

<context>
- Target Format: ${domain.koreanName} (${domain.canvasAspect})
${subPurpose ? `- Target Objective/Purpose: ${subPurpose.title} [${subPurpose.badge}] - ${subPurpose.desc}\n` : ''}${tailoredMood ? `- Tailored Visual Mood: ${tailoredMood.title} [${tailoredMood.badge}]\n  * Mood Concept: ${tailoredMood.desc}\n  * Mood Directives: ${tailoredMood.aiDirective}\n` : ''}- Selected Visual Style: ${style.koreanName} (${style.name})
- Selected Color Theme: ${colorTheme.koreanName} (${colorTheme.name})${harmonyInfo}
- Mood & Tone: ${colorTheme.mood}
</context>${layoutSection}

<visual_style_dna (Strictly Enforce Distinct Identity)>
- Style Model: ${style.name} (${style.category})
- Corner Radius: ${style.defaultBorderRadius}
- Shadow Technique: ${style.shadowType}
- AI Design Directives: ${style.aiKeywords}
- Style Specific Rules:
${getStyleSpecificRules(style.id)}
</visual_style_dna>
${buttonSection}
${typographySection}

<color_tokens (Adobe Color Theory & WCAG 7:1)>
- Background Canvas: ${colorTheme.tokens.bg}
- Container / Card Surface: ${colorTheme.tokens.cardBg}
- Surface Border: 1px solid ${colorTheme.tokens.cardBorder}
- Primary Accent: ${colorTheme.tokens.accent}
- Secondary Accent: ${colorTheme.tokens.accentSecondary}
- Primary Text (High-contrast): ${colorTheme.tokens.textPrimary} (WCAG 7:1 AAA Compliance)
- Secondary Text: ${colorTheme.tokens.textSecondary}
- Badge Component: BG ${colorTheme.tokens.badgeBg} / Text ${colorTheme.tokens.badgeText}
</color_tokens>
${componentsSection}${blueprintSection}

<active_design_elements>
${elementsDirectives}
</active_design_elements>

<autonomous_layout_reasoning>
사용자가 전달하는 내용의 성격과 데이터 형태를 스스로 판단하여, 화면의 위계를 다음과 같은 최적의 컴포넌트 구조로 자율 오케스트레이션하세요:
1. [지표 및 데이터 수치 감지 시]
   -> 텍스트 줄글로 쓰지 말고, 3~4열의 대등한 라운드 카드에 48pt 대형 하이라이트 볼드 숫자와 전년비 증감 뱃지(+Green), 미니 스파크라인 트렌드 막대로 자동 승화하여 배치할 것.
${domain.id === 'ppt' ? `2. [피치덱 발표 자료 & 통계/재무 시각화 필수 지침]
   * 분기별 매출/ARR 성장: Q1~Q4 막대그래프와 상향 추세선(Trendline), YoY +240% 성장 뱃지가 결합된 '분기별 매출 성장 막대 차트'를 반드시 시각화할 것.
   * 시장 규모: TAM-SAM-SOM 3단계 동심원 시장 다이어그램(12조 -> 2.4조 -> 3,500억) 및 고객 세그먼트 도넛 차트(엔터프라이즈 45%)로 구조화할 것.
   * 고객 획득 퍼널: 방문(100%) -> 무료 체험(33.6%) -> 유료 전환(14.8%) -> 1년 리텐션(92.4%) 단계형 사다리꼴 깔때기 퍼널(Funnel)로 시각화할 것.
   * 단위 경제성: LTV/CAC 5.8x 원형 게이지 바 및 회수기간(3.2개월) 진행률 미터로 구성할 것.
   * 경쟁사 비교: X축(비용/접근성) vs Y축(기술 완성도) 2x2 사분면 축 매트릭스와 우상단 마켓 리더 영역 자사 단독 스포트라이트 버블로 배치할 것.
` : ''}3. [시간, 일정, 단계, 로드맵 감지 시]
   -> 수평 연결선과 번호 노드(Step 01~04)로 이어지는 타임라인 프로세스 바로 자동 승화하여 배치할 것.
4. [문제점 vs 해결책, 비포 vs 애프터 대조 감지 시]
   -> 좌(Problem 경고 톤) vs 우(Solution 프라이머리 톤)의 5:5 대칭 대비 카드로 자동 승화할 것.
5. [특장점 및 주요 기능 나열 시]
   -> 아이콘 컨테이너와 굵은 소제목, 2줄 이내 요약문이 포함된 피처 카드 그리드나 비대칭 벤토 그리드로 자동 승화할 것.
6. [화면 상단 및 하단]
   -> 상단에는 내용의 본질을 꿰뚫는 한 줄의 임팩트 있는 메인 헤드라인을 세우고, 하단에는 핵심 시사점을 담은 굵은 보더 콜아웃 바를 배치할 것.
</autonomous_layout_reasoning>

<anti_patterns>
${style.antiPatterns.map(ap => `- ❌ ${ap}`).join('\n')}
- ❌ 제공된 내용을 지루한 줄글이나 단순 불릿 기호로 나열하지 말 것.
- ❌ 지정된 컬러 팔레트(${colorTheme.tokens.accent}, ${colorTheme.tokens.bg}) 외에 무분별한 잡색을 섞지 말 것.
- ❌ 여백 없이 화면을 빽빽하게 채우지 말 것 (전체 공간의 35~40% 여백 유지).
</anti_patterns>

<user_content_placeholder>
[아래에 디자인을 입힐 당신의 원고/내용/자료를 입력하세요]:
"""
(여기에 준비하신 발표 자료, 보고서 내용, 기획안, 텍스트를 붙여넣으세요)
"""
</user_content_placeholder>
</design_system_brief>`;

  return {
    title: 'ChatGPT & Claude 전용 (디자인 시스템 & 컴포넌트 청사진)',
    targetAI: 'chatgpt_claude',
    promptText: text,
    charCount: text.length,
    wordCount: text.split(/\s+/).length,
  };
}

/**
 * 2. v0 / Bolt / Cursor 전용 코드 생성 프롬프트
 */
function generateV0CodePrompt(
  domain: DesignDomain,
  style: VisualStyleOption,
  colorTheme: ColorThemeOption,
  activeElements: DesignElementOption[],
  components?: SelectedComponents,
  subPurpose?: SubPurposeOption,
  tailoredMood?: TailoredMoodOption,
  typography?: TypographyOption,
  layoutPreset?: string,
  blueprint?: StudioDocument,
): PromptResult {
  const elementsDirectives = activeElements.map(el => `- ${el.name}: ${el.promptDirective}`).join('\n');
  const compList = components && !blueprint ? `
## REQUIRED COMPONENT ARCHITECTURE:
- Navigation: ${components.nav?.koreanName || 'Standard'} (${components.nav?.promptDirective || 'Standard'})
- Main Showcase: ${components.mainDeck?.koreanName || 'Standard'} (${components.mainDeck?.promptDirective || 'Standard'})
- Data & Metrics: ${components.metric?.koreanName || 'Standard'} (${components.metric?.promptDirective || 'Standard'})
- Footer Takeaway: ${components.footer?.koreanName || 'Standard'} (${components.footer?.promptDirective || 'Standard'})` : '';

  const layoutInfo = layoutPreset ? `
## LAYOUT ARCHITECTURE (${layoutPreset.toUpperCase()}):
- Selected Layout Mode: ${layoutPreset}
- Requirement: ${layoutPreset === 'sidebar_main' ? 'Construct a flex-col md:flex-row app shell with a fixed/collapsible left sidebar (<aside className="w-64 border-r border-slate-800 p-4">) and a main content area (<main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 p-6">).' : layoutPreset === 'holy_grail' ? 'Construct a 3-column Holy Grail layout with Left Sidebar (w-60), Center Main (flex-1), and Right Inspector (w-72).' : layoutPreset === 'bento_grid' ? 'Construct a 12-column Bento Grid workspace with asymmetric card spans.' : 'Construct a responsive single-column landing page with Header, Hero, Body, and Footer.'}` : '';
  const blueprintPayload = createBlueprintPayload(blueprint);
  const blueprintInfo = blueprintPayload ? `
## UI BLUEPRINT — AUTHORITATIVE SOURCE OF TRUTH
Implement every visible node below in the declared order and slot. Preserve locked layout/theme fields. Do not replace concrete nodes with generic placeholder cards.

\`\`\`json
${blueprintPayload}
\`\`\`` : '';

  const purposeInfo = subPurpose ? `\n## TARGET PURPOSE & GOAL:\n- Goal: ${subPurpose.title} (${subPurpose.badge})\n- Description: ${subPurpose.desc}\n` : '';
  const moodInfo = tailoredMood ? `\n## TAILORED VISUAL MOOD:\n- Style Archetype: ${tailoredMood.title} [${tailoredMood.badge}]\n- Concept: ${tailoredMood.desc}\n- AI Directives: ${tailoredMood.aiDirective}\n` : '';
  const typoInfo = typography ? `
## TYPOGRAPHY & FONT DIRECTIVES:
- Font Family: ${typography.fontFamily}
- Headline Display Font: ${typography.headlineFont}
- Body Text Font: ${typography.bodyFont}
- Typography Rules: ${typography.promptDirective}` : '';

  const text = `Create a pixel-perfect, responsive React component for a "${domain.koreanName}" layout (${domain.canvasAspect}) using Tailwind CSS v4 and Lucide React icons.
${purposeInfo}${moodInfo}${layoutInfo}${blueprintInfo}
## STRICT DESIGN SYSTEM SPECIFICATIONS:
- Aesthetic Style: ${style.name} (${style.koreanName})
- Border Radius: ${style.defaultBorderRadius}
- Shadow Style: ${style.shadowType}
- Specific Style Directives:
${getStyleSpecificRules(style.id)}${typoInfo}

## TAILWIND COLOR TOKENS:
- Canvas Background: \`${colorTheme.tokens.bg}\`
- Card/Container Surface: \`${colorTheme.tokens.cardBg}\`
- Border: 1px solid \`${colorTheme.tokens.cardBorder}\`
- Primary Accent: \`${colorTheme.tokens.accent}\`
- Secondary Accent: \`${colorTheme.tokens.accentSecondary}\`
- Primary Text: \`${colorTheme.tokens.textPrimary}\`
- Secondary Text: \`${colorTheme.tokens.textSecondary}\`
${compList}

## VISUAL ELEMENTS TO INCLUDE:
${elementsDirectives}

## AUTONOMOUS LAYOUT INSTRUCTIONS:
- Analyze the user content below. If it contains statistics or numbers, build bold KPI highlight cards with delta badges (+38%).
${domain.id === 'ppt' ? `- FOR PRESENTATION & PITCH DECKS: Always generate actual interactive/vector SVG charts instead of plain bullet points!
  * Quarterly Revenue Bar Chart: Render 4 vertical bars (Q1~Q4) with gradient fills and an overlaid smooth SVG trendline with YoY +240% badge.
  * TAM-SAM-SOM Market Sizing: Render concentric rings with labeled values ($12B -> $2.4B -> $350M) and customer segment donut chart.
  * Conversion Funnel: Render 4 descending trapeze tiers (Traffic 125k -> Trial 42k -> Paid 18.5k -> Retained 92.4%) with drop-off percentages.
  * Unit Economics: Render LTV:CAC 5.8x circular semi-gauge and horizontal 3.2-month CAC payback progress bar.
  * 2x2 Competitive Quadrant: Render coordinate axes with company highlighted in the upper right leader zone.
` : ''}- If it has milestones or months, render a sleek horizontal timeline with step nodes.
- If it has comparisons, build a side-by-side 50:50 comparison container.
- Always include an impactful hero headline and a strategic callout footer.

## USER CONTENT:
(Insert your presentation/copy content here)`;

  return {
    title: 'v0 / Bolt / Cursor 전용 (React & Tailwind v4)',
    targetAI: 'v0_code',
    promptText: text,
    charCount: text.length,
    wordCount: text.split(/\s+/).length,
  };
}

/**
 * 3. Gamma 전용 슬라이드 생성 프롬프트
 */
function generateGammaSlidePrompt(
  domain: DesignDomain,
  style: VisualStyleOption,
  colorTheme: ColorThemeOption,
  activeElements: DesignElementOption[],
  components?: SelectedComponents,
  subPurpose?: SubPurposeOption,
  tailoredMood?: TailoredMoodOption,
  typography?: TypographyOption
): PromptResult {
  const compInfo = components ? `\n- Component Layout: Header (${components.nav?.koreanName || 'Standard'}), Main Deck (${components.mainDeck?.koreanName || 'Standard'}), Metrics (${components.metric?.koreanName || 'Standard'}), Footer (${components.footer?.koreanName || 'Standard'})` : '';
  const purposeInfo = subPurpose ? `\n- Purpose: ${subPurpose.title} (${subPurpose.badge})` : '';
  const moodInfo = tailoredMood ? `\n- Tailored Mood: ${tailoredMood.title} [${tailoredMood.badge}] - ${tailoredMood.aiDirective}` : '';
  const typoInfo = typography ? `\n- Typography: ${typography.koreanName} (${typography.headlineFont} for titles, ${typography.bodyFont} for text) - ${typography.promptDirective}` : '';

  const chartDirectives = domain.id === 'ppt' ? `
- Visualization & Charts: Format growth metrics into visual quarterly bar cards, TAM-SAM-SOM market concentric circles, customer breakdown donut cards, conversion funnel stages, and unit economics KPI scorecards.` : '';

  const text = `Create a presentation deck with the following design guidelines:${purposeInfo}${moodInfo}
- Theme: ${style.name} with ${colorTheme.name}
- Background color: ${colorTheme.tokens.bg}
- Card fill: ${colorTheme.tokens.cardBg}
- Accent highlight color: ${colorTheme.tokens.accent}
- Corner radius: ${style.defaultBorderRadius}${typoInfo}${compInfo}${chartDirectives}
- Layout rhythm: Generous whitespace, asymmetric bento modular containers, bold typography with high contrast.
- Visual elements: ${activeElements.map(e => e.koreanName).join(', ')}

Content to format:
(Insert your draft text here)`;

  return {
    title: 'Gamma 슬라이드 전용 프롬프트',
    targetAI: 'gamma_slide',
    promptText: text,
    charCount: text.length,
    wordCount: text.split(/\s+/).length,
  };
}

/**
 * 4. Midjourney / DALL-E 전용 비주얼 프롬프트
 */
function generateMidjourneyPrompt(
  domain: DesignDomain,
  style: VisualStyleOption,
  colorTheme: ColorThemeOption,
  activeElements: DesignElementOption[],
  components?: SelectedComponents,
  subPurpose?: SubPurposeOption,
  tailoredMood?: TailoredMoodOption
): PromptResult {
  const aspect = domain.canvasAspect.replace(':', ':');
  const compKey = components ? `, featuring ${components.mainDeck?.name || 'modern'} layout and ${components.nav?.name || 'clean header'}` : '';
  const visArt = components?.mainDeck?.visualKeywords ? `, ${components.mainDeck.visualKeywords}` : '';
  const moodArt = tailoredMood ? `, ${tailoredMood.title} aesthetic mood, ${tailoredMood.badge}` : '';
  const text = `High-end ${domain.name} presentation design mockup${moodArt}, ${style.aiKeywords}${visArt}, color palette of ${colorTheme.name} (${colorTheme.tokens.accent}, ${colorTheme.tokens.bg})${compKey}, ${activeElements.map(e => e.name).join(', ')}, ultra-clean UI/UX layout, award-winning Behance Dribbble portfolio, 8k resolution, photorealistic, sharp focus --ar ${aspect} --v 6.0 --style raw`;

  return {
    title: 'Midjourney 이미지 생성 전용 프롬프트',
    targetAI: 'midjourney',
    promptText: text,
    charCount: text.length,
    wordCount: text.split(/\s+/).length,
  };
}

/**
 * 24대 특색 스타일별 세부 차별화 및 CSS 토큰 계약 규칙
 */
function getStyleSpecificRules(styleId: string): string {
  switch (styleId) {
    case 'neo-brutalism':
      return `  * 3px 두꺼운 블랙 솔리드 외곽선 (border: 3px solid #000) 필수 적용
  * 블러 없는 각진 하드 오프셋 그림자 (box-shadow: 5px 5px 0px #000) 강제
  * 각진 직각 모서리 (border-radius: 0px) 및 회전된 스티커 뱃지 (transform: rotate(-2deg))
  * 대문자 볼드 폰트와 생생한 비비드 옐로우/코랄 블록 배색`;
    case 'cyberpunk-hud':
    case 'cyber-glow':
      return `  * CRT 스캔라인 그리드 패턴과 터미널 모노스페이스 폰트 (font-mono)
  * 일렉트릭 시안 (#00F0FF) & 핫 마젠타 (#FF007F) 네온 발광
  * [SYS::OK], [TEL-01], [COORD::37.56N] 등의 미래지향적 텔레메트리 브라켓 태그
  * 챔퍼(각진) HUD 모서리와 미세 와이어프레임 가이드 라인`;
    case 'holographic-prism':
      return `  * 무지개빛 오팔 굴절 그라데이션과 홀로그래픽 크로마틱 반사광
  * 반투명 프로스티드 글래스 패널과 부유하는 프리즘 레이어
  * 빛의 산란 효과와 신비로운 스펙트럼 하이라이트`;
    case 'biotech-clean':
      return `  * 극도로 정제된 멸균 화이트 글래스 (backdrop-blur 16px)
  * 수술실 멸균 민트 (#10B981) 및 사이언 (#06B6D4) 액센트
  * 0.1mm 정밀 계측 십자선 (Hairline Crosshair) 및 임상 프로토콜 태그
  * 군더더기 없는 클린 룸 미학`;
    case 'space-aerospace':
    case 'scifi-hud':
      return `  * 우주선 조종석 텔레메트리 HUD 및 원형 레이다 그리드
  * 전술 앰버 오렌지 (#F59E0B)와 딥 네이비 고대비 배색
  * 각진 폴리곤 컨테이너와 마하/고도 벡터 텔레메트리 지표`;
    case 'bento-apple':
    case 'bento-grid':
      return `  * 비대칭 2x2, 1x2, 2x1 모듈러 그리드 위계 구조 (Apple Bento Modular)
  * 좌측 히어로 메인 7열 대형 카드 + 우측 스파크라인 지표 위젯
  * 22px 둥근 모서리와 높은 정보 밀도의 애플 생태계 감성`;
    case 'swiss-international':
    case 'swiss-minimal':
      return `  * 40% 이상의 극대화된 여백과 군더더기 없는 엄격한 12열 그리드
  * 거대한 볼드 숫자 인덱스 (01, 02, 03)로 시선 위계 확립
  * 그림자 0% (완전한 Flat 2D), 정교한 1px 헤어라인 분할선
  * 블랙 & 화이트 모노크롬 베이스에 단 1개의 강렬한 액센트`;
    case 'nordic-frost':
    case 'nordic-clean':
      return `  * 쿨그레이 (#F8FAFC) 배경과 아이스 블루 (#38BDF8)의 맑은 대비
  * 정갈하고 차분한 스칸디나비안 미니멀리즘
  * 부드러운 다층 소프트 그림자와 16px 라운딩`;
    case 'monochrome-wireframe':
      return `  * 1px 정밀 라인 드로잉과 블루프린트 격자 배경
  * 흑백 모노크롬의 구조적 설계도 미학
  * 불필요한 장식과 그림자를 완벽히 배제한 투명한 정보 구조`;
    case 'japanese-zen':
      return `  * 자연스러운 한지 미색 (#FAF8F5) 배경과 먹물 잉크 블랙 (#1F1F1F)
  * 와비사비(Wabi-Sabi) 미학의 비대칭적이고 시적인 여백
  * 단아하고 정갈한 여백의 호흡과 세로/가로선의 단정한 균형`;
    case 'y2k-retro-chrome':
    case 'y2k-retro':
      return `  * 크롬 리퀴드 메탈릭 텍스트 엠보스 및 입체 베벨 효과
  * 반짝이는 4-point 스파클 별 (✦)과 키치한 세기말 밀레니엄 팝
  * 글로시 젤리 버튼과 핑크/시안 하이라이트`;
    case 'acid-streetwear':
      return `  * 하이퍼 네온 라임 (#A3E635)과 바이올렛 퍼플의 파괴적인 충돌
  * 하프톤 노이즈 텍스처와 왜곡된 자이언트 키네틱 타이포
  * 언더그라운드 스트릿 클럽 포스터 감성의 거친 에너지`;
    case 'memphis-graphic':
    case 'memphis-pop':
      return `  * 80년대 멘디니 지그재그 패턴, 도트 무늬, 기하학적 도형 콜라주
  * 경쾌하고 유쾌한 원색 블록 배색과 포스트모던 팝 아트 감성`;
    case 'bold-heavy-type':
      return `  * 80pt+ 화면 전체를 지배하는 900 울트라 헤비 디스플레이 폰트
  * 텍스트 자체가 시각적 비주얼 아트가 되는 단호한 그래픽 구성
  * 불필요한 아이콘과 장식 요소를 배제한 타이포그래픽 파워`;
    case 'luxury-editorial':
      return `  * 클래식 하이엔드 세리프 (Playfair Display / Cormorant) 타이포그래피
  * 샴페인 골드 (#D4AF37) 헤어라인 테두리와 로마 숫자 인덱스 (I, II, III)
  * 여유로운 자간 (letter-spacing 0.15em)과 딥 차콜 벨벳 배경`;
    case 'vogue-fashion-mag':
      return `  * 풀블리드 패션 화보 중심의 비대칭 2열 에디토리얼 칼럼
  * 0.5px 초미세 헤어라인 구분선과 잡지 커버 비율의 마스트헤드`;
    case 'architectural-concrete':
    case 'brutalist-arch':
      return `  * 노출 콘크리트 그레이와 웅장한 모놀리식 사각 매스 구조
  * 건축 도면의 황금비율 그리드와 중후한 권위감`;
    case 'vintage-broadsheet':
      return `  * 고전 영자 신문 조판, 펜 잉크 해칭 텍스처, 세피아 페이퍼 질감
  * 3단 다단 컬럼과 클래식 활자체 헤드라인`;
    case 'soft-ui-evolution':
    case 'soft-ui':
      return `  * 가독성을 혁신한 다층 소프트 엠보스 그림자 (0 10px 30px rgba(0,0,0,0.06))
  * 포근한 웜 크림 (#FDFBF7) 배경과 20px 부드러운 라운딩
  * 테라코타 (#E07A5F) & 세이지 그린 (#81B29A) 웰빙 감성`;
    case 'claymorphism-3d':
    case 'claymorphism':
      return `  * 쫀득쫀득한 3D 점토 볼륨감과 28px 통통한 둥근 모서리
  * 내부 엠보스 그림자(inset shadow)와 외부 부드러운 드롭 섀도우 결합
  * 친근하고 입체적인 마시멜로 캡슐 인터랙션`;
    case 'organic-botanical':
    case 'botanical-organic':
      return `  * 재생지 크래프트 질감과 세이지 그린/올리브 어스톤
  * 친환경 자연주의 무드와 따뜻한 유기농 라이프스타일`;
    case 'craft-paper-textured':
      return `  * 질감이 살아있는 크래프트지, 인장 도장/스탬프 인증 엠블럼
  * 장인정신이 깃든 아날로그 수제 감성과 따뜻한 세피아 톤`;
    case 'skeuomorphic-luxe':
    case 'skeuomorphism-2':
      return `  * 브러시드 알루미늄 메탈 베젤, 물리적 토글 스위치, 정밀 다이얼 노브
  * 현대적인 촉각적 질감과 세련된 하드웨어 인스트루먼트 마감`;
    default:
      return `  * 딥 OLED 블랙 (#000000) 베이스와 WCAG 7:1 고대비 텍스트
  * 0.5px 레이저 서피스 보더와 네온 에메랄드 하이라이트`;
  }
}
