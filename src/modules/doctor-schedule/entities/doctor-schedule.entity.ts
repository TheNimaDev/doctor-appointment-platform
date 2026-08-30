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

import { DayOfWeek, ScheduleStatus } from '../enums';
import { Clinic } from '@/modules/clinic/entities';
import { TimeSlot } from '@/modules/time-slot/entities';

@Entity('doctor_schedules')
@Index(['clinicId'])
@Index(['dayOfWeek'])
@Index(['status'])
@Unique(['clinicId', 'dayOfWeek', 'startTime', 'endTime'])
export class DoctorSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  clinicId: string;

  @ManyToOne(() => Clinic, (clinic) => clinic.doctorSchedules, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'clinicId' })
  clinic: Clinic;

  @Column({
    type: 'enum',
    enum: DayOfWeek,
  })
  dayOfWeek: DayOfWeek;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'int' })
  slotDuration: number;

  @Column({
    type: 'enum',
    enum: ScheduleStatus,
    default: ScheduleStatus.ACTIVE,
  })
  status: ScheduleStatus;

  @OneToMany(() => TimeSlot, (timeSlot) => timeSlot.schedule)
  timeSlots: TimeSlot[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
