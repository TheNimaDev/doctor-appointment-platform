import { EntityManager } from 'typeorm';
import { TimeSlot } from '@/modules/time-slot/entities';
import { TimeSlotStatus } from '@/modules/time-slot/enums';

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

/** Parameters for finding a time slot by ID. */
export interface FindTimeSlotByIdPayload {
  id: string;
  manager?: EntityManager;
}

/** Parameters for finding available time slots for a doctor. */
export interface FindAvailableByDoctorPayload {
  doctorId: string;
  date?: string;
  manager?: EntityManager;
}

/** Parameters for finding available time slots for a doctor in a clinic. */
export interface FindAvailableByDoctorAndClinicPayload {
  doctorId: string;
  clinicId: string;
  date?: string;
  manager?: EntityManager;
}

/** Parameters for finding available time slots for a clinic. */
export interface FindAvailableByClinicPayload {
  clinicId: string;
  date?: string;
  manager?: EntityManager;
}

/** Parameters for finding the authenticated doctor's time slots. */
export interface FindMyTimeSlotsPayload {
  userId: string;
  date?: string;
  manager?: EntityManager;
}

/** Parameters for finding the authenticated doctor's time slots in a clinic. */
export interface FindMyByClinicTimeSlotsPayload {
  userId: string;
  clinicId: string;
  date?: string;
  manager?: EntityManager;
}

/** Parameters for finding all time slots in the authenticated admin's clinic. */
export interface FindMyClinicTimeSlotsPayload {
  userId: string;
  date?: string;
  manager?: EntityManager;
}

/** Parameters for finding a doctor's time slots in the authenticated admin's clinic. */
export interface FindMyClinicDoctorTimeSlotsPayload {
  userId: string;
  doctorId: string;
  date?: string;
  manager?: EntityManager;
}

/** Parameters for finding a time slot in the authenticated admin's clinic. */
export interface GetMyClinicTimeSlotPayload {
  id: string;
  userId: string;
  manager?: EntityManager;
}

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
