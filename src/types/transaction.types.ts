import { EntityManager } from 'typeorm';
import { Transaction } from '@/modules/transaction/entities';
import { TransactionStatus } from '@/modules/transaction/enums';

/** Transaction without relation data. */
export type SafeTransaction = Omit<Transaction, 'payment'>;

/** Single transaction API response. */
export interface TransactionResponse {
  transaction: SafeTransaction;
}

/** Multiple transactions API response. */
export interface TransactionsResponse {
  transactions: SafeTransaction[];
}

/** Parameters for creating a transaction. */
export interface CreateTransactionPayload {
  paymentId: string;
  gateway: string;
  manager?: EntityManager;
}

/** Parameters for finding a transaction by ID. */
export interface FindTransactionByIdPayload {
  id: string;
  manager?: EntityManager;
}

/** Parameters for finding transactions by payment ID. */
export interface FindTransactionsByPaymentIdPayload {
  paymentId: string;
  manager?: EntityManager;
}

/** Parameters for finding all transactions. */
export interface FindTransactionsPayload {
  status?: TransactionStatus;
  manager?: EntityManager;
}
