import type {
  FocalAnchor,
  GridColumnSpan,
  LayoutPreset,
  LayoutZoneSlot,
  ComponentPropValue,
} from '@/data/component-presets';
import type { TargetAI } from '@/lib/prompt-engine';

export const STUDIO_DOCUMENT_VERSION = 1 as const;

export type StudioDocumentVersion = typeof STUDIO_DOCUMENT_VERSION;
export type StudioNodeKind = 'page' | 'section' | 'container' | 'stack' | 'grid' | 'component';
export type StudioViewport = 'desktop' | 'tablet' | 'mobile';
export type StudioBreakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl';
export type StudioValue = ComponentPropValue;

export interface StudioResponsiveOverride {
  hidden?: boolean;
  colSpan?: GridColumnSpan;
  order?: number;
  padding?: string;
  gap?: string;
}

export interface StudioLayoutConstraints {
  slot?: LayoutZoneSlot;
  colSpan?: GridColumnSpan;
  direction?: 'row' | 'column';
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: string;
  padding?: string;
  maxWidth?: string;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between';
}

export interface StudioNode {
  id: string;
  kind: StudioNodeKind;
  name: string;
  componentId?: string;
  componentType?: string;
  koreanName?: string;
  description?: string;
  promptDirective?: string;
  focalAnchor?: FocalAnchor;
  category?: string;
  variant?: string;
  props: Record<string, StudioValue>;
  layout: StudioLayoutConstraints;
  responsive: Partial<Record<StudioBreakpoint, StudioResponsiveOverride>>;
  hidden?: boolean;
  locked?: boolean;
  children: StudioNode[];
}

export interface StudioPage {
  id: string;
  name: string;
  slug: string;
  layoutPreset: LayoutPreset;
  root: StudioNode;
}

export interface StudioThemeSelection {
  styleId: string;
  colorThemeId: string;
  typographyId: string;
  activeElementIds: string[];
}

export interface StudioContent {
  headline: string;
  locale: string;
}

export interface StudioGenerationPolicy {
  targetAI: TargetAI;
  fidelity: 'strict' | 'balanced' | 'creative';
  framework: 'nextjs' | 'react';
  styling: 'tailwind';
  lockedFields: Array<'layout' | 'theme' | 'content' | 'interactions'>;
}

export interface StudioProjectMeta {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudioDocument {
  version: StudioDocumentVersion;
  project: StudioProjectMeta;
  activePageId: string;
  pages: StudioPage[];
  theme: StudioThemeSelection;
  content: StudioContent;
  generation: StudioGenerationPolicy;
}

export interface StudioWorkspaceState {
  inspectMode: boolean;
  viewport: StudioViewport;
  canvasScale: '100' | '85' | '75';
  selectedNodeId: string | null;
}
