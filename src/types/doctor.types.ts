import { EntityManager } from 'typeorm';
import { Doctor } from '@/modules/doctor/entities';
import { DoctorStatus } from '@/modules/doctor/enums';

/** Doctor without user and relation data. */
export type SafeDoctor = Omit<Doctor, 'user' | 'doctorSpecialties' | 'clinics'>;

/** Single doctor API response. */
export interface DoctorResponse {
  doctor: SafeDoctor;
}

/** Multiple doctors API response. */
export interface DoctorsResponse {
  doctors: SafeDoctor[];
}

/** Parameters for creating a doctor. */
export interface CreateDoctorPayload {
  userId: string;
  medicalCode: string;
  bio?: string | null;
  experienceYears: number;
  consultationFee: string;
  manager?: EntityManager;
}

/** Parameters for updating a doctor. */
export type UpdateDoctorPayload = DoctorIdentifier & {
  medicalCode?: string;
  bio?: string | null;
  experienceYears?: number;
  consultationFee?: string;
  manager?: EntityManager;
};

/** Parameters for finding a doctor by ID. */
export interface FindDoctorByIdPayload {
  id: string;
  manager?: EntityManager;
}

/** Parameters for finding a doctor by user ID. */
export interface FindDoctorByUserIdPayload {
  userId: string;
  status?: DoctorStatus;
  manager?: EntityManager;
}

/** Parameters for finding a doctor by medical code. */
export interface FindDoctorByMedicalCodePayload {
  medicalCode: string;
  status?: DoctorStatus;
  manager?: EntityManager;
}

/** Parameters for deleting a doctor. */
export type DeleteDoctorPayload = DoctorIdentifier & {
  manager?: EntityManager;
};

/** Parameters for finding all doctors. */
export interface FindDoctorsPayload {
  status?: DoctorStatus;
  manager?: EntityManager;
}

/**
 * Identifies a doctor by either doctor ID or user ID.
 */
export type DoctorIdentifier =
  | {
      doctorId: string;
      userId?: never;
    }
  | {
      userId: string;
      doctorId?: never;
    };

/**
 * Identifies a resource by either user ID or clinic owner ID.
 */
export type DoctorOrClinicOwnerIdentifier =
  | {
      userId: string;
      clinicOwnerId?: never;
    }
  | {
      clinicOwnerId: string;
      userId?: never;
    };

/**
 * Parameters for resolving a doctor by user ID or doctor ID.
 */
export type ResolveDoctorPayload = DoctorIdentifier & {
  manager?: EntityManager;
};
