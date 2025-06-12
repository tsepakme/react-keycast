import React, { CSSProperties } from 'react';
import { PressedKey } from '../types';

interface Props {
  keyData: PressedKey;
  style?: CSSProperties;
}

export const KeyItem: React.FC<Props> = ({ keyData, style = {} }) => {
  const { key, modifiers } = keyData;

  const modKeys = [
    modifiers.ctrl && 'Ctrl',
    modifiers.alt && 'Alt',
    modifiers.shift && 'Shift',
    modifiers.meta && 'Meta',
  ]
    .filter(Boolean)
    .join(' + ');

  const label = modKeys ? `${modKeys} + ${key}` : key;

  return <div className="key-item" style={style}>{label}</div>;
};
