import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Providers } from '@/app/providers';
import { ModalManager } from '@/components/ui/modal/modal-manager';
import { GLOBAL_MODAL_PORTAL_TARGET_ID } from '@/components/ui/modal/modal-portal';

import './globals.css';

export const metadata: Metadata = {
  title: 'Next.js Bootstrap',
  description: 'Mock auth sample built with Next.js App Router.',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Providers>
          {children}
          <ModalManager />
          <div id={GLOBAL_MODAL_PORTAL_TARGET_ID} />
        </Providers>
      </body>
    </html>
  );
}
