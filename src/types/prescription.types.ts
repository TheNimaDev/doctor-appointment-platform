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

/** Prescription item Parameters. */
export interface PrescriptionItemPayload {
  medicineName: string;
  dosage: string;
  usage: string;
  duration?: string | null;
  quantity?: number | null;
}

/** Parameters for creating a prescription. */
export interface CreatePrescriptionPayload {
  appointmentId: string;
  notes?: string | null;
  items: PrescriptionItemPayload[];
}

/** Parameters for creating prescription items within a transaction. */
export interface CreatePrescriptionItemsHandlerPayload {
  items: PrescriptionItemPayload[];
  prescriptionId: string;
}

/** Parameters for creating prescription items. */
export interface CreatePrescriptionItemsPayload {
  items: PrescriptionItemPayload[];
  prescriptionId: string;
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

/** Parameters for updating a prescription item. */
export type UpdatePrescriptionItemPayload = PrescriptionItemPayload & {
  id: string;
  manager?: EntityManager;
};

/** Parameters for deleting a prescription. */
export interface DeletePrescriptionPayload {
  id: string;
  manager?: EntityManager;
}

/** Parameters for deleting a prescription item. */
export interface DeletePrescriptionItemPayload {
  id: string;
  manager?: EntityManager;
}
