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
  UpdateMedicalRecordPayload,
  FindPatientMedicalRecordsPayload,
  MedicalRecordsResponse,
  FindDoctorMedicalRecordsPayload,
  FindClinicAdminMedicalRecordsPayload,
  FindMedicalRecordsPayload,
} from '@/types';
import { BaseException } from '@/types';
import { checkDatabaseError } from '@/lib';
import { AppointmentService } from '@/modules/appointment/appointment.service';
import { AppointmentStatus } from '../appointment/enums';

@Injectable()
export class MedicalRecordService {
  constructor(
    @InjectRepository(MedicalRecord)
    private readonly medicalRecordRepository: Repository<MedicalRecord>,
    private readonly appointmentService: AppointmentService,
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
      const { appointment } = await this.appointmentService.getById({
        id: payload.appointmentId,
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

    const medicalRecords = await repository.find({
      where: {
        appointment: {
          patientId: payload.patientId,
        },
      },
    });

    return {
      medicalRecords,
    };
  }

  /**
   * Get all medical records from the authenticated doctor.
   */
  async findDoctorMedicalRecords(payload: FindDoctorMedicalRecordsPayload): Promise<MedicalRecordsResponse> {
    const repository = this.getRepository(payload.manager);

    const medicalRecords = await repository.find({
      where: {
        appointment: {
          timeSlot: {
            schedule: {
              doctorClinic: {
                doctorId: payload.doctorId,
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
   * Get all medical records from the authenticated admin's clinic.
   */
  async findClinicAdminMedicalRecords(payload: FindClinicAdminMedicalRecordsPayload): Promise<MedicalRecordsResponse> {
    const repository = this.getRepository(payload.manager);

    const medicalRecords = await repository.find({
      where: {
        appointment: {
          timeSlot: {
            schedule: {
              doctorClinic: {
                clinic: {
                  ownerId: payload.clinicId,
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
   * Update a medical record.
   */
  async update(payload: UpdateMedicalRecordPayload): Promise<MedicalRecordResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const updatedMedicalRecord = await repository.preload({
        id: payload.id,
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
      const result = await repository.softDelete({
        id: payload.id,
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
}
