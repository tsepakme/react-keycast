import React, { CSSProperties } from 'react';
import { useKeyPresses } from '../hooks/useKeyPresses';
import { KeyItem } from './KeyItem';
import '../styles/keyOverlay.css';
import { KeyOverlayProps } from '../types';

export const KeyOverlay: React.FC<KeyOverlayProps> = ({
  position = 'bottom-right',
  style = {},
  keyStyle = {},
  maxKeys = 5,
  timeout = 1500,
  filterKeys = () => true,
  className = '',
}) => {
  const keys = useKeyPresses({
    timeout,
    maxItems: maxKeys,
  });

  const filteredKeys = keys.filter(k => filterKeys(k.key));
  
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
        <KeyItem key={keyData.id} keyData={keyData} style={keyStyle} />
      ))}
    </div>
  );
};
