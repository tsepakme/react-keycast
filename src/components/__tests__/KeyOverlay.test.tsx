import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { KeyOverlay } from '../KeyOverlay';

function pressKey(key: string, code: string) {
  act(() => {
    fireEvent.keyDown(document, { key, code });
  });
}

describe('KeyOverlay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('renders an empty overlay with its default position', () => {
    const { container } = render(<KeyOverlay />);
    const overlay = container.querySelector('.key-overlay');

    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveStyle({ position: 'fixed', bottom: '16px', right: '16px' });
  });

  it.each([
    ['top-left', { top: '16px', left: '16px', bottom: 'auto', right: 'auto' }],
    ['top-right', { top: '16px', right: '16px', bottom: 'auto', left: 'auto' }],
    ['bottom-left', { bottom: '16px', left: '16px', top: 'auto', right: 'auto' }],
    ['bottom-right', { bottom: '16px', right: '16px', top: 'auto', left: 'auto' }],
    ['center', { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }],
  ])('supports the %s position', (position, expectedStyles) => {
    const { container } = render(<KeyOverlay position={position as 'top-left'} />);

    expect(container.querySelector('.key-overlay')).toHaveStyle(expectedStyles as Record<string, string>);
  });

  it('allows className and inline container styles to customize the overlay', () => {
    const { container } = render(
      <KeyOverlay className="custom-overlay" style={{ bottom: 40, right: 32, opacity: 0.5 }} />
    );
    const overlay = container.querySelector('.key-overlay');

    expect(overlay).toHaveClass('key-overlay', 'custom-overlay');
    expect(overlay).toHaveStyle({ bottom: '40px', right: '32px', opacity: '0.5' });
  });

  it('renders recent keys with custom key styles and timeout animation duration', () => {
    render(<KeyOverlay timeout={2400} keyStyle={{ color: 'red', borderRadius: 12 }} />);
    pressKey('a', 'KeyA');
    const item = screen.getByText('a');

    expect(item.style.color).toBe('red');
    expect(item.style.borderRadius).toBe('12px');
    expect(item.style.animationDuration).toBe('2400ms');
  });

  it('filters keys using filterKeys', () => {
    render(<KeyOverlay filterKeys={(key) => key !== 'x'} />);
    pressKey('x', 'KeyX');
    pressKey('y', 'KeyY');

    expect(screen.queryByText('x')).not.toBeInTheDocument();
    expect(screen.getByText('y')).toBeInTheDocument();
  });

  it('keeps no more than maxKeys entries', () => {
    render(<KeyOverlay maxKeys={2} />);
    pressKey('a', 'KeyA');
    pressKey('b', 'KeyB');
    pressKey('c', 'KeyC');

    expect(screen.queryByText('a')).not.toBeInTheDocument();
    expect(screen.getByText('b')).toBeInTheDocument();
    expect(screen.getByText('c')).toBeInTheDocument();
  });

  it('removes displayed keys after timeout', () => {
    render(<KeyOverlay timeout={500} />);
    pressKey('a', 'KeyA');
    expect(screen.getByText('a')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(screen.queryByText('a')).not.toBeInTheDocument();
  });
});
