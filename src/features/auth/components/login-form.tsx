'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLoginMutation } from '@/features/auth/hooks/use-auth-mutation';
import { getAuthErrorMessage } from '@/features/auth/lib/mock-auth-api';
import {
  type LoginFormValues,
  loginSchema,
} from '@/features/auth/schema/auth.schema';
import { useModalStore } from '@/stores/modal-store';

const cardMotion = {
  animate: { opacity: 1, y: 0 },
  initial: { opacity: 0, y: 18 },
  transition: { duration: 0.28, ease: 'easeOut' },
} as const;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isNavigating, startTransition] = React.useTransition();
  const mutation = useLoginMutation();
  const openModal = useModalStore((state) => state.openModal);
  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(values);
      startTransition(() => {
        router.push('/');
      });
    } catch {
      // Mutation error UI is handled through the modal system.
    }
  });

  const registered = searchParams.get('registered') === '1';
  const registeredModalShownRef = React.useRef(false);
  const previousErrorRef = React.useRef<unknown>(null);

  React.useEffect(() => {
    if (!registered || registeredModalShownRef.current) {
      return;
    }

    registeredModalShownRef.current = true;

    openModal({
      alert: '이제 방금 만든 계정으로 로그인해 보세요.',
      title: '회원가입 완료',
    });
  }, [openModal, registered]);

  React.useEffect(() => {
    if (!mutation.error || mutation.error === previousErrorRef.current) {
      return;
    }

    previousErrorRef.current = mutation.error;

    openModal({
      alert: getAuthErrorMessage(mutation.error),
      title: '로그인 실패',
    });
  }, [mutation.error, openModal]);

  return (
    <motion.div className="w-full max-w-md" {...cardMotion}>
      <Card>
        <CardHeader>
          <CardTitle>로그인</CardTitle>
          <CardDescription>
            mock API와 Zustand 상태를 함께 확인할 수 있는 샘플 로그인입니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <Form {...form}>
            <form className="space-y-4" onSubmit={onSubmit}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="current-password"
                        placeholder="8자 이상 입력"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="w-full"
                disabled={mutation.isPending || isNavigating}
                size="lg"
                type="submit"
              >
                {mutation.isPending || isNavigating ? '로그인 중...' : '로그인'}
              </Button>
            </form>
          </Form>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              `fail@example.com`으로 실패 케이스를 확인할 수 있습니다.
            </span>
            <Link
              className="font-medium text-foreground hover:text-accent"
              href="/signup"
            >
              회원가입
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
