import { EntityManager } from 'typeorm';
import { Clinic } from '@/modules/clinic/entities';
import { ClinicStatus } from '@/modules/clinic/enums';

/** Clinic without relation data. */
export type SafeClinic = Omit<Clinic, 'doctor'>;

/** Single clinic API response. */
export interface ClinicResponse {
  clinic: SafeClinic;
}

/** Multiple clinics API response. */
export interface ClinicsResponse {
  clinics: SafeClinic[];
}

/** Parameters for creating a clinic. */
export interface CreateClinicPayload {
  doctorId: string;
  name: string;
  address: string;
  city: string;
  phone?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  description?: string | null;
  manager?: EntityManager;
}

/** Parameters for updating a clinic. */
export interface UpdateClinicPayload {
  id: string;
  name?: string;
  address?: string;
  city?: string;
  phone?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  description?: string | null;
  manager?: EntityManager;
  doctorId: string;
}

/** Parameters for updating clinic status. */
export interface UpdateClinicStatusPayload {
  id: string;
  status: ClinicStatus;
  manager?: EntityManager;
}

/** Parameters for finding a clinic by ID. */
export interface FindClinicByIdPayload {
  id: string;
  doctorId: string;
  manager?: EntityManager;
}

/** Parameters for finding clinics by doctor ID. */
export interface FindClinicsByDoctorIdPayload {
  doctorId: string;
  manager?: EntityManager;
}

/** Parameters for finding all clinics. */
export interface FindClinicsPayload {
  manager?: EntityManager;
}

/** Parameters for deleting a clinic. */
export interface DeleteClinicPayload {
  id: string;
  manager?: EntityManager;
  doctorId: string;
}
