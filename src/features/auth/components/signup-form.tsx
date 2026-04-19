'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { useSignupMutation } from '@/features/auth/hooks/use-auth-mutation';
import { getAuthErrorMessage } from '@/features/auth/lib/mock-auth-api';
import {
  type SignupFormValues,
  signupSchema,
} from '@/features/auth/schema/auth.schema';
import { useModalStore } from '@/stores/modal-store';

const cardMotion = {
  animate: { opacity: 1, y: 0 },
  initial: { opacity: 0, y: 18 },
  transition: { duration: 0.28, ease: 'easeOut' },
} as const;

export function SignupForm() {
  const router = useRouter();
  const [isNavigating, startTransition] = React.useTransition();
  const mutation = useSignupMutation();
  const openModal = useModalStore((state) => state.openModal);
  const form = useForm<SignupFormValues>({
    defaultValues: {
      confirmPassword: '',
      email: '',
      name: '',
      password: '',
    },
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(values);
      startTransition(() => {
        router.push('/login?registered=1');
      });
    } catch {
      // Mutation error UI is handled through the modal system.
    }
  });

  const previousErrorRef = React.useRef<unknown>(null);

  React.useEffect(() => {
    if (!mutation.error || mutation.error === previousErrorRef.current) {
      return;
    }

    previousErrorRef.current = mutation.error;

    openModal({
      alert: getAuthErrorMessage(mutation.error),
      title: '회원가입 실패',
    });
  }, [mutation.error, openModal]);

  return (
    <motion.div className="w-full max-w-md" {...cardMotion}>
      <Card>
        <CardHeader>
          <CardTitle>회원가입</CardTitle>
          <CardDescription>
            프론트 단독 범위에서 폼 검증, 요청 상태, 실패 케이스를 모두
            확인합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <Form {...form}>
            <form className="space-y-4" onSubmit={onSubmit}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="name"
                        placeholder="홍길동"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        autoComplete="new-password"
                        placeholder="8자 이상 입력"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호 확인</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="new-password"
                        placeholder="비밀번호를 한 번 더 입력"
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
                {mutation.isPending || isNavigating ? '가입 중...' : '회원가입'}
              </Button>
            </form>
          </Form>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              `taken@example.com`으로 중복 이메일 실패를 확인할 수 있습니다.
            </span>
            <Link
              className="font-medium text-foreground hover:text-accent"
              href="/login"
            >
              로그인
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
