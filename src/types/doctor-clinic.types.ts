import { EntityManager } from 'typeorm';
import { DoctorClinic } from '@/modules/doctor-clinic/entities';

/** Doctor clinic without relation data. */
export type SafeDoctorClinic = Omit<DoctorClinic, 'doctor' | 'clinic' | 'doctorSchedules'>;

/** Single doctor-clinic API response. */
export interface DoctorClinicResponse {
  doctorClinic: SafeDoctorClinic;
}

/** Multiple doctor-clinic API response. */
export interface DoctorClinicsResponse {
  doctorClinics: SafeDoctorClinic[];
}

/** Parameters for creating a doctor-clinic relation. */
export interface CreateDoctorClinicPayload {
  doctorId: string;
  clinicOwnerId: string;
  manager?: EntityManager;
}

/** Parameters for finding a doctor-clinic relation by doctor and clinic IDs. */
export interface FindDoctorClinicByDoctorAndClinicPayload {
  doctorId: string;
  clinicId: string;
  manager?: EntityManager;
}

/** Parameters for finding all clinics associated with a doctor. */
export interface FindDoctorClinicsByDoctorIdPayload {
  doctorId: string;
  manager?: EntityManager;
}

/** Parameters for finding all doctors associated with a clinic. */
export interface FindDoctorClinicsByClinicIdPayload {
  clinicId: string;
  manager?: EntityManager;
}

/** Parameters for finding all clinics associated with a doctor's user ID. */
export interface FindDoctorClinicsByUserIdPayload {
  userId: string;
  manager?: EntityManager;
}

/** Parameters for finding all doctors associated with a clinic owner. */
export interface FindClinicDoctorsByOwnerIdPayload {
  clinicOwnerId: string;
  manager?: EntityManager;
}

/** Parameters for finding a doctor-clinic relation by ID. */
export interface FindDoctorClinicByIdPayload {
  id: string;
  manager?: EntityManager;
}

/** Parameters for finding all doctor-clinic relations. */
export interface FindAllDoctorClinicsPayload {
  manager?: EntityManager;
}

/** Parameters for deleting a doctor-clinic relation. */
export interface DeleteDoctorClinicPayload {
  doctorId: string;
  clinicOwnerId: string;
  manager?: EntityManager;
}
