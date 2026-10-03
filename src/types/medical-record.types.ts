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
  patientId: string;
  manager?: EntityManager;
}

/** Parameters required to find a doctor's medical records. */
export interface FindDoctorMedicalRecordsPayload {
  doctorId: string;
  manager?: EntityManager;
}

/** Parameters required to find a clinic admin's medical records. */
export interface FindClinicAdminMedicalRecordsPayload {
  clinicId: string;
  manager?: EntityManager;
}

/** Parameters for updating a medical record. */
export interface UpdateMedicalRecordPayload {
  id: string;
  diagnosis?: string;
  description?: string | null;
  notes?: string | null;
  manager?: EntityManager;
}

/** Parameters for deleting a medical record. */
export interface DeleteMedicalRecordPayload {
  id: string;
  manager?: EntityManager;
}
