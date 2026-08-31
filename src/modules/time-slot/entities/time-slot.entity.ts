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

import { TimeSlotStatus } from '../enums';
import { DoctorSchedule } from '@/modules/doctor-schedule/entities';
import { Doctor } from '@/modules/doctor/entities';
import { Clinic } from '@/modules/clinic/entities';
import { Appointment } from '@/modules/appointment/entities';

@Entity('time_slots')
@Unique(['scheduleId', 'date', 'startTime'])
@Index(['doctorId', 'date', 'status'])
export class TimeSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  scheduleId: string;

  @ManyToOne(() => DoctorSchedule, (schedule) => schedule.timeSlots)
  @JoinColumn({ name: 'scheduleId' })
  schedule: DoctorSchedule;

  @Column({ type: 'uuid' })
  doctorId: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.timeSlots)
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  @Column({ type: 'uuid' })
  clinicId: string;

  @ManyToOne(() => Clinic, (clinic) => clinic.timeSlots)
  @JoinColumn({ name: 'clinicId' })
  clinic: Clinic;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({
    type: 'enum',
    enum: TimeSlotStatus,
    default: TimeSlotStatus.AVAILABLE,
  })
  status: TimeSlotStatus;

  @OneToMany(() => Appointment, (appointment) => appointment.timeSlot)
  appointments: Appointment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
