import { EntityManager } from 'typeorm';

/** Parameters required to create an email verification token. */
export interface CreateEmailParams {
  userId: string;
  manager?: EntityManager;
}

/** Parameters required to verify an email verification token. */
export interface VerifyEmailParams {
  token: string;
  manager?: EntityManager;
}

/** Payload emitted when a signup email verification is requested. */
export interface SignupVerificationEvent {
  email: string;
  token: string;
}
