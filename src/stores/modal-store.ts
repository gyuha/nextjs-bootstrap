'use client';

import React from 'react';
import { create } from 'zustand';

import type {
  ModalProps,
  OpenModalInput,
  OpenModalOptions,
} from '@/stores/modal.types';

interface ModalState {
  closeAllModals: () => void;
  closeModal: () => void;
  modalCount: () => number;
  modals: ModalProps[];
  openModal: (
    modal: OpenModalInput,
    hideBottomButton?: boolean,
    options?: OpenModalOptions,
  ) => void;
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
  openModal: (modal, hideBottomButton = false, options = {}) => {
    const portalOptions =
      options?.portal === true && options.portalTarget
        ? {
            portal: true,
            portalTarget: options.portalTarget,
          }
        : {};

    if (typeof modal === 'string' || React.isValidElement(modal)) {
      set((state) => ({
        modals: [
          ...state.modals,
          {
            alert: modal,
            hideBottomButton,
            ...portalOptions,
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
              ...portalOptions,
            }
          : {
              ...modal,
              ...portalOptions,
            },
      ],
    }));
  },
}));
