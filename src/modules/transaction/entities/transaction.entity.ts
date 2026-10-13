import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { TransactionStatus } from '../enums';

@Entity('transactions')
@Index(['paymentId'])
@Index(['status'])
@Unique(['gateway', 'transactionId'])
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  paymentId: string;

  @Column({ type: 'varchar', length: 255 })
  transactionId: string;

  @Column({ type: 'varchar', length: 50 })
  gateway: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: string;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  referenceId: string | null;

  @Column({ type: 'json', nullable: true })
  response: Record<string, unknown> | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
