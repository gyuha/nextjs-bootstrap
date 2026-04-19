'use client';

import { motion } from 'motion/react';
import React from 'react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface ModalBackdropProps {
  children: ReactNode;
  className?: string;
}

export function ModalBackdrop({ children, className }: ModalBackdropProps) {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4 py-10 backdrop-blur-sm',
        className,
      )}
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
