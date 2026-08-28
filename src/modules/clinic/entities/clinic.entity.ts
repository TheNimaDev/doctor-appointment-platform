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
import { Doctor } from '@/modules/doctor/entities';
import { DoctorSchedule } from '@/modules/doctor-schedule/entities';

@Entity('clinics')
@Unique(['doctorId', 'name'])
@Index(['doctorId'])
@Index(['city'])
@Index(['status'])
export class Clinic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  doctorId: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.clinics, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  @OneToMany(() => DoctorSchedule, (doctorSchedule) => doctorSchedule.clinic)
  doctorSchedules: DoctorSchedule[];

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

  @Column({ type: 'enum', enum: ClinicStatus, default: ClinicStatus.ACTIVE })
  status: ClinicStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
