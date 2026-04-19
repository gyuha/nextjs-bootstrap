import type { ReactElement, ReactNode, RefObject } from 'react';

export type ModalSize = 'sm' | 'md' | 'lg';

interface ModalBase {
  backdropDismiss?: boolean;
  className?: string;
  disabledEscKey?: boolean;
  portal?: boolean;
  portalTarget?: RefObject<HTMLElement | null>;
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

export interface OpenModalOptions {
  portal?: boolean;
  portalTarget?: RefObject<HTMLElement | null>;
}
