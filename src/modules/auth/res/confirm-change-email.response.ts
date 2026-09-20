import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';

const path = 'auth/email/change/confirm';

/** Swagger response schema for successfully changing the email address. */
export class ConfirmChangeEmailResponse extends getBaseOkResponseSchema<void>({
  path,
  response: {
    message: 'Email address changed successfully.',
  },
}) {}

/** Swagger response schema for an invalid or expired email change token. */
export class ConfirmChangeEmailBadRequestResponse extends getNormalErrorResponse({
  message: 'Invalid or expired email token.',
  error: 'Invalid Token',
  path,
  statusCode: 400,
}) {}

/** Swagger response schema for an email address that is already in use. */
export class ConfirmChangeEmailConflictResponse extends getNormalErrorResponse({
  message: 'Email address is already in use.',
  error: 'Email Already Exists',
  path,
  statusCode: 409,
}) {}
