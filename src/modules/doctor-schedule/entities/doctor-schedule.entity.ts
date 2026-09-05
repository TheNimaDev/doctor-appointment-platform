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
import { DoctorClinic } from '@/modules/doctor-clinic/entities';
import { TimeSlot } from '@/modules/time-slot/entities';

@Entity('doctor_schedules')
@Index(['doctorClinicId'])
@Index(['dayOfWeek'])
@Index(['status'])
@Unique(['doctorClinicId', 'dayOfWeek', 'startTime', 'endTime'])
export class DoctorSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  doctorClinicId: string;

  @ManyToOne(() => DoctorClinic, (doctorClinic) => doctorClinic.doctorSchedules, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'doctorClinicId' })
  doctorClinic: DoctorClinic;

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
