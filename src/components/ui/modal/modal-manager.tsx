'use client';

import { AnimatePresence } from 'motion/react';
import React from 'react';
import { useEffect } from 'react';

import { ModalRenderer } from '@/components/ui/modal/modal';
import { ModalBackdrop } from '@/components/ui/modal/modal-backdrop';
import { useModalStore } from '@/stores/modal-store';

export function ModalManager() {
  const closeModal = useModalStore((state) => state.closeModal);
  const modals = useModalStore((state) => state.modals);

  const hasOpenModal = modals.length > 0;
  const topModal = modals[modals.length - 1];

  useEffect(() => {
    if (!hasOpenModal) {
      document.body.style.overflow = '';

      return;
    }

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [hasOpenModal]);

  useEffect(() => {
    if (!topModal) {
      return;
    }

    const previousActiveElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const focusDialog = () => {
      const dialog = document.querySelector('dialog[open]');

      if (dialog instanceof HTMLDialogElement) {
        dialog.focus();
      }
    };

    const frameId = window.requestAnimationFrame(focusDialog);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && topModal.disabledEscKey !== true) {
        closeModal();

        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const dialog = document.querySelector('dialog[open]');

      if (!(dialog instanceof HTMLDialogElement)) {
        return;
      }

      const focusableElements = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialog.focus();

        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey) {
        if (activeElement === firstElement || activeElement === dialog) {
          event.preventDefault();
          lastElement?.focus();
        }

        return;
      }

      if (activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('keydown', onKeyDown);
      previousActiveElement?.focus();
    };
  }, [closeModal, topModal]);

  return (
    <AnimatePresence>
      {topModal ? (
        <ModalBackdrop>
          <div
            className="flex w-full items-center justify-center"
            onMouseDown={() => {
              if (topModal.backdropDismiss !== false) {
                closeModal();
              }
            }}
          >
            <div onMouseDown={(event) => event.stopPropagation()}>
              <ModalRenderer modal={topModal} onClose={closeModal} />
            </div>
          </div>
        </ModalBackdrop>
      ) : null}
    </AnimatePresence>
  );
}
