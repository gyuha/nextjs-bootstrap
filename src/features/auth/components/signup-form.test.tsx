import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ModalManager } from '@/components/ui/modal/modal-manager';
import { SignupForm } from '@/features/auth/components/signup-form';
import { useModalStore } from '@/stores/modal-store';
import { renderWithProviders } from '@/test/test-utils';

const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

describe('SignupForm', () => {
  beforeEach(() => {
    pushMock.mockReset();
    useModalStore.setState(useModalStore.getInitialState());
  });

  it('shows password mismatch validation', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <>
        <SignupForm />
        <ModalManager />
      </>,
    );

    await user.type(screen.getByLabelText('이름'), '홍길동');
    await user.type(screen.getByLabelText('이메일'), 'hong@example.com');
    await user.type(screen.getByLabelText('비밀번호'), 'password123');
    await user.type(screen.getByLabelText('비밀번호 확인'), 'password456');
    await user.click(screen.getByRole('button', { name: '회원가입' }));

    expect(
      await screen.findByText('비밀번호가 일치하지 않습니다.'),
    ).toBeInTheDocument();
  });

  it('opens an error modal when signup fails with a taken email', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <>
        <SignupForm />
        <ModalManager />
      </>,
    );

    await user.type(screen.getByLabelText('이름'), '홍길동');
    await user.type(screen.getByLabelText('이메일'), 'taken@example.com');
    await user.type(screen.getByLabelText('비밀번호'), 'password123');
    await user.type(screen.getByLabelText('비밀번호 확인'), 'password123');
    await user.click(screen.getByRole('button', { name: '회원가입' }));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('회원가입 실패')).toBeInTheDocument();
    expect(
      screen.getByText(
        '이미 사용 중인 이메일입니다. 다른 이메일을 입력해 주세요.',
      ),
    ).toBeInTheDocument();
  });
});
