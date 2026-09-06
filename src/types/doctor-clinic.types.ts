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
  clinicId: string;
  manager?: EntityManager;
}

/** Parameters for finding a doctor-clinic relation by Doctor and Clinic IDs. */
export interface FindDoctorClinicByDoctorAndClinicPayload {
  doctorId: string;
  clinicId: string;
  manager?: EntityManager;
}

/** Parameters for finding a doctor-clinic relation by doctor ID. */
export interface FindDoctorClinicsByDoctorIdPayload {
  doctorId: string;
  manager?: EntityManager;
}

/** Parameters for finding a doctor-clinic relation by clinic ID. */
export interface FindDoctorClinicsByClinicIdPayload {
  clinicId: string;
  manager?: EntityManager;
}

/** Parameters for deleting a doctor-clinic relation. */
export interface DeleteDoctorClinicPayload {
  doctorId: string;
  clinicId: string;
  manager?: EntityManager;
}
