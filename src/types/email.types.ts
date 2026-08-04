export interface CreateEmailParams {
  userId: string;
}

export interface VerifyEmailParams {
  token: string;
}

export interface SignupVerificationEvent {
  email: string;
  token: string;
}
