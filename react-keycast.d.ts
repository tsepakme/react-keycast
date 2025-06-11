declare module "react-keycast" {
  import { FC, CSSProperties } from "react";

  export interface KeyOverlayProps {
    /**
     * Position on screen. Options: 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'
     * @default 'bottom-right'
     */
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    
    /**
     * Custom CSS styles for the overlay container
     * @default {}
     */
    style?: CSSProperties;
    
    /**
     * Custom CSS styles for individual key items
     * @default {}
     */
    keyStyle?: CSSProperties;
    
    /**
     * Maximum number of keys to display at once
     * @default 5
     */
    maxKeys?: number;
    
    /**
     * Time in milliseconds before a key disappears
     * @default 1500
     */
    timeout?: number;
    
    /**
     * Function to filter which keys to display
     * @default () => true
     */
    filterKeys?: (key: string) => boolean;
    
    /**
     * Additional CSS class name for the container
     * @default ''
     */
    className?: string;
  }

  export const KeyOverlay: FC<KeyOverlayProps>;
}
