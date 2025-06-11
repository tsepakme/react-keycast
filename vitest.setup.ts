import "@testing-library/jest-dom";
import { vi } from "vitest";
import { useEffect } from 'react';

if (!global.crypto) {
  global.crypto = {} as any;
}

if (!global.crypto.randomUUID) {
  global.crypto.randomUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    }) as `${string}-${string}-${string}-${string}-${string}`;
  };
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

if (!document.createRange) {
  document.createRange = () => {
    const range = new Range();
    range.getBoundingClientRect = vi.fn();
    range.getClientRects = vi.fn(() => ({
      item: () => null,
      length: 0,
      [Symbol.iterator]: function*() {
      }
    }));
    return range;
  };
}

vi.mock('use-hotkeys-ts', () => {
  return {
    useHotkeys: (keys: string, callback: (e: KeyboardEvent) => void) => {
      useEffect(() => {
        const handler = (e: KeyboardEvent) => callback(e);
        window.addEventListener('keydown', handler);
        
        return () => {
          window.removeEventListener('keydown', handler);
        };
      }, [callback]);
      
      return;
    }
  };
});
