import type { TransactionResponse, TransactionsResponse } from '@/types';
import { TransactionStatus } from '../enums';

const transactionExample = {
  id: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
  paymentId: '4c6e8f1a-3d5b-4f7c-9a2e-1b3d5f7c9e0a',
  trackId: 'zibal-txn-12345',
  gateway: 'zibal',
  amount: '500000',
  referenceId: null,
  response: null,
  status: TransactionStatus.PENDING,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

export const transactionResponseSchema: TransactionResponse = {
  transaction: transactionExample,
};

export const transactionsResponseSchema: TransactionsResponse = {
  transactions: [transactionExample],
};
