import {
  COLOR_THEMES,
  DESIGN_ELEMENTS,
  TYPOGRAPHY_OPTIONS,
  VISUAL_STYLES,
} from '@/data/design-options';
import {
  createDefaultLegoStack,
  type LegoBlockItem,
  type LayoutPreset,
} from '@/data/component-presets';
import {
  STUDIO_DOCUMENT_VERSION,
  type StudioDocument,
  type StudioNode,
  type StudioPage,
} from './types';

const DEFAULT_PROJECT_DATE = '2026-01-01T00:00:00.000Z';

export function blockToNode(block: LegoBlockItem): StudioNode {
  return {
    id: block.instanceId,
    kind: 'component',
    name: block.name,
    koreanName: block.koreanName,
    componentId: block.componentId,
    componentType: block.type,
    description: block.description,
    promptDirective: block.promptDirective,
    focalAnchor: block.focalAnchor,
    category: block.category,
    variant: block.variant,
    props: block.props ?? {},
    layout: {
      slot: block.targetSlot,
      colSpan: block.colSpan,
    },
    responsive: block.responsive ?? {},
    hidden: block.hidden,
    locked: block.locked,
    children: [],
  };
}

export function nodeToBlock(node: StudioNode): LegoBlockItem | null {
  if (node.kind !== 'component' || !node.componentId || !node.componentType || !node.focalAnchor) {
    return null;
  }

  const category = node.category as LegoBlockItem['category'] | undefined;
  if (!category) return null;

  return {
    instanceId: node.id,
    componentId: node.componentId,
    name: node.name,
    koreanName: node.koreanName ?? node.name,
    focalAnchor: node.focalAnchor,
    category,
    type: node.componentType,
    description: node.description ?? '',
    promptDirective: node.promptDirective,
    variant: node.variant,
    props: node.props,
    responsive: node.responsive,
    hidden: node.hidden,
    locked: node.locked,
    targetSlot: node.layout.slot,
    colSpan: node.layout.colSpan,
  };
}

function flattenComponentNodes(node: StudioNode): StudioNode[] {
  const own = node.kind === 'component' ? [node] : [];
  return [...own, ...node.children.flatMap(flattenComponentNodes)];
}

export function getActivePage(document: StudioDocument): StudioPage {
  return document.pages.find((page) => page.id === document.activePageId) ?? document.pages[0];
}

export function getDocumentBlocks(document: StudioDocument): LegoBlockItem[] {
  const page = getActivePage(document);
  if (!page) return [];
  return flattenComponentNodes(page.root)
    .map(nodeToBlock)
    .filter((block): block is LegoBlockItem => block !== null);
}

export function replaceDocumentBlocks(
  document: StudioDocument,
  blocks: LegoBlockItem[],
  layoutPreset?: LayoutPreset,
): StudioDocument {
  const activePage = getActivePage(document);
  if (!activePage) return document;
  const previousNodes = new Map(
    flattenComponentNodes(activePage.root).map((node) => [node.id, node]),
  );

  return {
    ...document,
    pages: document.pages.map((page) =>
      page.id === activePage.id
        ? {
            ...page,
            layoutPreset: layoutPreset ?? page.layoutPreset,
            root: {
              ...page.root,
              children: blocks.map((block) => {
                const nextNode = blockToNode(block);
                const previousNode = previousNodes.get(block.instanceId);
                if (!previousNode) return nextNode;
                return {
                  ...nextNode,
                  variant: block.variant ?? previousNode.variant,
                  props: block.props ?? previousNode.props,
                  responsive: block.responsive ?? previousNode.responsive,
                  hidden: block.hidden ?? previousNode.hidden,
                  locked: block.locked ?? previousNode.locked,
                  children: previousNode.children,
                };
              }),
            },
          }
        : page,
    ),
  };
}

export function createDefaultStudioDocument(): StudioDocument {
  const blocks = createDefaultLegoStack('web', 'visual', 'landing');
  const pageId = 'page-home';

  return {
    version: STUDIO_DOCUMENT_VERSION,
    project: {
      id: 'local-prompt-studio-project',
      name: '새 UI 프로젝트',
      createdAt: DEFAULT_PROJECT_DATE,
      updatedAt: DEFAULT_PROJECT_DATE,
    },
    activePageId: pageId,
    pages: [
      {
        id: pageId,
        name: '홈',
        slug: '/',
        layoutPreset: 'landing',
        root: {
          id: 'root-home',
          kind: 'page',
          name: '홈 페이지',
          props: {},
          layout: { direction: 'column' },
          responsive: {},
          children: blocks.map(blockToNode),
        },
      },
    ],
    theme: {
      styleId: VISUAL_STYLES[0].id,
      colorThemeId: COLOR_THEMES[0].id,
      typographyId: TYPOGRAPHY_OPTIONS[0].id,
      activeElementIds: DESIGN_ELEMENTS.slice(0, 3).map((element) => element.id),
    },
    content: {
      headline: '차세대 생성형 UI/UX 디자인 아키텍처 스튜디오',
      locale: 'ko-KR',
    },
    generation: {
      targetAI: 'v0_code',
      fidelity: 'strict',
      framework: 'nextjs',
      styling: 'tailwind',
      lockedFields: ['layout', 'theme', 'interactions'],
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseStudioDocument(value: unknown): StudioDocument {
  if (!isRecord(value)) throw new Error('프로젝트 파일이 JSON 객체가 아닙니다.');
  if (value.version !== STUDIO_DOCUMENT_VERSION) {
    throw new Error(`지원하지 않는 프로젝트 버전입니다: ${String(value.version)}`);
  }
  if (!isRecord(value.project) || typeof value.project.id !== 'string') {
    throw new Error('프로젝트 메타데이터가 올바르지 않습니다.');
  }
  if (!Array.isArray(value.pages) || value.pages.length === 0) {
    throw new Error('프로젝트에 페이지가 없습니다.');
  }
  if (typeof value.activePageId !== 'string') {
    throw new Error('활성 페이지 정보가 없습니다.');
  }
  if (!isRecord(value.theme) || !isRecord(value.content) || !isRecord(value.generation)) {
    throw new Error('테마, 콘텐츠 또는 생성 정책이 올바르지 않습니다.');
  }

  const document = value as unknown as StudioDocument;
  const activePage = document.pages.find((page) => page.id === document.activePageId);
  if (!activePage?.root || !Array.isArray(activePage.root.children)) {
    throw new Error('활성 페이지의 노드 구조가 올바르지 않습니다.');
  }

  return document;
}

export function serializeStudioDocument(document: StudioDocument): string {
  return JSON.stringify(document, null, 2);
}
