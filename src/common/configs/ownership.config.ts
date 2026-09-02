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

interface OwnershipConfig {
  entity: EntityTarget<ObjectLiteral>;
  relations: FindOptionsRelations<ObjectLiteral>;
  getUserId: (resource: ObjectLiteral) => string | undefined;
}

export const OWNERSHIP_CONFIG: Record<string, OwnershipConfig> = {
  user: {
    entity: User,
    relations: {},
    getUserId: (resource) => resource.id,
  },

  doctor: {
    entity: Doctor,
    relations: {},
    getUserId: (resource) => resource.userId,
  },

  clinic: {
    entity: Clinic,
    relations: {
      doctor: true,
    },
    getUserId: (resource) => resource.doctor?.userId,
  },

  'appointment-doctor': {
    entity: Appointment,
    relations: {
      timeSlot: {
        doctor: true,
      },
    },
    getUserId: (resource) => resource.timeSlot?.doctor?.userId,
  },

  'appointment-patient': {
    entity: Appointment,
    relations: {
      patient: true,
    },
    getUserId: (resource) => resource.patient?.userId,
  },

  'doctor-schedule': {
    entity: DoctorSchedule,
    relations: {
      clinic: {
        doctor: true,
      },
    },
    getUserId: (resource) => resource.clinic?.doctor?.userId,
  },

  'time-slot': {
    entity: TimeSlot,
    relations: {
      doctor: true,
    },
    getUserId: (resource) => resource.doctor?.userId,
  },

  session: {
    entity: Session,
    relations: {},
    getUserId: (resource) => resource.userId,
  },

  'refresh-token': {
    entity: RefreshToken,
    relations: {
      session: true,
    },
    getUserId: (resource) => resource.session?.userId,
  },

  'doctor-specialty': {
    entity: DoctorSpecialty,
    relations: {
      doctor: true,
    },
    getUserId: (resource) => resource.doctor?.userId,
  },
};
