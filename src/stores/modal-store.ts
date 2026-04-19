'use client';

import React from 'react';
import { create } from 'zustand';

import type { ModalProps, OpenModalInput } from '@/stores/modal.types';

interface ModalState {
  closeAllModals: () => void;
  closeModal: () => void;
  modalCount: () => number;
  modals: ModalProps[];
  openModal: (modal: OpenModalInput, hideBottomButton?: boolean) => void;
}

const initialState = {
  modals: [],
} satisfies Pick<ModalState, 'modals'>;

export const useModalStore = create<ModalState>((set, get) => ({
  ...initialState,
  closeAllModals: () => set(initialState),
  closeModal: () =>
    set((state) => ({
      modals: state.modals.slice(0, state.modals.length - 1),
    })),
  modalCount: () => get().modals.length,
  openModal: (modal, hideBottomButton = false) => {
    if (typeof modal === 'string' || React.isValidElement(modal)) {
      set((state) => ({
        modals: [
          ...state.modals,
          {
            alert: modal,
            hideBottomButton,
            size: 'sm',
          },
        ],
      }));

      return;
    }

    set((state) => ({
      modals: [
        ...state.modals,
        'alert' in modal && hideBottomButton
          ? {
              ...modal,
              hideBottomButton: modal.hideBottomButton ?? true,
            }
          : modal,
      ],
    }));
  },
}));
