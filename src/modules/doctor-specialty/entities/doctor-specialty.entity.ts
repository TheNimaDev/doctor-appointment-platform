import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Doctor } from '@/modules/doctor/entities';
import { Specialty } from '@/modules/specialty/entities';

@Entity('doctor_specialties')
@Unique(['doctorId', 'specialtyId'])
@Index(['doctorId'])
@Index(['specialtyId'])
export class DoctorSpecialty {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  doctorId: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.doctorSpecialties, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  @Column({ type: 'uuid' })
  specialtyId: string;

  @ManyToOne(() => Specialty, (specialty) => specialty.doctorSpecialties, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'specialtyId' })
  specialty: Specialty;

  @Column({ type: 'boolean', default: false })
  isPrimary: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
