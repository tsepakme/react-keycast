import { renderHook, act } from '@testing-library/react';
import { useKeyPresses } from '../useKeyPresses';
import { vi } from 'vitest';

describe('useKeyPresses', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllTimers();
  });

  it('initializes with empty array', () => {
    const { result } = renderHook(() => useKeyPresses());
    expect(result.current).toEqual([]);
  });

  it('adds a key press to the array', () => {
    const { result } = renderHook(() => useKeyPresses());

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'k',
          ctrlKey: true,
          shiftKey: false,
          metaKey: false,
        })
      );
    });

    expect(result.current.length).toBe(1);
    expect(result.current[0].key).toBe('k');
    expect(result.current[0].modifiers.ctrl).toBe(true);
  });

  it('adds multiple key presses to the array', () => {
    const { result } = renderHook(() => useKeyPresses());

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'a',
          ctrlKey: false,
          shiftKey: true,
          metaKey: false,
        })
      );
    });

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'b',
          ctrlKey: false,
          shiftKey: false,
          metaKey: true,
        })
      );
    });

    expect(result.current.length).toBe(2);
    expect(result.current[0].key).toBe('a');
    expect(result.current[0].modifiers.shift).toBe(true);
    expect(result.current[1].key).toBe('b');
    expect(result.current[1].modifiers.meta).toBe(true);
  });

  it('removes key presses after timeout', () => {
    const { result } = renderHook(() => useKeyPresses({ timeout: 1000 }));

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'k',
          ctrlKey: true,
        })
      );
    });

    expect(result.current.length).toBe(1);

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(result.current.length).toBe(0);
  });

  it('respects maxItems limit', () => {
    const { result } = renderHook(() => useKeyPresses({ maxItems: 2 }));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }));
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'c' }));
    });

    expect(result.current.length).toBe(2);
    expect(result.current[0].key).toBe('b');
    expect(result.current[1].key).toBe('c');
  });

  it('ignores key presses in ignored elements', () => {
    const input = document.createElement('input');
    input.type = 'text';
    document.body.appendChild(input);
    
    input.focus();
    
    const { result } = renderHook(() => useKeyPresses());

    act(() => {
      input.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'k',
          bubbles: true,
        })
      );
    });

    expect(result.current.length).toBe(0);
    
    document.body.removeChild(input);
  });

  it('handles special keys correctly', () => {
    const { result } = renderHook(() => useKeyPresses());

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          ctrlKey: false,
          shiftKey: false,
          metaKey: false,
        })
      );
    });

    expect(result.current.length).toBe(1);
    expect(result.current[0].key).toBe('Enter');
  });
});
