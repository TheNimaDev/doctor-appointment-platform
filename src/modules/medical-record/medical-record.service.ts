import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { MedicalRecord } from './entities';
import {
  CreateMedicalRecordPayload,
  FindMedicalRecordByAppointmentIdPayload,
  FindMedicalRecordByIdPayload,
  MedicalRecordResponse,
  DeleteMedicalRecordPayload,
  ResolveMedicalRecordPayload,
  UpdateMedicalRecordPayload,
  FindPatientMedicalRecordByIdPayload,
  FindPatientMedicalRecordsPayload,
  MedicalRecordsResponse,
  FindDoctorMedicalRecordsPayload,
  FindDoctorMedicalRecordByIdPayload,
  FindClinicAdminMedicalRecordsPayload,
  FindClinicAdminMedicalRecordByIdPayload,
  FindPatientMedicalRecordByAppointmentIdPayload,
  FindDoctorMedicalRecordByAppointmentIdPayload,
  FindClinicAdminMedicalRecordByAppointmentIdPayload,
  FindMedicalRecordsPayload,
} from '@/types';
import { BaseException } from '@/types';
import { checkDatabaseError } from '@/lib';
import { AppointmentService } from '@/modules/appointment/appointment.service';
import { DoctorService } from '../doctor/doctor.service';
import { AppointmentStatus } from '../appointment/enums';
import { PatientService } from '../patient/patient.service';
import { ClinicService } from '../clinic/clinic.service';

@Injectable()
export class MedicalRecordService {
  constructor(
    @InjectRepository(MedicalRecord)
    private readonly medicalRecordRepository: Repository<MedicalRecord>,
    private readonly appointmentService: AppointmentService,
    private readonly doctorService: DoctorService,
    private readonly patientService: PatientService,
    private readonly clinicService: ClinicService,
  ) {}

  /**
   * Get the appropriate MedicalRecord repository.
   *
   * - Uses the transaction manager repository when provided.
   * - Falls back to the default repository otherwise.
   */
  private getRepository(manager?: EntityManager): Repository<MedicalRecord> {
    return manager?.getRepository(MedicalRecord) ?? this.medicalRecordRepository;
  }

  /**
   * Create a medical record for a completed appointment.
   */
  async create(payload: CreateMedicalRecordPayload): Promise<MedicalRecordResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const { doctor } = await this.doctorService.findByUserId({
        userId: payload.userId,
        manager: payload.manager,
      });

      const { appointment } = await this.appointmentService.getDoctorAppointmentById({
        id: payload.appointmentId,
        userId: doctor.userId,
        manager: payload.manager,
      });

      if (appointment.status !== AppointmentStatus.COMPLETED) {
        throw new BadRequestException({
          message: 'Medical record can only be created for completed appointments.',
          error: 'Appointment Not Completed',
        } as BaseException);
      }

      const medicalRecord = repository.create({
        appointmentId: appointment.id,
        diagnosis: payload.diagnosis,
        description: payload.description,
        notes: payload.notes,
      });

      const savedMedicalRecord = await repository.save(medicalRecord);

