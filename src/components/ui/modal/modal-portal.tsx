'use client';

import { AnimatePresence } from 'motion/react';
import React from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/components/ui/button';
import { ModalBackdrop } from '@/components/ui/modal/modal-backdrop';
import { ModalContainer } from '@/components/ui/modal/modal-container';
import { ModalHeader } from '@/components/ui/modal/modal-header';
import type { ModalSize } from '@/stores/modal.types';

export const GLOBAL_MODAL_PORTAL_TARGET_ID = 'global-modal-portal-root';

interface ModalPortalProps {
  backdropDismiss?: boolean;
  children: React.ReactNode;
  onClose: () => void;
  open: boolean;
  size?: ModalSize;
  title?: string;
}

export function ModalPortal({
  backdropDismiss = true,
  children,
  onClose,
  open,
  size = 'md',
  title,
}: ModalPortalProps) {
  const [target, setTarget] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    setTarget(
      document.getElementById(GLOBAL_MODAL_PORTAL_TARGET_ID) ?? document.body,
    );
  }, []);

  React.useEffect(() => {
    if (!open) {
      document.body.style.overflow = '';

      return;
    }

    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose, open]);

  if (!open || !target) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      <ModalBackdrop>
        <div
          className="flex h-full w-full items-center justify-center"
          onMouseDown={() => {
            if (backdropDismiss) {
              onClose();
            }
          }}
        >
          <div onMouseDown={(event) => event.stopPropagation()}>
            <ModalContainer size={size}>
              <ModalHeader onClose={onClose}>{title}</ModalHeader>
              <div className="space-y-4 px-6 py-6">
                {children}
                <div className="flex justify-end border-t border-white/10 pt-4">
                  <Button onClick={onClose} type="button">
                    닫기
                  </Button>
                </div>
              </div>
            </ModalContainer>
          </div>
        </div>
      </ModalBackdrop>
    </AnimatePresence>,
    target,
  );
}
