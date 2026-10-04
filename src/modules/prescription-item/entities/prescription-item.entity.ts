import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Prescription } from '@/modules/prescription/entities';

@Entity('prescription_items')
@Index(['prescriptionId'])
export class PrescriptionItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  prescriptionId: string;

  @ManyToOne(() => Prescription, (prescription) => prescription.items, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'prescriptionId' })
  prescription: Prescription;

  @Column({ type: 'varchar', length: 255 })
  medicineName: string;

  @Column({ type: 'varchar', length: 100 })
  dosage: string;

  @Column({ type: 'text' })
  usage: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  duration: string | null;

  @Column({ type: 'int', nullable: true })
  quantity: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
