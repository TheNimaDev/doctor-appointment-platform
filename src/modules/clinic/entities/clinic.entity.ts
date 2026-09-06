import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { ClinicStatus } from '../enums';
import { User } from '@/modules/user/entities';
import { DoctorClinic } from '@/modules/doctor-clinic/entities';
import { TimeSlot } from '@/modules/time-slot/entities';

@Entity('clinics')
@Unique(['ownerId'])
@Index(['ownerId'])
@Index(['city'])
@Index(['status'])
export class Clinic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  ownerId: string;

  @ManyToOne(() => User, (user) => user.clinic, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @OneToMany(() => DoctorClinic, (doctorClinic) => doctorClinic.clinic)
  doctorClinics: DoctorClinic[];

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: string | null;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: ClinicStatus, default: ClinicStatus.PENDING })
  status: ClinicStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
