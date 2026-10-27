import React, { CSSProperties } from 'react';
import { useKeyPresses } from '../hooks/useKeyPresses';
import { KeyItem } from './KeyItem';
// @ts-ignore CSS side-effect imports are handled by the bundler.
import '../styles/keyOverlay.css';
import { KeyOverlayProps } from '../types';

export function KeyOverlay<TTimeout extends number = number, TMaxKeys extends number = number>({
  position = 'bottom-right',
  style = {},
  keyStyle = {},
  maxKeys = 5 as KeyOverlayProps<TTimeout, TMaxKeys>['maxKeys'],
  timeout = 1500 as KeyOverlayProps<TTimeout, TMaxKeys>['timeout'],
  filterKeys = () => true,
  className = '',
}: KeyOverlayProps<TTimeout, TMaxKeys>) {
  const resolvedTimeout = timeout ?? 1500;
  const resolvedMaxKeys = maxKeys ?? 5;

  if (!Number.isFinite(resolvedTimeout) || resolvedTimeout <= 0) {
    throw new RangeError('KeyOverlay: timeout must be a finite number greater than 0.');
  }

  if (!Number.isSafeInteger(resolvedMaxKeys) || resolvedMaxKeys <= 0) {
    throw new RangeError('KeyOverlay: maxKeys must be a positive safe integer.');
  }

  const keys = useKeyPresses({
    timeout: resolvedTimeout,
    maxItems: resolvedMaxKeys,
  });

  const filteredKeys = keys.filter(k => filterKeys(k.key));

  if (filteredKeys.length === 0) {
    return null;
  }
  
  const positionStyles: Record<string, CSSProperties> = {
    'top-left': { top: 16, left: 16, bottom: 'auto', right: 'auto' },
    'top-right': { top: 16, right: 16, bottom: 'auto', left: 'auto' },
    'bottom-left': { bottom: 16, left: 16, top: 'auto', right: 'auto' },
    'bottom-right': { bottom: 16, right: 16, top: 'auto', left: 'auto' },
    'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
  };

  return (
    <div 
      className={`key-overlay ${className}`} 
      style={{ ...positionStyles[position], ...style }}
    >
      {filteredKeys.map((keyData) => (
        <KeyItem
          key={keyData.id}
          keyData={keyData}
          style={{ animationDuration: `${resolvedTimeout}ms`, ...keyStyle }}
        />
      ))}
    </div>
  );
}
