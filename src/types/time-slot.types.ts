import { EntityManager } from 'typeorm';
import { TimeSlot } from '@/modules/time-slot/entities';
import { TimeSlotStatus } from '@/modules/time-slot/enums';
import { DoctorScheduleResponse } from './doctor-schedule.types';

/** TimeSlot without relation data. */
export type SafeTimeSlot = Omit<TimeSlot, 'schedule' | 'appointments'>;

/** TimeSlot API response. */
export interface TimeSlotResponse {
  timeSlot: SafeTimeSlot;
}

/** Multiple TimeSlots API response. */
export interface TimeSlotsResponse {
  timeSlots: SafeTimeSlot[];
}

/** Parameters for creating a new time slot. */
export interface CreateTimeSlotPayload {
  scheduleId: string;
  date: string;
  startTime: string;
  endTime: string;
  status?: TimeSlotStatus;
  manager?: EntityManager;
}

/** Parameters for generating time slots. */
export interface GenerateTimeSlotsPayload extends DoctorScheduleResponse {
  date: string;
}

/** Parameters for ensuring time slots. */
export interface EnsureTimeSlotsPayload {
  doctorId: string;
  startDate: string;
  endDate: string;
  manager?: EntityManager;
}

/** Parameters for getting a time slot by ID. */
export interface GetTimeSlotByIdPayload {
  id: string;
  status?: TimeSlotStatus;
  manager?: EntityManager;
}

/** Parameters for finding time slots by clinic and doctor. */
export interface FindTimeSlotsByClinicAndDoctorPayload {
  doctorId: string;
  clinicId: string;
  date?: string;
  status?: TimeSlotStatus;
  manager?: EntityManager;
}

/** Parameters for finding all time slots by clinic or doctor. */
export type FindTimeSlotsByClinicOrDoctorPayload = TimeSlotIdentifier & {
  date?: string;
  status?: TimeSlotStatus;
  manager?: EntityManager;
};

/** Parameters for updating a time slot's status within a transaction. */
export interface UpdateTimeSlotStatusHandlerPayload {
  id: string;
  status: TimeSlotStatus;
}

/** Parameters for updating a time slot's status. */
export interface UpdateTimeSlotStatusPayload {
  id: string;
  status: TimeSlotStatus;
  manager?: EntityManager;
}

/** Parameters for deleting a time slot. */
export interface DeleteTimeSlotPayload {
  id: string;
  manager?: EntityManager;
}

/**
 * Identifies a time slot by either clinic ID or doctor ID.
 */
export type TimeSlotIdentifier =
  | {
      clinicId: string;
      doctorId?: never;
    }
  | {
      clinicId?: never;
      doctorId: string;
    };
