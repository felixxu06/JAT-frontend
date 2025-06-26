import { render } from '@testing-library/react';
import MainLayout from '../../app/components/MainLayout';
import { describe, it, expect } from 'vitest';
import { UserContextProvider } from '../../app/hooks/UserContext';
import { MemoryRouter } from 'react-router-dom';

describe('MainLayout', () => {
    it.only('renders children', () => {
        const { getByText } = render(
            <MemoryRouter>
                <UserContextProvider>
                    <MainLayout>
                        <div>Test Child</div>
                    </MainLayout>
                </UserContextProvider>
            </MemoryRouter>
        );
        expect(getByText('Test Child')).toBeInTheDocument();
    });
});
