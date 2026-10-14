import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Transaction } from './entities';
import { checkDatabaseError } from '@/lib';
import { PaymentService } from '@/modules/payment/payment.service';
import {
  BaseException,
  CreateTransactionPayload,
  FindTransactionByIdPayload,
  FindTransactionsByPaymentIdPayload,
  FindTransactionsPayload,
  TransactionResponse,
  TransactionsResponse,
  ZibalRequestPayload,
} from '@/types';
import { HttpService } from '@/modules/http/http.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly paymentService: PaymentService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Get the appropriate Transaction repository.
   *
   * - Uses the transaction manager repository when provided.
   * - Falls back to the default repository otherwise.
   */
  private getRepository(manager?: EntityManager): Repository<Transaction> {
    return manager?.getRepository(Transaction) ?? this.transactionRepository;
  }

  /**
   * Create a Transaction.
   */
  async createTransaction(payload: CreateTransactionPayload): Promise<TransactionResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const { payment } = await this.paymentService.findById({
        id: payload.paymentId,
        manager: payload.manager,
      });

      const transaction = repository.create({
        paymentId: payment.id,
        gateway: payload.gateway,
        amount: payment.amount,
      });

      const url = new URL('/v1/request', this.configService.getOrThrow<string>('ZIBAL_URL')).toString();

      const result = await this.httpService.post<ZibalRequestPayload>({
        url,
        data: {
          merchant: this.configService.getOrThrow('ZIBAL_MERCHANT_ID'),
          callbackUrl: this.configService.getOrThrow('ZIBAL_CALLBACK_URL'),
          amount: Number(transaction.amount),
          description: `Payment for appointment ${payment.appointmentId} and transaction ${transaction.id}`,
        },
      });
      transaction.trackId = result!.trackId;

      const saved = await repository.save(transaction);

      return {
        transaction: saved,
      };
    } catch (error) {
      checkDatabaseError({
        e: error as Error,
        mainResource: 'Transaction',
      });
    }
  }

  /**
   * Get a Transaction by ID.
   */
  async getById(payload: FindTransactionByIdPayload): Promise<TransactionResponse> {
    const repository = this.getRepository(payload.manager);

    const transaction = await repository.findOne({
      where: {
        id: payload.id,
      },
    });

    if (!transaction) {
      throw new NotFoundException({
        message: 'Transaction not found in database.',
        error: 'Transaction Not Found',
      } as BaseException);
    }

    return {
      transaction,
    };
  }

  /**
   * Find all Transactions by payment ID.
   */
  async findByPaymentId(payload: FindTransactionsByPaymentIdPayload): Promise<TransactionsResponse> {
    const repository = this.getRepository(payload.manager);

    const transactions = await repository.find({
      where: {
        paymentId: payload.paymentId,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      transactions,
    };
  }

  /**
   * Find all Transactions.
   */
  async findAll(payload: FindTransactionsPayload): Promise<TransactionsResponse> {
    const repository = this.getRepository(payload.manager);

    const transactions = await repository.find({
      where: {
        ...(payload.status !== undefined && {
          status: payload.status,
        }),
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      transactions,
    };
  }
}
