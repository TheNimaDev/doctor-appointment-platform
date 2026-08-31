import { EntityManager } from 'typeorm';
import { Appointment } from '@/modules/appointment/entities';
import { AppointmentStatus } from '@/modules/appointment/enums';

/** Appointment without relation data. */
export type SafeAppointment = Omit<Appointment, 'timeSlot'>;

/** Appointment API response. */
export interface AppointmentResponse {
  appointment: SafeAppointment;
}

/** Multiple Appointments API response. */
export interface AppointmentsResponse {
  appointments: SafeAppointment[];
}

/** Parameters required to create an appointment. */
export interface CreateAppointmentPayload {
  patientId: string;
  timeSlotId: string;
  notes?: string;
  manager?: EntityManager;
}

/** Parameters required to find an appointment by ID. */
export interface FindAppointmentByIdPayload {
  id: string;
  manager?: EntityManager;
}

/** Parameters required to find all appointments. */
export interface FindAppointmentsPayload {
  manager?: EntityManager;
}