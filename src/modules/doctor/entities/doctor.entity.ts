import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { DoctorStatus } from '../enums';
import { User } from '@/modules/user/entities';
import { DoctorSpecialty } from './doctor-specialty.entity';
import { Clinic } from '@/modules/clinic/entities';

@Entity('doctors')
@Index(['status'])
@Index(['ratingAverage'])
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  userId: string;

  @OneToOne(() => User, (user) => user.doctor, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => DoctorSpecialty, (doctorSpecialty) => doctorSpecialty.doctor)
  doctorSpecialties: DoctorSpecialty[];

  @OneToMany(() => Clinic, (clinic) => clinic.doctor)
  clinics: Clinic[];

  @Column({ type: 'varchar', length: 50, unique: true })
  medicalCode: string;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ type: 'int' })
  experienceYears: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  consultationFee: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  ratingAverage: string;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @Column({ type: 'enum', enum: DoctorStatus, default: DoctorStatus.PENDING_VERIFICATION })
  status: DoctorStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
