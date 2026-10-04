import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('prescriptions')
@Unique(['appointmentId'])
export class Prescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  appointmentId: string;

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
