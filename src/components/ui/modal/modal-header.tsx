'use client';

import React from 'react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ModalHeaderProps {
  children?: ReactNode;
  className?: string;
  onClose: () => void;
}

export function ModalHeader({
  children,
  className,
  onClose,
}: ModalHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 p-6 pb-0',
        className,
      )}
    >
      <div className="space-y-1">
        {children ? (
          <h2 className="text-xl font-semibold tracking-tight">{children}</h2>
        ) : null}
      </div>
      <Button
        aria-label="닫기"
        className="h-9 px-3"
        onClick={onClose}
        type="button"
        variant="ghost"
      >
        닫기
      </Button>
    </div>
  );
}
