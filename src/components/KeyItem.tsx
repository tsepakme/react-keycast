import React from 'react';
import { PressedKey } from '../types';

interface Props {
  keyData: PressedKey;
}

export const KeyItem: React.FC<Props> = ({ keyData }) => {
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

  return <div className="key-item">{label}</div>;
};
