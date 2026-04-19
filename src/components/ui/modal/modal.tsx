'use client';

import React from 'react';

import type { ModalProps } from '@/stores/modal.types';

import { ModalContainer } from './modal-container';
import { ModalDefault } from './modal-default';
import { ModalHeader } from './modal-header';

interface ModalRendererProps {
  modal: ModalProps;
  onClose: () => void;
}

export function ModalRenderer({ modal, onClose }: ModalRendererProps) {
  if ('alert' in modal) {
    return <ModalDefault {...modal} onClose={onClose} />;
  }

  return (
    <ModalContainer className={modal.className} size={modal.size}>
      <ModalHeader onClose={onClose}>{modal.title}</ModalHeader>
      <div className="px-6 py-6">{modal.custom}</div>
    </ModalContainer>
  );
}

ModalRenderer.Container = ModalContainer;
ModalRenderer.Header = ModalHeader;
