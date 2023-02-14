import React, { useRef } from 'react';
import { render, screen } from '@testing-library/react';
import ComparisonMenu from './ComparisonMenu';

const MockComponent = ({ close }: { close: any }) => {
  const ref = useRef(null);
  return (
    <div>
      <ComparisonMenu close={close} menuRef={ref} tickers={[]} />
    </div>
  );
};

describe('ComparsionMenu.tsx', () => {
  test('It renders', () => {
    const close = jest.fn();
    render(<MockComponent close={close} />);
    const inputLabel = screen.getByText('Compare stock');
    expect(inputLabel).toBeInTheDocument();
  });
});
