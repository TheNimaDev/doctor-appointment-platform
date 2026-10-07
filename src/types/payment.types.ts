import { EntityManager } from 'typeorm';
import { Payment } from '@/modules/payment/entities';
import { PaymentStatus } from '@/modules/payment/enums';

/** Payment without relation data. */
export type SafePayment = Omit<Payment, 'appointment'>;

/** Single payment API response. */
export interface PaymentResponse {
  payment: SafePayment;
}

/** Multiple payments API response. */
export interface PaymentsResponse {
  payments: SafePayment[];
}

/** Parameters for creating a payment. */
export interface CreatePaymentPayload {
  appointmentId: string;
  amount: string;
  gateway: string;
  manager?: EntityManager;
}

/** Parameters for finding a payment by ID. */
export interface FindPaymentByIdPayload {
  id: string;
  manager?: EntityManager;
}

/** Parameters for finding a payment by appointment ID. */
export interface FindPaymentByAppointmentIdPayload {
  appointmentId: string;
  manager?: EntityManager;
}

/** Parameters for updating a payment status. */
export interface UpdatePaymentStatusPayload {
  id: string;
  status: PaymentStatus;
  paidAt?: Date | null;
  manager?: EntityManager;
}
