import { ROLES } from '@/common';

export const SEED_USERS = {
  SUPER_ADMIN: [
    {
      email: 'superadmin@example.com',
      password: '12345678',
      firstName: 'Super',
      lastName: 'Admin',
      role: ROLES.SUPER_ADMIN,
    },
  ],

  CLINIC_ADMIN: [
    {
      email: 'clinicadmin1@example.com',
      password: '12345678',
      firstName: 'Clinic',
      lastName: 'Admin1',
      role: ROLES.CLINIC_ADMIN,
    },
    {
      email: 'clinicadmin2@example.com',
      password: '12345678',
      firstName: 'Clinic',
      lastName: 'Admin2',
      role: ROLES.CLINIC_ADMIN,
    },
  ],

  DOCTORS: [
    {
      email: 'doctor1@example.com',
      password: '12345678',
      firstName: 'Nima',
      lastName: 'Doctor1',
      role: ROLES.DOCTOR,
    },
    {
      email: 'doctor2@example.com',
      password: '12345678',
      firstName: 'Nima',
      lastName: 'Doctor2',
      role: ROLES.DOCTOR,
    },
  ],

  PATIENTS: [
    {
      email: 'patient1@example.com',
      password: '12345678',
      firstName: 'Nima',
      lastName: 'Patient',
      role: ROLES.PATIENT,
    },
    {
      email: 'patient2@example.com',
      password: '12345678',
      firstName: 'Nimaa',
      lastName: 'Patient',
      role: ROLES.PATIENT,
    },
  ],
} as const;

export const SEED_CLINICS = [
  {
    ownerEmail: 'clinicadmin1@example.com',
    name: 'Medical Clinic Niavaran',
    city: 'Tehran',
    address: 'Tehran, Niavaran',
  },
  {
    ownerEmail: 'clinicadmin2@example.com',
    name: 'Medical Jordan',
    city: 'Tehran',
    address: 'Tehran, Jordan',
  },
] as const;

export const SEED_DOCTORS = [
  {
    userEmail: 'doctor1@example.com',
    medicalCode: 'DOC-000001',
    experienceYears: 5,
    consultationFee: '500000',
  },
  {
    userEmail: 'doctor2@example.com',
    medicalCode: 'DOC-000002',
    experienceYears: 8,
    consultationFee: '700000',
  },
] as const;

export const SEED_DOCTOR_CLINICS = [
  {
    doctorEmail: 'doctor1@example.com',
    clinicOwnerEmail: 'clinicadmin1@example.com',
  },
  {
    doctorEmail: 'doctor2@example.com',
    clinicOwnerEmail: 'clinicadmin2@example.com',
  },
] as const;

export const ALL_SEED_USERS = [
  ...SEED_USERS.SUPER_ADMIN,
  ...SEED_USERS.CLINIC_ADMIN,
  ...SEED_USERS.DOCTORS,
  ...SEED_USERS.PATIENTS,
] as const;
