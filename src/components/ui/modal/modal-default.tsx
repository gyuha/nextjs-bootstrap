'use client';

import React from 'react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { ModalContainer } from '@/components/ui/modal/modal-container';
import { ModalHeader } from '@/components/ui/modal/modal-header';
import { cn } from '@/lib/utils';
import type { AlertModalProps } from '@/stores/modal.types';

interface ModalDefaultProps extends AlertModalProps {
  onClose: () => void;
}

function renderAlertContent(content: ReactNode | string) {
  if (typeof content === 'string') {
    return <p className="text-sm leading-7 text-muted-foreground">{content}</p>;
  }

  return content;
}

export function ModalDefault({
  alert,
  className,
  hideBottomButton,
  onClose,
  size,
  title,
}: ModalDefaultProps) {
  return (
    <ModalContainer className={className} size={size}>
      <ModalHeader onClose={onClose}>{title}</ModalHeader>
      <div className="px-6 py-6">{renderAlertContent(alert)}</div>
      {!hideBottomButton ? (
        <div
          className={cn('flex justify-end border-t border-white/10 px-6 py-4')}
        >
          <Button onClick={onClose} type="button">
            확인
          </Button>
        </div>
      ) : null}
    </ModalContainer>
  );
}
