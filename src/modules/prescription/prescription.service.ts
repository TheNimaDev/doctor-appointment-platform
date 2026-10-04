import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Prescription } from './entities';
import { AppointmentStatus } from '@/modules/appointment/enums';
import { AppointmentService } from '../appointment/appointment.service';
import {
  BaseException,
  CreatePrescriptionPayload,
  DeletePrescriptionPayload,
  FindClinicAdminPrescriptionsPayload,
  FindDoctorPrescriptionsPayload,
  FindPatientPrescriptionsPayload,
  FindPrescriptionsPayload,
  GetPrescriptionByAppointmentIdPayload,
  GetPrescriptionByIdPayload,
  PrescriptionResponse,
  PrescriptionsResponse,
  UpdatePrescriptionPayload,
} from '@/types';
import { checkDatabaseError } from '@/lib';

@Injectable()
export class PrescriptionService {
  constructor(
    @InjectRepository(Prescription)
    private readonly prescriptionRepository: Repository<Prescription>,
    private readonly appointmentService: AppointmentService,
  ) {}

  /**
   * Get the appropriate Prescription repository.
   *
   * - Uses the transaction manager repository when provided.
   * - Falls back to the default repository otherwise.
   */
  private getRepository(manager?: EntityManager): Repository<Prescription> {
    return manager?.getRepository(Prescription) ?? this.prescriptionRepository;
  }

  /**
   * Create a prescription for a completed appointment.
   */
  async create(payload: CreatePrescriptionPayload): Promise<PrescriptionResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const { appointment } = await this.appointmentService.getById({
        id: payload.appointmentId,
        manager: payload.manager,
      });

      if (appointment.status !== AppointmentStatus.COMPLETED) {
        throw new BadRequestException({
          message: 'Prescription can only be created for completed appointments.',
          error: 'Appointment Not Completed',
        } as BaseException);
      }

      const prescription = repository.create({
        appointmentId: appointment.id,
        notes: payload.notes,
      });

      const savedPrescription = await repository.save(prescription);

      return {
        prescription: savedPrescription,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'Prescription',
      });
    }
  }

  /**
   * Get a prescription by ID.
   */
  async getById(payload: GetPrescriptionByIdPayload): Promise<PrescriptionResponse> {
    const repository = this.getRepository(payload.manager);

    const prescription = await repository.findOne({
      where: {
        id: payload.id,
      },
    });

    if (!prescription) {
      throw new NotFoundException({
        message: 'Prescription not found in database.',
        error: 'Prescription Not Found',
      } as BaseException);
    }

    return {
      prescription,
    };
  }

  /**
   * Find all prescriptions.
   */
  async findAll(payload: FindPrescriptionsPayload): Promise<PrescriptionsResponse> {
    const repository = this.getRepository(payload.manager);

    const prescriptions = await repository.find();

    return {
      prescriptions,
    };
  }

  /**
   * Get the prescription associated with an appointment.
   */
  async getByAppointmentId(payload: GetPrescriptionByAppointmentIdPayload): Promise<PrescriptionResponse> {
    const repository = this.getRepository(payload.manager);

    const { appointment } = await this.appointmentService.getById({
      id: payload.appointmentId,
      manager: payload.manager,
    });

    const prescription = await repository.findOne({
      where: {
        appointmentId: appointment.id,
      },
    });

    if (!prescription) {
      throw new NotFoundException({
        message: 'Prescription not found for this appointment.',
        error: 'Prescription Not Found',
      } as BaseException);
    }

    return {
      prescription,
    };
  }

  /**
   * Get all prescriptions from the authenticated patient.
   */
  async findPatientPrescriptions(payload: FindPatientPrescriptionsPayload): Promise<PrescriptionsResponse> {
    const repository = this.getRepository(payload.manager);

    const prescriptions = await repository.find({
      where: {
        appointment: {
          patientId: payload.patientId,
        },
      },
    });

    return {
      prescriptions,
    };
  }

  /**
   * Get all prescriptions from the authenticated doctor.
   */
  async findDoctorPrescriptions(payload: FindDoctorPrescriptionsPayload): Promise<PrescriptionsResponse> {
    const repository = this.getRepository(payload.manager);

    const prescriptions = await repository.find({
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
      prescriptions,
    };
  }

  /**
   * Get all prescriptions from the authenticated admin's clinic.
   */
  async findClinicAdminPrescriptions(payload: FindClinicAdminPrescriptionsPayload): Promise<PrescriptionsResponse> {
    const repository = this.getRepository(payload.manager);

    const prescriptions = await repository.find({
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
      prescriptions,
    };
  }

  /**
   * Update a prescription.
   */
  async update(payload: UpdatePrescriptionPayload): Promise<PrescriptionResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const updatedPrescription = await repository.preload({
        id: payload.id,
        ...(payload.notes !== undefined && {
          notes: payload.notes,
        }),
      });

      if (!updatedPrescription) {
        throw new NotFoundException({
          message: 'Prescription not found in database.',
          error: 'Prescription Not Found',
        } as BaseException);
      }

      const savedPrescription = await repository.save(updatedPrescription);

      return {
        prescription: savedPrescription,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'Prescription',
      });
    }
  }

  /**
   * Soft-delete a prescription.
   */
  async delete(payload: DeletePrescriptionPayload): Promise<void> {
    const repository = this.getRepository(payload.manager);

    try {
      const result = await repository.softDelete({
        id: payload.id,
      });

      if (result.affected === 0) {
        throw new NotFoundException({
          message: 'Prescription not found in database.',
          error: 'Prescription Not Found',
        } as BaseException);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'Prescription',
      });
    }
  }
}
