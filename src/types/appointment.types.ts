import { EntityManager } from 'typeorm';
import { Appointment } from '@/modules/appointment/entities';
import { AppointmentStatus } from '@/modules/appointment/enums';

/** Appointment without relation data. */
export type SafeAppointment = Omit<Appointment, 'timeSlot' | 'patient'>;

/** Appointment API response. */
export interface AppointmentResponse {
  appointment: SafeAppointment;
}

/** Multiple Appointments API response. */
export interface AppointmentsResponse {
  appointments: SafeAppointment[];
}

/** Parameters required to reserve an appointment. */
export interface ReserveAppointmentPayload {
  patientId: string;
  timeSlotId: string;
  notes?: string;
}

/** Parameters required to find an appointment by ID. */
export interface FindAppointmentByIdPayload {
  id: string;
  manager?: EntityManager;
}

/** Parameters required to find a admin clinic's appointments. */
export interface FindMyClinicAppointmentsPayload {
  ownerId: string;
  status?: AppointmentStatus;
  manager?: EntityManager;
}

/** Parameters required to find a admin clinic's appointment by ID. */
export interface FindMyClinicAppointmentPayload {
  id: string;
  ownerId: string;
  status?: AppointmentStatus;
  manager?: EntityManager;
}

/** Parameters required to find all appointments. */
export interface FindAppointmentsPayload {
  status?: AppointmentStatus;
  manager?: EntityManager;
}

/** Parameters required to find a patient's appointments. */
export interface FindPatientAppointmentsPayload {
  userId: string;
  manager?: EntityManager;
}

/** Parameters required to find a doctor's appointments. */
export interface FindDoctorAppointmentsPayload {
  userId: string;
  manager?: EntityManager;
}

/** Parameters required to find a doctor's appointment by ID. */
export interface FindDoctorAppointmentByIdPayload {
  id: string;
  userId: string;
  manager?: EntityManager;
}

/** Parameters required to find a patient's appointment by ID. */
export interface FindPatientAppointmentByIdPayload {
  id: string;
  userId: string;
  manager?: EntityManager;
}

/** Parameters required to handle an appointment status change. */
export interface HandleAppointmentStatusPayload {
  id: string;
  status: AppointmentStatus;
  reason?: string;
}

/** Parameters required to update an appointment's status. */
export interface UpdateAppointmentStatusPayload {
  id: string;
  status: AppointmentStatus;
  reason?: string;
  manager?: EntityManager;
}
