import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Appointment } from '@/modules/appointment/entities';
import { PrescriptionItem } from './prescription-item.entity';

@Entity('prescriptions')
@Unique(['appointmentId'])
export class Prescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  appointmentId: string;

  @OneToOne(() => Appointment, (appointment) => appointment.prescription, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'appointmentId' })
  appointment: Appointment;

  @OneToMany(() => PrescriptionItem, (prescriptionItem) => prescriptionItem.prescription)
  items: PrescriptionItem[];

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'uuid', nullable: true })
  pdfFileId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
