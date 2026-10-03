import { EntityManager } from 'typeorm';
import { DoctorSpecialty } from '@/modules/doctor-specialty/entities';

/** Doctor specialty without relation data. */
export type SafeDoctorSpecialty = Omit<DoctorSpecialty, 'doctor' | 'specialty'>;

/** Single doctor specialty API response. */
export interface DoctorSpecialtyResponse {
  doctorSpecialty: SafeDoctorSpecialty;
}

/** Multiple doctor specialties API response. */
export interface DoctorSpecialtiesResponse {
  doctorSpecialties: SafeDoctorSpecialty[];
}

/** Parameters for adding a specialty to a doctor. */
export interface AddDoctorSpecialtyPayload {
  doctorId: string;
  specialtyId: string;
  isPrimary?: boolean;
  manager?: EntityManager;
}

/** Parameters for finding a doctor specialty relation. */
export interface FindDoctorSpecialtyPayload {
  id: string;
  manager?: EntityManager;
}

/** Parameters for finding all specialties of a doctor. */
export interface FindDoctorSpecialtiesPayload {
  doctorId: string;
  manager?: EntityManager;
}

/** Parameters for setting a doctor's primary specialty. */
export interface SetPrimaryDoctorSpecialtyPayload {
  id: string;
  doctorId: string;
  manager?: EntityManager;
}

/** Parameters for finding all specialties associated with a doctor's user ID. */
export interface FindDoctorSpecialtiesByUserIdPayload {
  doctorId: string;
  manager?: EntityManager;
}

/** Parameters for removing a specialty from a doctor. */
export interface RemoveDoctorSpecialtyPayload {
  id: string;
  manager?: EntityManager;
}
