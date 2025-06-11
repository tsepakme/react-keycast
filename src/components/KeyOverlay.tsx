import React from 'react';
import { useKeyPresses } from '../hooks/useKeyPresses';
import { KeyItem } from './KeyItem';
import '../styles/keyOverlay.css';

export const KeyOverlay: React.FC = () => {
  const keys = useKeyPresses();

  return (
    <div className="key-overlay">
      {keys.map((keyData) => (
        <KeyItem key={keyData.id} keyData={keyData} />
      ))}
    </div>
  );
};
