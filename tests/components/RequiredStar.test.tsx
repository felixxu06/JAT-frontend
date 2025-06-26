import { render } from '@testing-library/react';
import RequiredStar from '../../app/components/RequiredStar';
import { describe, it, expect } from 'vitest';

describe('RequiredStar', () => {
  it('renders a red asterisk', () => {
    const { getByText } = render(<RequiredStar />);
    const star = getByText('*');
    expect(star).toBeInTheDocument();
    expect(star).toHaveStyle('color: rgb(244, 67, 54)'); // match actual rendered color
  });
});
