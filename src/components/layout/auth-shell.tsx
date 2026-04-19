import Link from 'next/link';
import type { ReactNode } from 'react';

interface AuthShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthShell({ children, description, title }: AuthShellProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm lg:p-12">
          <div className="space-y-6">
            <Link
              className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              href="/"
            >
              Next.js Bootstrap
            </Link>
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-accent">
                Mock Auth Sample
              </p>
              <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                {title}
              </h1>
              <p className="max-w-xl text-base leading-7 text-muted-foreground">
                {description}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <p className="text-sm font-medium text-foreground">
                  Typed forms
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  React Hook Form과 Zod로 폼 상태와 검증을 분리합니다.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <p className="text-sm font-medium text-foreground">
                  Client auth state
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Zustand와 TanStack Query mutation만으로 인증 흐름을
                  모사합니다.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="flex items-center justify-center">
          {children}
        </section>
      </div>
    </main>
  );
}
