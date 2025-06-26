import { render, fireEvent } from '@testing-library/react';
import AddJobModal from '../../app/components/AddJobModal';
import { describe, it, expect, vi } from 'vitest';

describe('AddJobModal', () => {
  it('renders and validates required fields', () => {
    const onAdd = vi.fn();
    const onClose = vi.fn();
    const { getAllByText, getByText } = render(
      <AddJobModal open={true} onClose={onClose} onAdd={onAdd} job={null} />
    );
    fireEvent.click(getByText('Save'));
    // There are two required fields with the same error, so check both
    const errors = getAllByText('Required, max 100 chars');
    expect(errors.length).toBeGreaterThanOrEqual(2);
    errors.forEach((error) => expect(error).toBeInTheDocument());
  });
});
