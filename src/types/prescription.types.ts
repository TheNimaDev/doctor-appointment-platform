import { EntityManager } from 'typeorm';
import { Prescription } from '@/modules/prescription/entities';

/** Prescription without relation data. */
export type SafePrescription = Omit<Prescription, 'appointment'>;

/** Single prescription API response. */
export interface PrescriptionResponse {
  prescription: SafePrescription;
}

/** Multiple prescription API response. */
export interface PrescriptionsResponse {
  prescriptions: SafePrescription[];
}

/** Parameters for creating a prescription. */
export interface CreatePrescriptionPayload {
  appointmentId: string;
  notes?: string | null;
  manager?: EntityManager;
}

/** Parameters for finding a prescription by ID. */
export interface GetPrescriptionByIdPayload {
  id: string;
  manager?: EntityManager;
}

/** Parameters for finding prescriptions. */
export interface FindPrescriptionsPayload {
  manager?: EntityManager;
}

/** Parameters for finding a prescription by appointment ID. */
export interface GetPrescriptionByAppointmentIdPayload {
  appointmentId: string;
  manager?: EntityManager;
}

/** Parameters required to find a patient's prescriptions. */
export interface FindPatientPrescriptionsPayload {
  patientId: string;
  manager?: EntityManager;
}

/** Parameters required to find a doctor's prescriptions. */
export interface FindDoctorPrescriptionsPayload {
  doctorId: string;
  manager?: EntityManager;
}

/** Parameters required to find a clinic admin's prescriptions. */
export interface FindClinicAdminPrescriptionsPayload {
  clinicId: string;
  manager?: EntityManager;
}

/** Parameters for updating a prescription. */
export interface UpdatePrescriptionPayload {
  id: string;
  notes?: string | null;
  manager?: EntityManager;
}

/** Parameters for deleting a prescription. */
export interface DeletePrescriptionPayload {
  id: string;
  manager?: EntityManager;
}
