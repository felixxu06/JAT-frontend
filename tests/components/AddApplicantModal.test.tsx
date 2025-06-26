import { render, fireEvent } from '@testing-library/react';
import AddApplicantModal from '../../app/components/AddApplicantModal';
import { describe, it, expect, vi } from 'vitest';
import { ApplicantsProvider } from '../../app/hooks/ApplicantsContext';

describe('AddApplicantModal', () => {
  it('renders and validates required fields', () => {
    const onAdd = vi.fn();
    const onClose = vi.fn();
    const { getAllByText, getByText } = render(
      <ApplicantsProvider>
        <AddApplicantModal open={true} onClose={onClose} onAdd={onAdd} />
      </ApplicantsProvider>
    );
    fireEvent.click(getByText('Add'));
    const errors = getAllByText('Required');
    expect(errors.length).toBeGreaterThanOrEqual(2);
    errors.forEach(error => expect(error).toBeInTheDocument());
  });
});
