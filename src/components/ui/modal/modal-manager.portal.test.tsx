import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { beforeEach, describe, expect, it } from 'vitest';

import { Button } from '@/components/ui/button';
import { ModalManager } from '@/components/ui/modal/modal-manager';
import { useModalStore } from '@/stores/modal-store';
import { renderWithProviders } from '@/test/test-utils';

function PortalHarness() {
  const portalTarget = React.useRef<HTMLDivElement>(null);
  const openModal = useModalStore((state) => state.openModal);

  return (
    <div>
      <div
        className="relative min-h-40"
        data-testid="portal-target"
        ref={portalTarget}
      />
      <Button
        onClick={() => {
          openModal(
            {
              custom: <div>포털 내부 컨텐츠</div>,
              title: '포털 모달',
            },
            false,
            { portal: true, portalTarget },
          );
        }}
        type="button"
      >
        포털 모달 열기
      </Button>
    </div>
  );
}

describe('ModalManager portalTarget', () => {
  beforeEach(() => {
    useModalStore.setState(useModalStore.getInitialState());
  });

  it('renders portal modals inside the requested target', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <>
        <PortalHarness />
        <ModalManager />
      </>,
    );

    await user.click(screen.getByRole('button', { name: '포털 모달 열기' }));

    const portalTarget = screen.getByTestId('portal-target');

    await waitFor(() => {
      expect(within(portalTarget).getByRole('dialog')).toBeInTheDocument();
      expect(within(portalTarget).getByText('포털 모달')).toBeInTheDocument();
      expect(
        within(portalTarget).getByText('포털 내부 컨텐츠'),
      ).toBeInTheDocument();
    });
  });
});
