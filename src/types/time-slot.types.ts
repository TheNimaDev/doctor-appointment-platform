import { EntityManager } from 'typeorm';
import { TimeSlot } from '@/modules/time-slot/entities';
import { TimeSlotStatus } from '@/modules/time-slot/enums';

/** TimeSlot without relation data. */
export type SafeTimeSlot = Omit<TimeSlot, 'schedule' | 'doctor' | 'clinic'>;

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
  doctorId: string;
  clinicId: string;
  date: string;
  startTime: string;
  endTime: string;
  status?: TimeSlotStatus;
  manager?: EntityManager;
}

/** Parameters for finding a time slot by ID. */
export interface FindTimeSlotByIdPayload {
  id: string;
  manager?: EntityManager;
}

/** Parameters for finding all time slots belonging to a doctor on a specific date. */
export interface FindTimeSlotsByDoctorAndDatePayload {
  doctorId: string;
  date: string;
  manager?: EntityManager;
}

/** Parameters for finding available time slots belonging to a doctor on a specific date. */
export interface FindAvailableTimeSlotsPayload {
  doctorId: string;
  date: string;
  manager?: EntityManager;
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
