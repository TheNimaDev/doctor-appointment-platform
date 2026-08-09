import { EmailStatus, EmailType } from '@/modules/email/enums';
import { EntityManager } from 'typeorm';

/** Parameters required to create an email token. */
export interface CreateEmailParams {
  userId: string;
  manager?: EntityManager;
  type: EmailType;
}

/** Result returned after creating an email token. */
export interface CreateEmailOutput {
  token: string;
  emailId: string;
}

/** Parameters required to validate an email token. */
export interface ValidateEmailTokenParams {
  token: string;
  manager?: EntityManager;
  type: EmailType;
}

/** Payload emitted when signup email verification is requested. */
export interface SignupVerificationEvent {
  email: string;
  token: string;
}

/** Parameters required to find an active email token. */
export interface FindActiveEmailParams {
  userId: string;
  manager?: EntityManager;
  type: EmailType;
}

/** Parameters required to update an email delivery status. */
export interface UpdateEmailStatusParams {
  emailId: string;
  status: EmailStatus;
  errorMessage?: string;
}