      return {
        medicalRecord: savedMedicalRecord,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'Medical Record',
      });
    }
  }

  /**
   * Find a medical record by ID.
   */
  async findById(payload: FindMedicalRecordByIdPayload): Promise<MedicalRecordResponse> {
    const repository = this.getRepository(payload.manager);

    const medicalRecord = await repository.findOne({
      where: {
        id: payload.id,
      },
    });

    if (!medicalRecord) {
      throw new NotFoundException({
        message: 'Medical record not found in database.',
        error: 'Medical Record Not Found',
      } as BaseException);
    }

    return {
      medicalRecord,
    };
  }

  /**
   * Find all medical records.
   */
  async findAll(payload: FindMedicalRecordsPayload): Promise<MedicalRecordsResponse> {
    const repository = this.getRepository(payload.manager);

    const medicalRecords = await repository.find();

    return { medicalRecords };
  }

  /**
   * Find a medical record by appointment ID.
   */
  async findByAppointmentId(payload: FindMedicalRecordByAppointmentIdPayload): Promise<MedicalRecordResponse> {
    const repository = this.getRepository(payload.manager);

    const { appointment } = await this.appointmentService.getById({
      id: payload.appointmentId,
      manager: payload.manager,
    });

    const medicalRecord = await repository.findOne({
      where: {
        appointmentId: appointment.id,
      },
    });

    if (!medicalRecord) {
      throw new NotFoundException({
        message: 'Medical record not found for this appointment.',
        error: 'Medical Record Not Found',
      } as BaseException);
    }

    return {
      medicalRecord,
    };
  }

  /**
   * Get all medical records from the authenticated patient.
   */
  async findPatientMedicalRecords(payload: FindPatientMedicalRecordsPayload): Promise<MedicalRecordsResponse> {
    const repository = this.getRepository(payload.manager);

    const { patient } = await this.patientService.findByUserId({
      userId: payload.userId,
      manager: payload.manager,
    });

    const medicalRecords = await repository.find({
      where: {
        appointment: {
          patientId: patient.id,
        },
      },
    });

    return {
      medicalRecords,
    };
  }

  /**
   * Get a medical record from the authenticated patient.
   */
  async findPatientMedicalRecordById(payload: FindPatientMedicalRecordByIdPayload): Promise<MedicalRecordResponse> {
    const repository = this.getRepository(payload.manager);

    const { patient } = await this.patientService.findByUserId({
      userId: payload.userId,
      manager: payload.manager,
    });

    const medicalRecord = await repository.findOne({
      where: {
        id: payload.id,
        appointment: {
          patientId: patient.id,
        },
      },
    });

    if (!medicalRecord) {
      throw new NotFoundException({
        message: 'Medical record not found in database.',
        error: 'Medical Record Not Found',
      } as BaseException);
    }

    return {
      medicalRecord,
    };
  }

  /**
   * Get a medical record from the authenticated patient by appointment ID.
   */
  async findPatientMedicalRecordByAppointmentId(
    payload: FindPatientMedicalRecordByAppointmentIdPayload,
  ): Promise<MedicalRecordResponse> {
    const repository = this.getRepository(payload.manager);

    const { appointment } = await this.appointmentService.getById({
      id: payload.appointmentId,
      manager: payload.manager,
    });

    const { patient } = await this.patientService.findByUserId({
      userId: payload.userId,
      manager: payload.manager,
    });

    const medicalRecord = await repository.findOne({
      where: {
        appointment: {
          id: appointment.id,
          patientId: patient.id,
        },
      },
    });

    if (!medicalRecord) {
      throw new NotFoundException({
        message: 'Medical record not found in database.',
        error: 'Medical Record Not Found',
      } as BaseException);
    }

    return {
      medicalRecord,
    };
  }

  /**
   * Get all medical records from the authenticated doctor.
   */
  async findDoctorMedicalRecords(payload: FindDoctorMedicalRecordsPayload): Promise<MedicalRecordsResponse> {
    const repository = this.getRepository(payload.manager);

    const { doctor } = await this.doctorService.findByUserId({
      userId: payload.userId,
      manager: payload.manager,
    });

    const medicalRecords = await repository.find({
      where: {
        appointment: {
          timeSlot: {
            schedule: {
              doctorClinic: {
                doctorId: doctor.id,
              },
            },
          },
        },
      },
    });

    return {
      medicalRecords,
    };
  }

  /**
   * Get a medical record from the authenticated doctor.
   */
  async findDoctorMedicalRecordById(payload: FindDoctorMedicalRecordByIdPayload): Promise<MedicalRecordResponse> {
    const repository = this.getRepository(payload.manager);

    const { doctor } = await this.doctorService.findByUserId({
      userId: payload.userId,
      manager: payload.manager,
    });

    const medicalRecord = await repository.findOne({
      where: {
        id: payload.id,
        appointment: {
          timeSlot: {
            schedule: {
              doctorClinic: {
                doctorId: doctor.id,
              },
            },
          },
        },
      },
    });

    if (!medicalRecord) {
      throw new NotFoundException({
        message: 'Medical record not found in database.',
        error: 'Medical Record Not Found',
      } as BaseException);
    }

    return {
      medicalRecord,
    };
  }

  /**
   * Get a medical record from the authenticated doctor by appointment ID.
   */
  async findDoctorMedicalRecordByAppointmentId(
    payload: FindDoctorMedicalRecordByAppointmentIdPayload,
  ): Promise<MedicalRecordResponse> {
    const repository = this.getRepository(payload.manager);

    const { appointment } = await this.appointmentService.getById({
      id: payload.appointmentId,
      manager: payload.manager,
    });

    const { doctor } = await this.doctorService.findByUserId({
      userId: payload.userId,
      manager: payload.manager,
    });

    const medicalRecord = await repository.findOne({
      where: {
        appointment: {
          id: appointment.id,
          timeSlot: {
            schedule: {
              doctorClinic: {
                doctorId: doctor.id,
              },
            },
          },
        },
      },
    });

    if (!medicalRecord) {
      throw new NotFoundException({
        message: 'Medical record not found in database.',
        error: 'Medical Record Not Found',
      } as BaseException);
    }

    return {
      medicalRecord,
    };
  }

  /**
   * Get all medical records from the authenticated admin's clinic.
   */
  async findClinicAdminMedicalRecords(payload: FindClinicAdminMedicalRecordsPayload): Promise<MedicalRecordsResponse> {
    const repository = this.getRepository(payload.manager);

    const { clinic } = await this.clinicService.findByOwnerId({
      ownerId: payload.userId,
      manager: payload.manager,
    });

    const medicalRecords = await repository.find({
      where: {
        appointment: {
          timeSlot: {
            schedule: {
              doctorClinic: {
                clinic: {
                  ownerId: clinic.ownerId,
                },
              },
            },
          },
        },
      },
    });

    return {
      medicalRecords,
    };
  }

  /**
   * Get a medical record from the authenticated admin's clinic.
   */
  async findClinicAdminMedicalRecordById(
    payload: FindClinicAdminMedicalRecordByIdPayload,
  ): Promise<MedicalRecordResponse> {
    const repository = this.getRepository(payload.manager);

    const { clinic } = await this.clinicService.findByOwnerId({
      ownerId: payload.userId,
      manager: payload.manager,
    });

    const medicalRecord = await repository.findOne({
      where: {
        id: payload.id,
        appointment: {
          timeSlot: {
            schedule: {
              doctorClinic: {
                clinic: {
                  ownerId: clinic.ownerId,
                },
              },
            },
          },
        },
      },
    });

    if (!medicalRecord) {
      throw new NotFoundException({
        message: 'Medical record not found in database.',
        error: 'Medical Record Not Found',
      } as BaseException);
    }

    return {
      medicalRecord,
    };
  }

  /**
   * Get a medical record from the authenticated admin's clinic by appointment ID.
   */
  async findClinicAdminMedicalRecordByAppointmentId(
    payload: FindClinicAdminMedicalRecordByAppointmentIdPayload,
  ): Promise<MedicalRecordResponse> {
    const repository = this.getRepository(payload.manager);

    const { appointment } = await this.appointmentService.getById({
      id: payload.appointmentId,
      manager: payload.manager,
    });

    const { clinic } = await this.clinicService.findByOwnerId({
      ownerId: payload.userId,
      manager: payload.manager,
    });

    const medicalRecord = await repository.findOne({
      where: {
        appointment: {
          id: appointment.id,
          timeSlot: {
            schedule: {
              doctorClinic: {
                clinic: {
                  ownerId: clinic.ownerId,
                },
              },
            },
          },
        },
      },
    });

    if (!medicalRecord) {
      throw new NotFoundException({
        message: 'Medical record not found in database.',
        error: 'Medical Record Not Found',
      } as BaseException);
    }

    return {
      medicalRecord,
    };
  }

  /**
   * Update a medical record.
   */
  async update(payload: UpdateMedicalRecordPayload): Promise<MedicalRecordResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const { medicalRecord } = await this.resolveMedicalRecord(payload);

      const updatedMedicalRecord = await repository.preload({
        id: medicalRecord.id,
        ...(payload.diagnosis !== undefined && {
          diagnosis: payload.diagnosis,
        }),
        ...(payload.description !== undefined && {
          description: payload.description,
        }),
        ...(payload.notes !== undefined && {
          notes: payload.notes,
        }),
      });

      if (!updatedMedicalRecord) {
        throw new NotFoundException({
          message: 'Medical record not found in database.',
          error: 'Medical Record Not Found',
        } as BaseException);
      }

      const savedMedicalRecord = await repository.save(updatedMedicalRecord);

      return {
        medicalRecord: savedMedicalRecord,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'Medical Record',
      });
    }
  }

  /**
   * Soft-delete a medical record.
   */
  async delete(payload: DeleteMedicalRecordPayload): Promise<void> {
    const repository = this.getRepository(payload.manager);

    try {
      const { medicalRecord } = await this.resolveMedicalRecord(payload);

      const result = await repository.softDelete({
        id: medicalRecord.id,
      });

      if (result.affected === 0) {
        throw new NotFoundException({
          message: 'Medical record not found in database.',
          error: 'Medical Record Not Found',
        } as BaseException);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'Medical Record',
      });
    }
  }

  /**
   * Resolve a medical record by either appointment ID or medical record ID.
   */
  async resolveMedicalRecord(payload: ResolveMedicalRecordPayload): Promise<MedicalRecordResponse> {
    if ('appointmentId' in payload) {
      return this.findDoctorMedicalRecordByAppointmentId({
        userId: payload.userId,
        appointmentId: payload.appointmentId,
        manager: payload.manager,
      });
    }

    return this.findDoctorMedicalRecordById({
      id: payload.medicalRecordId,
      userId: payload.userId,
      manager: payload.manager,
    });
  }
}
