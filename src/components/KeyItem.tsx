import React, { CSSProperties } from 'react';
import { PressedKey } from '../types';

interface Props {
  keyData: PressedKey;
  style?: CSSProperties;
}

export const KeyItem: React.FC<Props> = ({ keyData, style = {} }) => {
  const { key, modifiers } = keyData;
  const normalizedKey = key.toLowerCase();
  const keyLabels: Record<string, string> = {
    shift: 'Shift',
    control: 'Ctrl',
    ctrl: 'Ctrl',
    alt: 'Alt',
    meta: 'Meta',
    ' ': 'Space',
  };
  const keyLabel = keyLabels[normalizedKey] ?? key;
  const isShiftProducedSymbol = key.length === 1 && /[\p{P}\p{S}]/u.test(key);

  const modKeys = [
    modifiers.ctrl && normalizedKey !== 'control' && 'Ctrl',
    modifiers.alt && normalizedKey !== 'alt' && 'Alt',
    modifiers.shift && normalizedKey !== 'shift' && !isShiftProducedSymbol && 'Shift',
    modifiers.meta && normalizedKey !== 'meta' && 'Meta',
  ]
    .filter(Boolean)
    .join(' + ');

  const label = modKeys ? `${modKeys} + ${keyLabel}` : keyLabel;

  return <div className="key-item" style={style}>{label}</div>;
};
