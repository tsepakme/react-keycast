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
  it('renders key with modifiers', () => {
    render(<KeyItem keyData={mockKey} />);
    expect(screen.getByText('Ctrl + Shift + a')).toBeInTheDocument();
  });
});
