import { EntityManager } from 'typeorm';

export interface CreateEmailParams {
  userId: string;
  manager?: EntityManager;
}

export interface VerifyEmailParams {
  token: string;
  manager?: EntityManager;
}

export interface SignupVerificationEvent {
  email: string;
  token: string;
}
