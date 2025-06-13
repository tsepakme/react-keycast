import React, { CSSProperties } from 'react';

type PressedKey = {
    key: string;
    modifiers: {
        shift: boolean;
        ctrl: boolean;
        alt: boolean;
        meta: boolean;
    };
    timestamp: number;
    id: string;
};
interface KeyOverlayProps {
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    style?: CSSProperties;
    keyStyle?: CSSProperties;
    maxKeys?: number;
    timeout?: number;
    filterKeys?: (key: string) => boolean;
    className?: string;
}

declare const KeyOverlay: React.FC<KeyOverlayProps>;

export { KeyOverlay, type KeyOverlayProps, type PressedKey };
