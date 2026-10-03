import { EntityTarget, FindOptionsRelations, ObjectLiteral } from 'typeorm';

import { User } from '@/modules/user/entities';
import { Doctor } from '@/modules/doctor/entities';
import { Clinic } from '@/modules/clinic/entities';
import { Appointment } from '@/modules/appointment/entities';
import { DoctorSchedule } from '@/modules/doctor-schedule/entities';
import { TimeSlot } from '@/modules/time-slot/entities';
import { Session } from '@/modules/session/entities';
import { RefreshToken } from '@/modules/refresh-token/entities';
import { DoctorSpecialty } from '@/modules/doctor-specialty/entities';
import { MedicalRecord } from '@/modules/medical-record/entities';
import { Patient } from '@/modules/patient/entities';
import { DoctorClinic } from '@/modules/doctor-clinic/entities';

interface OwnershipConfig {
  entity: EntityTarget<ObjectLiteral>;
  relations: FindOptionsRelations<ObjectLiteral>;

  getOwnerUserId?: (resource: ObjectLiteral) => string | undefined;
  getDoctorUserId?: (resource: ObjectLiteral) => string | undefined;
  getPatientUserId?: (resource: ObjectLiteral) => string | undefined;
  getClinicUserId?: (resource: ObjectLiteral) => string | undefined;
}

export const OWNERSHIP_CONFIG: Record<string, OwnershipConfig> = {
  user: {
    entity: User,
    relations: {},
    getOwnerUserId: (resource) => resource.id,
  },

  doctor: {
    entity: Doctor,
    relations: {},
    getOwnerUserId: (resource) => resource.userId,
  },

  clinic: {
    entity: Clinic,
    relations: {},
    getOwnerUserId: (resource) => resource.ownerId,
  },

  patient: {
    entity: Patient,
    relations: {},
    getOwnerUserId: (resource) => resource.userId,
  },

  appointment: {
    entity: Appointment,
    relations: {
      timeSlot: {
        schedule: {
          doctorClinic: {
            doctor: true,
            clinic: true,
          },
        },
      },
      patient: true,
    },
    getDoctorUserId: (resource) => resource.timeSlot?.schedule?.doctorClinic?.doctor?.userId,
    getClinicUserId: (resource) => resource.timeSlot?.schedule?.doctorClinic?.clinic?.ownerId,
    getPatientUserId: (resource) => resource.patient?.userId,
  },

  'doctor-schedule': {
    entity: DoctorSchedule,
    relations: {
      doctorClinic: {
        doctor: true,
        clinic: true,
      },
    },
    getDoctorUserId: (resource) => resource.doctorClinic?.doctor?.userId,
    getClinicUserId: (resource) => resource.doctorClinic?.clinic?.ownerId,
  },

  'doctor-clinic': {
    entity: DoctorClinic,
    relations: {
      doctor: true,
      clinic: true,
    },
    getDoctorUserId: (resource) => resource.doctor?.userId,
    getClinicUserId: (resource) => resource.clinic?.ownerId,
  },

  'time-slot': {
    entity: TimeSlot,
    relations: {
      schedule: {
        doctorClinic: {
          doctor: true,
          clinic: true,
        },
      },
    },
    getDoctorUserId: (resource) => resource.schedule?.doctorClinic?.doctor?.userId,
    getClinicUserId: (resource) => resource.schedule?.doctorClinic?.clinic?.ownerId,
  },

  session: {
    entity: Session,
    relations: {},
    getOwnerUserId: (resource) => resource.userId,
  },

  'refresh-token': {
    entity: RefreshToken,
    relations: {
      session: true,
    },
    getOwnerUserId: (resource) => resource.session?.userId,
  },

  'doctor-specialty': {
    entity: DoctorSpecialty,
    relations: {
      doctor: true,
    },
    getOwnerUserId: (resource) => resource.doctor?.userId,
  },

  'medical-record': {
    entity: MedicalRecord,
    relations: {
      appointment: {
        timeSlot: {
          schedule: {
            doctorClinic: {
              doctor: true,
              clinic: true,
            },
          },
        },
      },
    },
    getDoctorUserId: (resource) => resource.appointment?.timeSlot?.schedule?.doctorClinic?.doctor?.userId,
    getClinicUserId: (resource) => resource.appointment?.timeSlot?.schedule?.doctorClinic?.clinic?.ownerId,
  },
};
