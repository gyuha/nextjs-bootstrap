import { z } from 'zod';

const passwordMessage = '비밀번호는 8자 이상이어야 합니다.';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해 주세요.')
    .email('올바른 이메일 형식이 아닙니다.'),
  password: z.string().min(8, passwordMessage),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, '이름은 2자 이상 입력해 주세요.'),
    email: z
      .string()
      .min(1, '이메일을 입력해 주세요.')
      .email('올바른 이메일 형식이 아닙니다.'),
    password: z.string().min(8, passwordMessage),
    confirmPassword: z.string().min(8, passwordMessage),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
