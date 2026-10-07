"use client";
import { useSyncExternalStore } from 'react';
import { usePreviewEnvironment } from './environment';
export function useIsMobile() {
  const { container } = usePreviewEnvironment();
  const win = container?.ownerDocument.defaultView;
  return useSyncExternalStore(callback => {
    const query = win?.matchMedia('(max-width: 767px)');
    query?.addEventListener('change', callback);
    return () => query?.removeEventListener('change', callback);
  }, () => win?.matchMedia('(max-width: 767px)').matches ?? false, () => false);
}
