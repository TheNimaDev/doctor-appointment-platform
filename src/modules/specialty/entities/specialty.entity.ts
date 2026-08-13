import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SpecialtyStatus } from '../enums';
import { DoctorSpecialty } from '@/modules/doctor-specialty/entities';

@Entity('specialties')
@Index(['status'])
export class Specialty {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  icon: string | null;

  @Column({ type: 'enum', enum: SpecialtyStatus, default: SpecialtyStatus.ACTIVE })
  status: SpecialtyStatus;

  @OneToMany(() => DoctorSpecialty, (doctorSpecialty) => doctorSpecialty.specialty)
  doctorSpecialties: DoctorSpecialty[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
