'use client';

import { useCallback, useEffect, useMemo, useReducer, type SetStateAction } from 'react';
import type { LegoBlockItem, LayoutPreset } from '@/data/component-presets';
import type { TargetAI } from '@/lib/prompt-engine';
import {
  createDefaultStudioDocument,
  getActivePage,
  getDocumentBlocks,
  parseStudioDocument,
  replaceDocumentBlocks,
} from './document';
import type { StudioDocument } from './types';

const STORAGE_KEY = 'prompt-studio:document:v1';
const HISTORY_LIMIT = 100;

interface DocumentHistoryState {
  past: StudioDocument[];
  present: StudioDocument;
  future: StudioDocument[];
  hydrated: boolean;
}

type DocumentMutation = (document: StudioDocument) => StudioDocument;

type HistoryAction =
  | { type: 'hydrate'; document: StudioDocument }
  | { type: 'commit'; mutate: DocumentMutation; changedAt: string }
  | { type: 'replace'; document: StudioDocument; changedAt: string }
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'reset'; document: StudioDocument; changedAt: string };

function commitDocument(
  state: DocumentHistoryState,
  nextDocument: StudioDocument,
  changedAt: string,
): DocumentHistoryState {
  if (nextDocument === state.present) return state;

  return {
    past: [...state.past, state.present].slice(-HISTORY_LIMIT),
    present: {
      ...nextDocument,
      project: {
        ...nextDocument.project,
        updatedAt: changedAt,
      },
    },
    future: [],
    hydrated: true,
  };
}

function historyReducer(state: DocumentHistoryState, action: HistoryAction): DocumentHistoryState {
  switch (action.type) {
    case 'hydrate':
      return { past: [], present: action.document, future: [], hydrated: true };
    case 'commit':
      return commitDocument(state, action.mutate(state.present), action.changedAt);
    case 'replace':
      return commitDocument(state, action.document, action.changedAt);
    case 'undo': {
      const previous = state.past.at(-1);
      if (!previous) return state;
      return {
        ...state,
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future],
      };
    }
    case 'redo': {
      const next = state.future[0];
      if (!next) return state;
      return {
        ...state,
        past: [...state.past, state.present].slice(-HISTORY_LIMIT),
        present: next,
        future: state.future.slice(1),
      };
    }
    case 'reset':
      return commitDocument(state, action.document, action.changedAt);
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

export function useStudioDocument() {
  const [state, dispatch] = useReducer(historyReducer, undefined, () => ({
    past: [],
    present: createDefaultStudioDocument(),
    future: [],
    hydrated: false,
  }));

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const document = stored ? parseStudioDocument(JSON.parse(stored) as unknown) : createDefaultStudioDocument();
      dispatch({ type: 'hydrate', document });
    } catch (error) {
      console.warn('저장된 프로젝트를 복원하지 못해 기본 프로젝트를 사용합니다.', error);
      dispatch({ type: 'hydrate', document: createDefaultStudioDocument() });
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.present));
  }, [state.hydrated, state.present]);

  const updateDocument = useCallback((mutate: DocumentMutation) => {
    dispatch({ type: 'commit', mutate, changedAt: nowIso() });
  }, []);

  const setBlocks = useCallback((next: SetStateAction<LegoBlockItem[]>) => {
    updateDocument((document) => {
      const current = getDocumentBlocks(document);
      const blocks = typeof next === 'function' ? next(current) : next;
      return replaceDocumentBlocks(document, blocks);
    });
  }, [updateDocument]);

  const setLayout = useCallback((preset: LayoutPreset, blocks?: LegoBlockItem[]) => {
    updateDocument((document) => replaceDocumentBlocks(
      document,
      blocks ?? getDocumentBlocks(document),
      preset,
    ));
  }, [updateDocument]);

  const setHeadline = useCallback((headline: string) => {
    updateDocument((document) => ({
      ...document,
      content: { ...document.content, headline },
    }));
  }, [updateDocument]);

  const setTargetAI = useCallback((targetAI: TargetAI) => {
    updateDocument((document) => ({
      ...document,
      generation: { ...document.generation, targetAI },
    }));
  }, [updateDocument]);

  const replaceDocument = useCallback((value: unknown) => {
    dispatch({ type: 'replace', document: parseStudioDocument(value), changedAt: nowIso() });
  }, []);

  const resetDocument = useCallback(() => {
    dispatch({ type: 'reset', document: createDefaultStudioDocument(), changedAt: nowIso() });
  }, []);

  const derived = useMemo(() => ({
    activePage: getActivePage(state.present),
    blocks: getDocumentBlocks(state.present),
  }), [state.present]);

  return {
    document: state.present,
    activePage: derived.activePage,
    blocks: derived.blocks,
    hydrated: state.hydrated,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    updateDocument,
    setBlocks,
    setLayout,
    setHeadline,
    setTargetAI,
    replaceDocument,
    resetDocument,
    undo: () => dispatch({ type: 'undo' }),
    redo: () => dispatch({ type: 'redo' }),
  };
}
