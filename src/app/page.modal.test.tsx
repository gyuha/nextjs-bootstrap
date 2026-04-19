import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { beforeEach, describe, expect, it } from 'vitest';

import HomePage from '@/app/page';
import { ModalManager } from '@/components/ui/modal/modal-manager';
import { useModalStore } from '@/stores/modal-store';
import { renderWithProviders } from '@/test/test-utils';

describe('HomePage modal samples', () => {
  beforeEach(() => {
    useModalStore.setState(useModalStore.getInitialState());
  });

  it('opens and closes the alert modal sample', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <>
        <HomePage />
        <ModalManager />
      </>,
    );

    await user.click(screen.getByRole('button', { name: '알림 모달 열기' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('모달 시스템 이식 완료')).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');

    await user.click(screen.getByRole('button', { name: '확인' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(document.body.style.overflow).toBe('');
    });
  });

  it('opens the custom modal sample', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <>
        <HomePage />
        <ModalManager />
      </>,
    );

    await user.click(screen.getByRole('button', { name: '커스텀 모달 열기' }));

    expect(useModalStore.getState().modals[0]?.title).toBe('Custom Modal');
    expect(screen.getByText('Custom Modal Sample')).toBeInTheDocument();
    expect(
      screen.getByText('전역 modal store에서 JSX 컨텐츠를 직접 렌더링합니다.'),
    ).toBeInTheDocument();
  });

  it('closes the top modal with Escape', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <>
        <HomePage />
        <ModalManager />
      </>,
    );

    await user.click(screen.getByRole('button', { name: '알림 모달 열기' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('opens a global portal modal that can read form context values', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <>
        <HomePage />
        <ModalManager />
      </>,
    );

    await user.type(
      screen.getByLabelText('미리보기 텍스트'),
      'react-hook-form 값',
    );
    await user.click(
      screen.getByRole('button', { name: '컨텍스트 포털 모달 열기' }),
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Context Portal Modal')).toBeInTheDocument();
    expect(screen.getByText('react-hook-form 값')).toBeInTheDocument();
  });
});
