import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Appointment } from './entities';
import { checkDatabaseError, combineDateAndTime, getServerDateTime } from '@/lib';
import {
  BaseException,
  FindAppointmentByIdPayload,
  FindAppointmentsPayload,
  AppointmentResponse,
  AppointmentsResponse,
  ReserveAppointmentPayload,
  FindPatientAppointmentsPayload,
  FindDoctorAppointmentsPayload,
  UpdateAppointmentStatusPayload,
  HandleAppointmentStatusPayload,
  FindMyClinicAppointmentsPayload,
} from '@/types';
import { TimeSlotService } from '@/modules/time-slot/time-slot.service';
import { TimeSlotStatus } from '@/modules/time-slot/enums';
import { DatabaseService } from '@/modules/database/database.service';
import { DoctorService } from '@/modules/doctor/doctor.service';
import { AppointmentStatus } from './enums';
import { APPOINTMENT_ALLOWED_TRANSITIONS } from './constants';
import { PatientService } from '../patient/patient.service';
import ms from 'ms';
import { PaymentService } from '../payment/payment.service';
import { DoctorScheduleService } from '../doctor-schedule/doctor-schedule.service';
import { DoctorClinicService } from '../doctor-clinic/doctor-clinic.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    private readonly databaseService: DatabaseService,
    private readonly timeSlotService: TimeSlotService,
    private readonly doctorService: DoctorService,
    private readonly doctorScheduleService: DoctorScheduleService,
    private readonly doctorClinicService: DoctorClinicService,
    private readonly patientService: PatientService,
    private readonly paymentService: PaymentService,
  ) {}

  /**
   * Get the appropriate Appointment repository.
   *
   * - Uses the transaction manager repository when provided.
   * - Falls back to the default repository otherwise.
   */
  private getRepository(manager?: EntityManager): Repository<Appointment> {
    return manager?.getRepository(Appointment) ?? this.appointmentRepository;
  }

  /**
   * Get all appointments from the authenticated admin's clinic.
   */
  async findMyClinicAppointments(payload: FindMyClinicAppointmentsPayload): Promise<AppointmentsResponse> {
    const repository = this.getRepository(payload.manager);

    const status = payload?.status ? payload.status : AppointmentStatus.PENDING;

    const appointments = await repository.find({
      where: {
        timeSlot: {
          schedule: {
            doctorClinic: {
              clinicId: payload.clinicId,
            },
          },
        },
        status,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      appointments,
    };
  }

  /**
   * Get all appointments.
   */
  async findAll(payload: FindAppointmentsPayload): Promise<AppointmentsResponse> {
    const repository = this.getRepository(payload.manager);

    const status = payload?.status ? payload.status : AppointmentStatus.PENDING;

    const appointments = await repository.find({
      where: {
        status,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      appointments,
    };
  }

  /**
   * Get an appointment by ID.
   */
  async getById(payload: FindAppointmentByIdPayload): Promise<AppointmentResponse> {
    const repository = this.getRepository(payload.manager);

    const appointment = await repository.findOne({
      where: {
        id: payload.id,
      },
    });

    if (!appointment) {
      throw new NotFoundException({
        message: 'Appointment not found in database.',
        error: 'Appointment Not Found',
      } as BaseException);
    }

    return {
      appointment,
    };
  }

  /**
   * Reserve an appointment.
   */
  async reserveAppointment(payload: ReserveAppointmentPayload): Promise<AppointmentResponse> {
    try {
      return await this.databaseService.dataSource.transaction(async (manager) => {
        const repository = this.getRepository(manager);

        const { timeSlot } = await this.timeSlotService.updateStatus({
          id: payload.timeSlotId,
          status: TimeSlotStatus.HELD,
          manager,
        });

        const { patient } = await this.patientService.findById({
          id: payload.patientId,
          manager,
        });

        const { doctorSchedule } = await this.doctorScheduleService.getById({
          id: timeSlot.scheduleId,
          manager,
        });

        const { doctorClinic } = await this.doctorClinicService.findById({
          id: doctorSchedule.doctorClinicId,
          manager,
        });

        const { doctor } = await this.doctorService.findById({
          id: doctorClinic.doctorId,
          manager,
        });

        const appointment = repository.create({
          patientId: patient.id,
          timeSlotId: timeSlot.id,
          notes: payload.notes,
          expiresAt: new Date(getServerDateTime().getTime() + ms('10m')),
        });

        const savedAppointment = await repository.save(appointment);

        await this.paymentService.create({
          appointmentId: savedAppointment.id,
          amount: doctor.consultationFee,
          manager,
        });

        return { appointment: savedAppointment };
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'Appointment',
      });
    }
  }

  /**
   * Get all appointments belonging to a patient.
   */
  async findPatientAppointments(payload: FindPatientAppointmentsPayload): Promise<AppointmentsResponse> {
    const repository = this.getRepository(payload.manager);

    const appointments = await repository.find({
      where: {
        patientId: payload.patientId,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      appointments,
    };
  }

  /**
   * Get all appointments belonging to a doctor.
   */
  async findDoctorAppointments(payload: FindDoctorAppointmentsPayload): Promise<AppointmentsResponse> {
    const repository = this.getRepository(payload.manager);

    const appointments = await repository.find({
      where: {
        timeSlot: {
          schedule: {
            doctorClinic: {
              doctorId: payload.doctorId,
            },
          },
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      appointments,
    };
  }

  /**
   * Update an appointment's status and handle related time slot changes.
   */
  async handleAppointmentStatus(payload: HandleAppointmentStatusPayload): Promise<AppointmentResponse> {
    return this.databaseService.dataSource.transaction(async (manager) => {
      const { appointment } = await this.updateStatusAppointment({
        id: payload.id,
        status: payload.status,
        reason: payload.reason,
        manager,
      });

      if (payload.status === AppointmentStatus.CANCELLED) {
        await this.timeSlotService.updateStatus({
          id: appointment.timeSlotId,
          status: TimeSlotStatus.AVAILABLE,
          manager,
        });
      }

      return {
        appointment,
      };
    });
  }

  /**
   * Update an appointment's status.
   */
  async updateStatusAppointment(payload: UpdateAppointmentStatusPayload): Promise<AppointmentResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const { appointment } = await this.getById({
        id: payload.id,
        manager: payload.manager,
      });

      const allowed = APPOINTMENT_ALLOWED_TRANSITIONS[appointment.status];

      if (!allowed.includes(payload.status)) {
        throw new BadRequestException({
          message: `Cannot change appointment status from ${appointment.status} to ${payload.status}.`,
          error: 'Invalid Appointment Status Transition',
        } as BaseException);
      }

      appointment.status = payload.status;

      if (payload.status === AppointmentStatus.CANCELLED) {
        appointment.cancellationReason = payload.reason;
        appointment.cancelledAt = getServerDateTime();
      }

      const updatedAppointment = await repository.save(appointment);

      return {
        appointment: updatedAppointment,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'Appointment',
      });
    }
  }

  /**
   * Expire appointments whose payment deadline has passed.
   */
  async expireAppointments(): Promise<void> {
    const now = getServerDateTime();

    await this.databaseService.dataSource.transaction(async (manager) => {
      const repository = this.getRepository(manager);

      const appointments = await repository
        .createQueryBuilder('appointment')
        .setLock('pessimistic_write')
        .where('appointment.status = :status', {
          status: AppointmentStatus.PENDING,
        })
        .andWhere('appointment.expiresAt IS NOT NULL')
        .andWhere('appointment.expiresAt <= :now', { now })
        .getMany();

      for (const appointment of appointments) {
        const { timeSlot } = await this.timeSlotService.getById({
          id: appointment.timeSlotId,
          manager,
        });

        if (timeSlot.status === TimeSlotStatus.HELD) {
          const slotStartDateTime = combineDateAndTime(timeSlot.date, timeSlot.startTime);

          await this.timeSlotService.updateStatus({
            id: timeSlot.id,
            status: slotStartDateTime <= now ? TimeSlotStatus.EXPIRED : TimeSlotStatus.AVAILABLE,
            manager,
          });
        }
      }
    });
  }
}
