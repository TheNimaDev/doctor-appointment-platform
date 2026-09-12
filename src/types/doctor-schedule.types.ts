import { EntityManager } from 'typeorm';
import { DoctorSchedule } from '@/modules/doctor-schedule/entities';
import { DayOfWeek, ScheduleStatus } from '@/modules/doctor-schedule/enums';
import { DoctorIdentifier, DoctorOrClinicOwnerIdentifier } from './doctor.types';

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
export type CreateDoctorSchedulePayload = {
  userId: string;
  clinicId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  slotDuration: number;
  manager?: EntityManager;
};

/** Parameters for updating a doctor schedule. */
export type UpdateDoctorSchedulePayload = DoctorOrClinicOwnerIdentifier & {
  id: string;
  dayOfWeek?: DayOfWeek;
  startTime?: string;
  endTime?: string;
  slotDuration?: number;
  manager?: EntityManager;
};

/** Parameters for finding a doctor active schedule by ID. */
export interface FindActiveDoctorScheduleByIdPayload {
  id: string;
  manager?: EntityManager;
}

/** Parameters for finding a doctor schedule by ID. */
export type FindDoctorScheduleByIdPayload = DoctorOrClinicOwnerIdentifier & {
  id: string;
  manager?: EntityManager;
};

/** Parameters for finding active clinic schedules. */
export type FindActiveClinicSchedulesPayload = {
  clinicId: string;
  manager?: EntityManager;
};

/** Parameters for finding clinic schedules. */
export type FindClinicSchedulesPayload = {
  userId: string;
  manager?: EntityManager;
};

/** Parameters for finding active doctor schedules. */
export type FindActiveDoctorSchedulesPayload = DoctorIdentifier & {
  manager?: EntityManager;
};

/** Parameters for finding doctor schedules. */
export type FindDoctorSchedulesPayload = {
  userId: string;
  manager?: EntityManager;
};

/** Parameters for finding active doctor-clinic schedules. */
export type FindActiveDoctorClinicSchedulesPayload = DoctorIdentifier & {
  clinicId: string;
  manager?: EntityManager;
};

/** Parameters for finding doctor-clinic schedules. */
export type FindDoctorClinicSchedulesPayload =
  | {
      userId: string;
      clinicId: string;
      clinicOwnerId?: never;
      doctorId?: never;
      manager?: EntityManager;
    }
  | {
      userId?: never;
      clinicId?: never;
      clinicOwnerId: string;
      doctorId: string;
      manager?: EntityManager;
    };

/** Parameters for updating a doctor schedule status. */
export type UpdateDoctorScheduleStatusPayload = DoctorOrClinicOwnerIdentifier & {
  id: string;
  status: ScheduleStatus;
  manager?: EntityManager;
};

/** Parameters for deleting a doctor schedule. */
export type DeleteDoctorSchedulePayload = DoctorOrClinicOwnerIdentifier & {
  id: string;
  manager?: EntityManager;
};

/** Parameters for finding all doctor schedules. */
export interface FindAllDoctorSchedulesPayload {
  status?: ScheduleStatus;
  manager?: EntityManager;
}
