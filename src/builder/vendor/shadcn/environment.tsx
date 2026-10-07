"use client";
import { createContext, useContext } from 'react';
export const PreviewEnvironment = createContext<{ container: HTMLElement | null }>({ container: null });
export const usePreviewEnvironment = () => useContext(PreviewEnvironment);
