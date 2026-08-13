import { EntityManager } from 'typeorm';
import { Specialty } from '@/modules/specialty/entities';
import { SpecialtyStatus } from '@/modules/specialty/enums';

/** Specialty without relation data. */
export type SafeSpecialty = Omit<Specialty, 'doctorSpecialties'>;

/** Single specialty API response. */
export interface SpecialtyResponse {
  specialty: SafeSpecialty;
}

/** Multiple specialties API response. */
export interface SpecialtiesResponse {
  specialties: SafeSpecialty[];
}

/** Parameters for creating a specialty. */
export interface CreateSpecialtyPayload {
  name: string;
  slug: string;
  description?: string | null;
  manager?: EntityManager;
}

/** Parameters for updating a specialty. */
export interface UpdateSpecialtyPayload {
  id: string;
  name?: string;
  slug?: string;
  description?: string | null;
  manager?: EntityManager;
}

/** Parameters for updating specialty status. */
export interface UpdateSpecialtyStatusPayload {
  id: string;
  status: SpecialtyStatus;
  manager?: EntityManager;
}

/** Parameters for finding a specialty by ID. */
export interface FindSpecialtyByIdPayload {
  id: string;
  manager?: EntityManager;
}

/** Parameters for finding a specialty by slug. */
export interface FindSpecialtyBySlugPayload {
  slug: string;
  manager?: EntityManager;
}

/** Parameters for finding all specialties. */
export interface FindSpecialtiesPayload {
  manager?: EntityManager;
}

/** Parameters for deleting a specialty. */
export interface DeleteSpecialtyPayload {
  id: string;
  manager?: EntityManager;
}
