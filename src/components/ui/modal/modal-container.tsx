'use client';

import { motion } from 'motion/react';
import React from 'react';
import type { ReactNode } from 'react';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ModalSize } from '@/stores/modal.types';

const modalSizeClassName = {
  lg: 'max-w-3xl',
  md: 'max-w-xl',
  sm: 'max-w-md',
} satisfies Record<ModalSize, string>;

interface ModalContainerProps {
  children: ReactNode;
  className?: string;
  size?: ModalSize;
}

export function ModalContainer({
  children,
  className,
  size = 'md',
}: ModalContainerProps) {
  return (
    <motion.dialog
      animate={{ opacity: 1, scale: 1, y: 0 }}
      aria-modal="true"
      className={cn('w-full', modalSizeClassName[size])}
      exit={{ opacity: 0, scale: 0.96, y: 8 }}
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      open
      tabIndex={-1}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      <Card
        className={cn(
          'relative overflow-hidden border-white/15 bg-card/95',
          className,
        )}
      >
        {children}
      </Card>
    </motion.dialog>
  );
}
