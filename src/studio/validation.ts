import {
  COLOR_THEMES,
  TYPOGRAPHY_OPTIONS,
  VISUAL_STYLES,
} from '@/data/design-options';
import {
  COMMERCE_COMPONENTS,
  INSTA_COMPONENTS,
  PPT_COMPONENTS,
  WEB_COMPONENTS,
  YOUTUBE_COMPONENTS,
} from '@/data/component-presets';
import { getDocumentBlocks } from './document';
import type { StudioDocument } from './types';

export type StudioIssueSeverity = 'error' | 'warning' | 'info';

export interface StudioValidationIssue {
  code: string;
  severity: StudioIssueSeverity;
  message: string;
  nodeId?: string;
}

export interface StudioAudit {
  score: number;
  contrastRatio: number;
  issues: StudioValidationIssue[];
  errors: number;
  warnings: number;
  isReady: boolean;
}

function normalizeHex(hex: string): string | null {
  const value = hex.trim().replace('#', '');
  if (/^[0-9a-f]{3}$/i.test(value)) {
    return value.split('').map((character) => `${character}${character}`).join('');
  }
  if (/^[0-9a-f]{6}$/i.test(value)) return value;
  if (/^[0-9a-f]{8}$/i.test(value)) return value.slice(0, 6);
  return null;
}

function relativeLuminance(hex: string): number | null {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;

  const channels = [0, 2, 4].map((offset) => parseInt(normalized.slice(offset, offset + 2), 16) / 255);
  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
}

export function getContrastRatio(foreground: string, background: string): number {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  if (foregroundLuminance === null || backgroundLuminance === null) return 1;
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

const KNOWN_COMPONENT_IDS = new Set([
  ...WEB_COMPONENTS,
  ...PPT_COMPONENTS,
  ...INSTA_COMPONENTS,
  ...COMMERCE_COMPONENTS,
  ...YOUTUBE_COMPONENTS,
].map((component) => component.id));

export function auditStudioDocument(document: StudioDocument): StudioAudit {
  const issues: StudioValidationIssue[] = [];
  const blocks = getDocumentBlocks(document);
  const visibleBlocks = blocks.filter((block) => !block.hidden);
  const theme = COLOR_THEMES.find((item) => item.id === document.theme.colorThemeId);

  if (!document.content.headline.trim()) {
    issues.push({ code: 'content.headline.empty', severity: 'error', message: '메인 헤드라인을 입력하세요.' });
  }
  if (visibleBlocks.length === 0) {
    issues.push({ code: 'layout.blocks.empty', severity: 'error', message: '캔버스에 최소 한 개의 컴포넌트가 필요합니다.' });
  }

  const duplicateIds = blocks
    .map((block) => block.instanceId)
    .filter((id, index, ids) => ids.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    issues.push({ code: 'layout.ids.duplicate', severity: 'error', message: '중복된 컴포넌트 인스턴스 ID가 있습니다.' });
  }

  blocks.forEach((block) => {
    if (!KNOWN_COMPONENT_IDS.has(block.componentId)) {
      issues.push({
        code: 'component.unknown',
        severity: 'warning',
        message: `${block.koreanName} 컴포넌트 정의를 찾을 수 없습니다.`,
        nodeId: block.instanceId,
      });
    }
  });

  if (!visibleBlocks.some((block) => (block.targetSlot ?? block.category) === 'header')) {
    issues.push({ code: 'layout.header.missing', severity: 'warning', message: '페이지 헤더가 없습니다.' });
  }
  if (!visibleBlocks.some((block) => (block.targetSlot ?? block.category) === 'footer')) {
    issues.push({ code: 'layout.footer.missing', severity: 'info', message: '페이지 푸터가 없습니다.' });
  }

  if (!VISUAL_STYLES.some((item) => item.id === document.theme.styleId)) {
    issues.push({ code: 'theme.style.unknown', severity: 'error', message: '선택한 비주얼 스타일을 찾을 수 없습니다.' });
  }
  if (!TYPOGRAPHY_OPTIONS.some((item) => item.id === document.theme.typographyId)) {
    issues.push({ code: 'theme.typography.unknown', severity: 'error', message: '선택한 타이포그래피를 찾을 수 없습니다.' });
  }
  if (!theme) {
    issues.push({ code: 'theme.color.unknown', severity: 'error', message: '선택한 컬러 테마를 찾을 수 없습니다.' });
  }

  const contrastRatio = theme ? getContrastRatio(theme.tokens.textPrimary, theme.tokens.bg) : 1;
  if (contrastRatio < 4.5) {
    issues.push({
      code: 'accessibility.contrast.primary',
      severity: 'error',
      message: `기본 텍스트 대비가 WCAG AA 기준보다 낮습니다. (${contrastRatio.toFixed(2)}:1)`,
    });
  } else if (contrastRatio < 7) {
    issues.push({
      code: 'accessibility.contrast.aaa',
      severity: 'info',
      message: `기본 텍스트 대비는 AA를 통과하지만 AAA에는 미달합니다. (${contrastRatio.toFixed(2)}:1)`,
    });
  }

  const errors = issues.filter((issue) => issue.severity === 'error').length;
  const warnings = issues.filter((issue) => issue.severity === 'warning').length;
  const infos = issues.filter((issue) => issue.severity === 'info').length;
  const score = Math.max(0, 100 - (errors * 20) - (warnings * 6) - (infos * 2));

  return {
    score,
    contrastRatio,
    issues,
    errors,
    warnings,
    isReady: errors === 0,
  };
}
