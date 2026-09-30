import { EntityManager } from 'typeorm';
import { MedicalRecord } from '@/modules/medical-record/entities';

/** MedicalRecord without relation data. */
export type SafeMedicalRecord = Omit<MedicalRecord, 'appointment'>;

/** Single medical record API response. */
export interface MedicalRecordResponse {
  medicalRecord: SafeMedicalRecord;
}

/** Multiple medical record API response. */
export interface MedicalRecordsResponse {
  medicalRecords: SafeMedicalRecord[];
}

/** Parameters for creating a medical record. */
export interface CreateMedicalRecordPayload {
  userId: string;
  appointmentId: string;
  diagnosis: string;
  description?: string | null;
  notes?: string | null;
  manager?: EntityManager;
}

/** Parameters for finding a medical record by ID. */
export interface FindMedicalRecordByIdPayload {
  id: string;
  manager?: EntityManager;
}

/** Parameters for finding medical records. */
export interface FindMedicalRecordsPayload {
  manager?: EntityManager;
}

/** Parameters for finding a medical record by appointment ID. */
export interface FindMedicalRecordByAppointmentIdPayload {
  appointmentId: string;
  manager?: EntityManager;
}

/** Parameters required to find a patient's medical records. */
export interface FindPatientMedicalRecordsPayload {
  userId: string;
  manager?: EntityManager;
}

/** Parameters required to find a patient's medical record by ID. */
export interface FindPatientMedicalRecordByIdPayload {
  id: string;
  userId: string;
  manager?: EntityManager;
}

/** Parameters required to find a patient's medical record by appointment ID. */
export interface FindPatientMedicalRecordByAppointmentIdPayload {
  appointmentId: string;
  userId: string;
  manager?: EntityManager;
}

/** Parameters required to find a doctor's medical records. */
export interface FindDoctorMedicalRecordsPayload {
  userId: string;
  manager?: EntityManager;
}

/** Parameters required to find a doctor's medical record by ID. */
export interface FindDoctorMedicalRecordByIdPayload {
  id: string;
  userId: string;
  manager?: EntityManager;
}

/** Parameters required to find a doctor's medical record by appointment ID. */
export interface FindDoctorMedicalRecordByAppointmentIdPayload {
  appointmentId: string;
  userId: string;
  manager?: EntityManager;
}

/** Parameters required to find a clinic admin's medical records. */
export interface FindClinicAdminMedicalRecordsPayload {
  userId: string;
  manager?: EntityManager;
}

/** Parameters required to find a clinic admin's medical record by ID. */
export interface FindClinicAdminMedicalRecordByIdPayload {
  id: string;
  userId: string;
  manager?: EntityManager;
}

/** Parameters required to find a clinic admin's medical record by appointment ID. */
export interface FindClinicAdminMedicalRecordByAppointmentIdPayload {
  appointmentId: string;
  userId: string;
  manager?: EntityManager;
}

/** Parameters for updating a medical record. */
export type UpdateMedicalRecordPayload = MedicalRecordIdentifier & {
  userId: string;
  diagnosis?: string;
  description?: string | null;
  notes?: string | null;
  manager?: EntityManager;
};

/** Parameters for deleting a medical record. */
export type DeleteMedicalRecordPayload = MedicalRecordIdentifier & {
  userId: string;
  manager?: EntityManager;
};

/**
 * Identifies a medical record by either medical record ID or appointment ID.
 */
export type MedicalRecordIdentifier =
  | {
      medicalRecordId: string;
      appointmentId?: never;
    }
  | {
      appointmentId: string;
      medicalRecordId?: never;
    };

/**
 * Parameters for resolving a medical record by medical record ID or appointment ID.
 */
export type ResolveMedicalRecordPayload = MedicalRecordIdentifier & {
  userId: string;
  manager?: EntityManager;
};
