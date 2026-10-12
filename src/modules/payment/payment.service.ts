import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { checkDatabaseError } from '@/lib';
import {
  BaseException,
  CreatePaymentPayload,
  FindPaymentByAppointmentIdPayload,
  FindPaymentByIdPayload,
  PaymentResponse,
  UpdatePaymentStatusPayload,
} from '@/types';
import { PaymentStatus } from './enums';
import { Payment } from './entities';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  /**
   * Get the appropriate Payment repository.
   *
   * - Uses the transaction manager repository when provided.
   * - Falls back to the default repository otherwise.
   */
  private getRepository(manager?: EntityManager): Repository<Payment> {
    return manager?.getRepository(Payment) ?? this.paymentRepository;
  }

  /**
   * Create a new payment.
   */
  async create(payload: CreatePaymentPayload): Promise<PaymentResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const payment = repository.create({
        appointmentId: payload.appointmentId,
        amount: payload.amount,
        status: PaymentStatus.PENDING,
      });

      const savedPayment = await repository.save(payment);

      return {
        payment: savedPayment,
      };
    } catch (error) {
      checkDatabaseError({
        e: error as Error,
        mainResource: 'Payment',
      });
    }
  }

  /**
   * Find a payment by ID.
   */
  async findById(payload: FindPaymentByIdPayload): Promise<PaymentResponse> {
    const repository = this.getRepository(payload.manager);

    const payment = await repository.findOne({
      where: {
        id: payload.id,
      },
    });

    if (!payment) {
      throw new NotFoundException({
        message: 'Payment not found in database.',
        error: 'Payment Not Found',
      } as BaseException);
    }

    return {
      payment,
    };
  }

  /**
   * Find a payment by appointment ID.
   */
  async findByAppointmentId(payload: FindPaymentByAppointmentIdPayload): Promise<PaymentResponse> {
    const repository = this.getRepository(payload.manager);

    const payment = await repository.findOne({
      where: {
        appointmentId: payload.appointmentId,
      },
    });

    if (!payment) {
      throw new NotFoundException({
        message: 'Payment not found in database.',
        error: 'Payment Not Found',
      } as BaseException);
    }

    return {
      payment,
    };
  }

  /**
   * Update a payment status.
   */
  async updateStatus(payload: UpdatePaymentStatusPayload): Promise<PaymentResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const payment = await repository.preload({
        id: payload.id,
        status: payload.status,
        ...(payload.paidAt !== undefined && {
          paidAt: payload.paidAt,
        }),
      });

      if (!payment) {
        throw new NotFoundException({
          message: 'Payment not found in database.',
          error: 'Payment Not Found',
        } as BaseException);
      }

      const savedPayment = await repository.save(payment);

      return {
        payment: savedPayment,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'Payment',
      });
    }
  }
}
