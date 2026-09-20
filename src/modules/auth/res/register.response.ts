import { getBaseOkResponseSchema, getValidationErrorResponse, getNormalErrorResponse } from '@/common/swagger';

const path = 'auth/register';

/** Swagger response schema for successful registration. */
export class RegisterResponse extends getBaseOkResponseSchema<void>({
  path,
  response: {
    message: 'Registration successful. Please verify your email.',
  },
}) {}

/** Swagger response schema for invalid registration request data. */
export class RegisterBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    {
      field: 'email',
      error: 'Invalid email address.',
    },
    {
      field: 'password',
      error: 'Password must be at least 8 characters.',
    },
    {
      field: 'firstName',
      error: 'First name must be at least 2 characters.',
    },
    {
      field: 'lastName',
      error: 'Last name must be at least 2 characters.',
    },
  ],
}) {}

/** Swagger response schema for conflict during registration. */
export class RegisterConflictResponse extends getNormalErrorResponse({
  message: 'A user with this email already exists.',
  error: 'Conflict',
  path,
  statusCode: 409,
}) {}
