import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ModalManager } from '@/components/ui/modal/modal-manager';
import { LoginForm } from '@/features/auth/components/login-form';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useModalStore } from '@/stores/modal-store';
import { renderWithProviders } from '@/test/test-utils';

const pushMock = vi.fn();
const useSearchParamsMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => useSearchParamsMock(),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    pushMock.mockReset();
    useSearchParamsMock.mockReturnValue(new URLSearchParams('registered=1'));
    useAuthStore.setState(useAuthStore.getInitialState());
    useModalStore.setState(useModalStore.getInitialState());
  });

  it('opens a registration success modal from query params', async () => {
    renderWithProviders(
      <>
        <LoginForm />
        <ModalManager />
      </>,
    );

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('회원가입 완료')).toBeInTheDocument();
    expect(
      screen.getByText('이제 방금 만든 계정으로 로그인해 보세요.'),
    ).toBeInTheDocument();
  });

  it('shows field validation messages when submitted empty', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <>
        <LoginForm />
        <ModalManager />
      </>,
    );
    await user.click(screen.getByRole('button', { name: '로그인' }));

    expect(
      await screen.findByText('이메일을 입력해 주세요.'),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('비밀번호는 8자 이상이어야 합니다.'),
    ).toBeInTheDocument();
  });

  it('updates auth store after successful login', async () => {
    const user = userEvent.setup();

    useSearchParamsMock.mockReturnValue(new URLSearchParams(''));

    renderWithProviders(
      <>
        <LoginForm />
        <ModalManager />
      </>,
    );

    await user.type(screen.getByLabelText('이메일'), 'demo@example.com');
    await user.type(screen.getByLabelText('비밀번호'), 'password123');
    await user.click(screen.getByRole('button', { name: '로그인' }));

    await screen.findByRole('button', { name: '로그인 중...' });

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/');
      expect(useAuthStore.getState().user?.email).toBe('demo@example.com');
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });
  });

  it('opens an error modal when login fails', async () => {
    const user = userEvent.setup();

    useSearchParamsMock.mockReturnValue(new URLSearchParams(''));

    renderWithProviders(
      <>
        <LoginForm />
        <ModalManager />
      </>,
    );

    await user.type(screen.getByLabelText('이메일'), 'fail@example.com');
    await user.type(screen.getByLabelText('비밀번호'), 'password123');
    await user.click(screen.getByRole('button', { name: '로그인' }));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('로그인 실패')).toBeInTheDocument();
    expect(
      screen.getByText('이메일 또는 비밀번호를 다시 확인해 주세요.'),
    ).toBeInTheDocument();
  });
});
