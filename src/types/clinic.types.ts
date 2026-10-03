import { EntityManager } from 'typeorm';
import { Clinic } from '@/modules/clinic/entities';
import { ClinicStatus } from '@/modules/clinic/enums';

/** Clinic without relation data. */
export type SafeClinic = Omit<Clinic, 'owner' | 'doctorClinics'>;

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
  ownerId: string;
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
}

/** Parameters for updating a clinic status. */
export interface UpdateClinicStatusPayload {
  id: string;
  status: ClinicStatus;
  manager?: EntityManager;
}

/** Parameters for finding a clinic by ID. */
export interface FindClinicByIdPayload {
  id: string;
  manager?: EntityManager;
}

/** Parameters for finding clinic by owner ID. */
export interface FindClinicByOwnerIdPayload {
  ownerId: string;
  manager?: EntityManager;
}

/** Parameters for finding all clinics. */
export interface FindClinicsPayload {
  status?: ClinicStatus;
  manager?: EntityManager;
}

/** Parameters for deleting a clinic. */
export interface DeleteClinicPayload {
  id: string;
  manager?: EntityManager;
}
