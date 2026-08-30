import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TimeSlotStatus } from '../enums';

@Entity('time_slots')
@Index(['scheduleId', 'date', 'startTime'], { unique: true })
export class TimeSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  scheduleId: string;

  @Column({ type: 'uuid' })
  doctorId: string;

  @Column({ type: 'uuid' })
  clinicId: string;

  @Index()
  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Index()
  @Column({
    type: 'enum',
    enum: TimeSlotStatus,
    default: TimeSlotStatus.AVAILABLE,
  })
  status: TimeSlotStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
