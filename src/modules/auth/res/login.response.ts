import { getBaseOkResponseSchema, getValidationErrorResponse, getNormalErrorResponse } from '@/common/swagger';
import type { LoginResponse } from '@/types';
import { userResponseSchema } from '@/modules/user/res';

const path = 'auth/login';

/** Login users schema example. */
export const loginResponseSchema: LoginResponse = {
  ...userResponseSchema,
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
};

/** Swagger response schema for successful login. */
export class LoginResponseSchema extends getBaseOkResponseSchema<LoginResponse>({
  path,
  response: {
    message: 'Login successful.',
    data: loginResponseSchema,
  },
}) {}

/** Swagger response schema for unauthorized login attempts. */
export class LoginUnauthorizedResponse extends getNormalErrorResponse({
  message: 'Invalid user credentials.',
  error: 'Invalid Credentials',
  path,
  statusCode: 401,
}) {}

/** Swagger response schema for invalid login request data. */
export class LoginBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    {
      field: 'email',
      error: 'Invalid email address.',
    },
    {
      field: 'password',
      error: 'Password is required.',
    },
  ],
}) {}
