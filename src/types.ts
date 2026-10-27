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

type PositiveNumber<N extends number> = number extends N
  ? N
  : `${N}` extends `-${string}` | '0'
    ? never
    : N;

type PositiveInteger<N extends number> = number extends N
  ? N
  : `${N}` extends `${bigint}`
    ? `${N}` extends `-${string}` | '0'
      ? never
      : N
    : never;

export interface KeyOverlayProps<
  TTimeout extends number = number,
  TMaxKeys extends number = number,
> {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  style?: CSSProperties;
  keyStyle?: CSSProperties;
  /** Must be a positive safe integer. */
  maxKeys?: PositiveInteger<TMaxKeys>;
  /** Must be a finite positive number in milliseconds. */
  timeout?: PositiveNumber<TTimeout>;
  filterKeys?: (key: string) => boolean;
  className?: string;
}
