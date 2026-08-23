import { Email } from '@/modules/email/entities';
import { EmailStatus, EmailType } from '@/modules/email/enums';
import { EntityManager } from 'typeorm';

/** Email without user data. */
export type SafeEmail = Omit<Email, 'user'>;

/** Single email API response. */
export interface EmailResponse {
  email: SafeEmail;
}

/** Parameters required to create an email token. */
export interface CreateEmailPayload {
  userId: string;
  manager?: EntityManager;
  type: EmailType;
}

/** Data returned after creating an email token. */
export interface CreateEmailResponse {
  token: string;
  emailId: string;
}

/** Parameters required to validate an email token. */
export interface ValidateEmailTokenPayload {
  token: string;
  manager?: EntityManager;
  type: EmailType;
}

/** Payload emitted when signup email verification is requested. */
export interface SignupVerificationEvent {
  email: string;
  token: string;
  emailId: string;
}

/** Parameters required to find an active email token. */
export interface FindActiveEmailPayload {
  userId: string;
  manager?: EntityManager;
  type: EmailType;
}

/** Parameters required to update an email delivery status. */
export interface UpdateEmailStatusPayload {
  emailId: string;
  status: EmailStatus;
  errorMessage?: string;
  manager?: EntityManager;
}

/** Payload emitted when a password reset email is requested. */
export interface PasswordResetEvent {
  email: string;
  token: string;
  emailId: string;
}

/** Payload for email change verification events. */
export interface EmailChangeVerificationEvent {
  email: string;
  token: string;
  emailId: string;
}
