import { render, screen } from '@testing-library/react';
import { KeyItem } from '../KeyItem';
import type { PressedKey } from '../../types';

const mockKey: PressedKey = {
  key: 'a',
  modifiers: {
    alt: false,
    ctrl: true,
    meta: false,
    shift: true,
  },
  timestamp: Date.now(),
  id: 'test-id',
};

describe('KeyItem', () => {
  it('renders letter keys with modifiers', () => {
    render(<KeyItem keyData={mockKey} />);
    expect(screen.getByText('Ctrl + Shift + a')).toBeInTheDocument();
  });

  it.each([
    ['Shift', { shift: true, ctrl: false, alt: false, meta: false }, 'Shift'],
    ['Control', { shift: false, ctrl: true, alt: false, meta: false }, 'Ctrl'],
    ['Alt', { shift: false, ctrl: false, alt: true, meta: false }, 'Alt'],
    ['Meta', { shift: false, ctrl: false, alt: false, meta: true }, 'Meta'],
  ])('renders the modifier key %s without duplicating its label', (key, modifiers, expected) => {
    render(
      <KeyItem
        keyData={{ ...mockKey, key: key as string, modifiers: modifiers as PressedKey['modifiers'] }}
      />
    );

    expect(screen.getByText(expected as string)).toBeInTheDocument();
  });

  it.each(['?', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+']) (
    'does not prepend Shift to the shifted symbol %s',
    (key) => {
      render(
        <KeyItem
          keyData={{
            ...mockKey,
            key,
            modifiers: { ...mockKey.modifiers, ctrl: false, shift: true },
          }}
        />
      );

      expect(screen.getByText(key)).toBeInTheDocument();
    }
  );

  it('keeps Shift for non-printable keys', () => {
    render(
      <KeyItem
        keyData={{
          ...mockKey,
          key: 'ArrowUp',
          modifiers: { ...mockKey.modifiers, ctrl: false, shift: true },
        }}
      />
    );

    expect(screen.getByText('Shift + ArrowUp')).toBeInTheDocument();
  });

  it('renders Space with its readable label', () => {
    render(
      <KeyItem keyData={{ ...mockKey, key: ' ', modifiers: { ...mockKey.modifiers, ctrl: false, shift: false } }} />
    );

    expect(screen.getByText('Space')).toBeInTheDocument();
  });

  it('applies custom styles', () => {
    render(<KeyItem keyData={mockKey} style={{ color: 'red', fontSize: '20px' }} />);
    const item = screen.getByText('Ctrl + Shift + a');

    expect(item.style.color).toBe('red');
    expect(item.style.fontSize).toBe('20px');
  });
});
