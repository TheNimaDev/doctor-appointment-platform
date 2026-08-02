export interface CreateEmailParams {
  userId: string;
}

export interface VerifyEmailParams {
  userId: string;
  token: string;
}
