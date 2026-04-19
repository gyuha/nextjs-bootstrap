export interface AuthUser {
  email: string;
  name: string;
}

export interface AuthSuccessResponse {
  message: string;
  user: AuthUser;
}

export type AuthErrorCode = 'EMAIL_TAKEN' | 'INVALID_CREDENTIALS';
