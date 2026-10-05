import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Prescription, PrescriptionItem } from './entities';
import { AppointmentStatus } from '@/modules/appointment/enums';
import { AppointmentService } from '../appointment/appointment.service';
import {
  BaseException,
  CreatePrescriptionItemsHandlerPayload,
  CreatePrescriptionItemsPayload,
  CreatePrescriptionPayload,
  DeletePrescriptionItemPayload,
  DeletePrescriptionPayload,
  FindClinicAdminPrescriptionsPayload,
  FindDoctorPrescriptionsPayload,
  FindPatientPrescriptionsPayload,
  FindPrescriptionsPayload,
  GetPrescriptionByAppointmentIdPayload,
  GetPrescriptionByIdPayload,
  PrescriptionResponse,
  PrescriptionsResponse,
  UpdatePrescriptionItemPayload,
  UpdatePrescriptionPayload,
} from '@/types';
import { checkDatabaseError } from '@/lib';
import { DatabaseService } from '@/modules/database/database.service';

@Injectable()
export class PrescriptionService {
  constructor(
    @InjectRepository(Prescription)
    private readonly prescriptionRepository: Repository<Prescription>,
    @InjectRepository(PrescriptionItem)
    private readonly prescriptionItemRepository: Repository<PrescriptionItem>,
    private readonly appointmentService: AppointmentService,
    private readonly databaseService: DatabaseService,
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
   * Get the appropriate Prescription Item repository.
   *
   * - Uses the transaction manager repository when provided.
   * - Falls back to the default repository otherwise.
   */
  private getItemRepository(manager?: EntityManager): Repository<PrescriptionItem> {
    return manager?.getRepository(PrescriptionItem) ?? this.prescriptionItemRepository;
  }

  /**
   * Create a prescription for a completed appointment.
   */
  async create(payload: CreatePrescriptionPayload): Promise<PrescriptionResponse> {
    return await this.databaseService.dataSource.transaction(async (manager) => {
      const repository = this.getRepository(manager);

      try {
        const { appointment } = await this.appointmentService.getById({
          id: payload.appointmentId,
          manager,
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

        await repository.save(prescription);

        await this.createItems({
          prescriptionId: prescription.id,
          items: payload.items,
          manager,
        });

        const { prescription: savedPrescription } = await this.getById({
          id: prescription.id,
          manager,
        });

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
    });
  }

  /**
   * Create a prescription item for a prescription within a transaction.
   */
  async createItemsHandler(payload: CreatePrescriptionItemsHandlerPayload): Promise<PrescriptionResponse> {
    return await this.databaseService.dataSource.transaction(async (manager) => {
      await this.createItems({
        ...payload,
        manager,
      });

      return await this.getById({
        id: payload.prescriptionId,
        manager,
      });
    });
  }

  /**
   * Create a prescription items for a prescription.
   */
  private async createItems(payload: CreatePrescriptionItemsPayload): Promise<void> {
    const repository = this.getItemRepository(payload.manager);

    try {
      const prescriptionItems = payload.items.map((item) =>
        repository.create({
          prescriptionId: payload.prescriptionId,
          dosage: item.dosage,
          duration: item.duration,
          medicineName: item.medicineName,
          quantity: item.quantity,
          usage: item.usage,
        }),
      );

      await repository.save(prescriptionItems);
    } catch (error) {
      checkDatabaseError({
        e: error as Error,
        mainResource: 'Prescription Item',
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
      relations: {
        items: true,
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

    const prescriptions = await repository.find({
      relations: {
        items: true,
      },
    });

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
      relations: {
        items: true,
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
      relations: {
        items: true,
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
      relations: {
        items: true,
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
      relations: {
        items: true,
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
   * Update a prescription item.
   */
  async updateItem(payload: UpdatePrescriptionItemPayload): Promise<PrescriptionResponse> {
    const repository = this.getItemRepository(payload.manager);

    try {
      const updatedPrescriptionItem = await repository.preload({
        id: payload.id,
        ...(payload.dosage !== undefined && {
          dosage: payload.dosage,
        }),
        ...(payload.duration !== undefined && {
          duration: payload.duration,
        }),
        ...(payload.medicineName !== undefined && {
          medicineName: payload.medicineName,
        }),
        ...(payload.quantity !== undefined && {
          quantity: payload.quantity,
        }),
        ...(payload.usage !== undefined && {
          usage: payload.usage,
        }),
      });

      if (!updatedPrescriptionItem) {
        throw new NotFoundException({
          message: 'Prescription item not found in database.',
          error: 'Prescription Item Not Found',
        } as BaseException);
      }

      const savedPrescriptionItem = await repository.save(updatedPrescriptionItem);

      const { prescription } = await this.getById({
        id: savedPrescriptionItem.prescriptionId,
        manager: payload.manager,
      });

      return {
        prescription,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'Prescription Item',
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

  /**
   * Soft-delete a prescription item.
   */
  async deleteItem(payload: DeletePrescriptionItemPayload): Promise<void> {
    const repository = this.getItemRepository(payload.manager);

    try {
      const prescriptionItem = await repository.findOne({
        where: {
          id: payload.id,
        },
      });

      if (!prescriptionItem) {
        throw new NotFoundException({
          message: 'Prescription item not found in database.',
          error: 'Prescription Item Not Found',
        } as BaseException);
      }

      const itemCount = await repository.count({
        where: {
          prescriptionId: prescriptionItem.prescriptionId,
        },
      });

      if (itemCount <= 1) {
        throw new BadRequestException({
          message: 'A prescription must contain at least one item.',
          error: 'Cannot Delete Last Prescription Item',
        } as BaseException);
      }

      await repository.softDelete({
        id: payload.id,
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'Prescription Item',
      });
    }
  }
}
