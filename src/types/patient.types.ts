import { EntityManager } from 'typeorm';
import { Patient } from '@/modules/patient/entities';
import { BloodType, Gender } from '@/modules/patient/enums';

/** Patient without relation data. */
export type SafePatient = Omit<Patient, 'user' | 'appointments'>;

/** Single patient API response. */
export interface PatientResponse {
  patient: SafePatient;
}

/** Multiple patients API response. */
export interface PatientsResponse {
  patients: SafePatient[];
}

/** Parameters for creating a patient. */
export interface CreatePatientPayload {
  userId: string;
  nationalCode: string;
  birthDate?: string | null;
  gender: Gender;
  bloodType?: BloodType | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  address?: string | null;
  city?: string | null;
  manager?: EntityManager;
}

/** Parameters for updating a patient. */
export interface UpdatePatientPayload {
  patientId: string;
  nationalCode?: string;
  birthDate?: string | null;
  gender?: Gender;
  bloodType?: BloodType | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  address?: string | null;
  city?: string | null;
  manager?: EntityManager;
}

/** Parameters for finding all patients. */
export interface FindPatientsPayload {
  gender?: Gender;
  manager?: EntityManager;
}

/** Parameters for finding a patient by ID. */
export interface FindPatientByIdPayload {
  id: string;
  manager?: EntityManager;
}

/** Parameters for finding a patient by user ID. */
export interface FindPatientByUserIdPayload {
  userId: string;
  manager?: EntityManager;
}

/** Parameters for finding a patient by national code. */
export interface FindPatientByNationalCodePayload {
  nationalCode: string;
  manager?: EntityManager;
}
