import { getBaseOkResponseSchema, getValidationErrorResponse, getNormalErrorResponse } from '@/common/swagger';
import type { TransactionResponse } from '@/types';
import { transactionResponseSchema } from './transaction.response';

const path = 'transactions';

export class CreateTransactionResponse extends getBaseOkResponseSchema<TransactionResponse>({
  path,
  create: true,
  response: {
    message: 'Transaction created successfully.',
    data: transactionResponseSchema,
  },
}) {}

export class CreateTransactionBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    { field: 'transactionId', error: 'Transaction ID is required.' },
    { field: 'gateway', error: 'Gateway is required.' },
    { field: 'amount', error: 'Amount is required.' },
  ],
}) {}

export class CreateTransactionNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Payment not found in database.',
  error: 'Payment Not Found',
}) {}
