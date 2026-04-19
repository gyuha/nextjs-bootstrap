import type { ReactElement, ReactNode } from 'react';

export type ModalSize = 'sm' | 'md' | 'lg';

interface ModalBase {
  backdropDismiss?: boolean;
  className?: string;
  disabledEscKey?: boolean;
  title?: string;
  size?: ModalSize;
}

export interface AlertModalProps extends ModalBase {
  alert: ReactNode | string;
  hideBottomButton?: boolean;
}

export interface CustomModalProps extends ModalBase {
  custom: ReactNode;
}

export type ModalProps = AlertModalProps | CustomModalProps;

export type OpenModalInput = ModalProps | ReactElement | string;
