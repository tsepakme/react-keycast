import { FC, CSSProperties } from "react";

export type PressedKey = {
  key: string;
  modifiers: {
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
    meta: boolean;
  };
  timestamp: number;
  id: string;
}

export interface KeyOverlayProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  style?: CSSProperties;
  keyStyle?: CSSProperties;
  maxKeys?: number;
  timeout?: number;
  filterKeys?: (key: string) => boolean;
  className?: string;
}
