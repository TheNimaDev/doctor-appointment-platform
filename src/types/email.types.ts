import { EntityManager } from 'typeorm';

export interface CreateEmailParams {
  userId: string;
  manager?: EntityManager;
}

export interface VerifyEmailParams {
  token: string;
}

export interface SignupVerificationEvent {
  email: string;
  token: string;
}
