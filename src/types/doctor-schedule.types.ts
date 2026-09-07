import { EntityManager } from 'typeorm';
import { DoctorSchedule } from '@/modules/doctor-schedule/entities';
import { DayOfWeek, ScheduleStatus } from '@/modules/doctor-schedule/enums';
import { DoctorIdentifier } from './doctor.types';

/** Doctor schedule without relation data. */
export type SafeDoctorSchedule = Omit<DoctorSchedule, 'doctorClinic' | 'timeSlots'>;

/** Doctor schedule API response. */
export interface DoctorScheduleResponse {
  doctorSchedule: SafeDoctorSchedule;
}

/** Multiple doctor schedules API response. */
export interface DoctorSchedulesResponse {
  doctorSchedules: SafeDoctorSchedule[];
}

/** Parameters for creating a doctor schedule. */
export type CreateDoctorSchedulePayload = DoctorIdentifier & {
  clinicId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  slotDuration: number;
  manager?: EntityManager;
};

/** Parameters for updating a doctor schedule. */
export type UpdateDoctorSchedulePayload = DoctorIdentifier & {
  id: string;
  clinicId: string;
  dayOfWeek?: DayOfWeek;
  startTime?: string;
  endTime?: string;
  slotDuration?: number;
  manager?: EntityManager;
};

/** Parameters for finding a doctor schedule by ID. */
export type FindDoctorScheduleByIdPayload = DoctorIdentifier & {
  id: string;
  clinicId: string;
  manager?: EntityManager;
};

/** Parameters for finding doctor schedules. */
export type FindDoctorSchedulesPayload = DoctorIdentifier & {
  clinicId: string;
  manager?: EntityManager;
};

/** Parameters for updating a doctor schedule status. */
export type UpdateDoctorScheduleStatusPayload = DoctorIdentifier & {
  id: string;
  clinicId: string;
  status: ScheduleStatus;
  manager?: EntityManager;
};

/** Parameters for deleting a doctor schedule. */
export type DeleteDoctorSchedulePayload = DoctorIdentifier & {
  id: string;
  clinicId: string;
  manager?: EntityManager;
};

/** Parameters for finding all doctor schedules. */
export interface FindAllDoctorSchedulesPayload {
  status?: ScheduleStatus;
  manager?: EntityManager;
}
