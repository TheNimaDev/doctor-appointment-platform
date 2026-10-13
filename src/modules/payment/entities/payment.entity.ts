import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentStatus } from '../enums';
import { Appointment } from '@/modules/appointment/entities';
import { Transaction } from '@/modules/transaction/entities';

@Entity('payments')
@Index(['status'])
@Unique(['appointmentId'])
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  appointmentId: string;

  @OneToOne(() => Appointment, (appointment) => appointment.payment)
  @JoinColumn({ name: 'appointmentId' })
  appointment: Appointment;

  @OneToMany(() => Transaction, (transaction) => transaction.payment)
  transactions: Transaction[];

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ type: 'datetime', nullable: true })
  paidAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
