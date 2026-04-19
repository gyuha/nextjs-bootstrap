import type {
  LoginFormValues,
  SignupFormValues,
} from '@/features/auth/schema/auth.schema';
import type {
  AuthErrorCode,
  AuthSuccessResponse,
} from '@/features/auth/types/auth';

const MOCK_DELAY_MS = 700;
const INVALID_LOGIN_EMAIL = 'fail@example.com';
const TAKEN_SIGNUP_EMAILS = new Set(['fail@example.com', 'taken@example.com']);

class MockAuthError extends Error {
  code: AuthErrorCode;

  constructor(code: AuthErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = 'MockAuthError';
  }
}

async function delay(duration = MOCK_DELAY_MS) {
  await new Promise((resolve) => setTimeout(resolve, duration));
}

export function getAuthErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return '알 수 없는 오류가 발생했습니다.';
}

export async function loginWithPassword(
  values: LoginFormValues,
): Promise<AuthSuccessResponse> {
  await delay();

  if (values.email.toLowerCase() === INVALID_LOGIN_EMAIL) {
    throw new MockAuthError(
      'INVALID_CREDENTIALS',
      '이메일 또는 비밀번호를 다시 확인해 주세요.',
    );
  }

  return {
    message: '로그인되었습니다.',
    user: {
      email: values.email,
      name: values.email.split('@')[0] || 'guest',
    },
  };
}

export async function signupWithPassword(
  values: SignupFormValues,
): Promise<AuthSuccessResponse> {
  await delay();

  if (TAKEN_SIGNUP_EMAILS.has(values.email.toLowerCase())) {
    throw new MockAuthError(
      'EMAIL_TAKEN',
      '이미 사용 중인 이메일입니다. 다른 이메일을 입력해 주세요.',
    );
  }

  return {
    message: '회원가입이 완료되었습니다.',
    user: {
      email: values.email,
      name: values.name,
    },
  };
}
