import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { DayOfWeek, ScheduleStatus } from '../enums';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
