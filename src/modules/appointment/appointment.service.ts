import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Appointment } from './entities';
import { checkDatabaseError } from '@/lib';
import {
  BaseException,
  CreateAppointmentPayload,
  FindAppointmentByIdPayload,
  FindAppointmentsPayload,
  AppointmentResponse,
  AppointmentsResponse,
  ReserveAppointmentPayload,
  FindPatientAppointmentsPayload,
  FindDoctorAppointmentsPayload,
  FindDoctorAppointmentByIdPayload,
} from '@/types';
import { TimeSlotService } from '@/modules/time-slot/time-slot.service';
import { TimeSlotStatus } from '@/modules/time-slot/enums';
import { DatabaseService } from '@/modules/database/database.service';
import { DoctorService } from '../doctor/doctor.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    private readonly databaseService: DatabaseService,
    private readonly timeSlotService: TimeSlotService,
    private readonly doctorService: DoctorService,
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
   * Create a new appointment.
   */
  async createAppointment(payload: CreateAppointmentPayload): Promise<AppointmentResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const appointment = repository.create({
        patientId: payload.patientId,
        timeSlotId: payload.timeSlotId,
        notes: payload.notes,
      });

      const savedAppointment = await repository.save(appointment);

      return {
        appointment: savedAppointment,
      };
    } catch (error) {
      checkDatabaseError({
        e: error as Error,
        mainResource: 'Appointment',
      });
    }
  }

  /**
   * Get all appointments.
   */
  async findAll(payload: FindAppointmentsPayload): Promise<AppointmentsResponse> {
    const repository = this.getRepository(payload.manager);

    const appointments = await repository.find({
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
    const appointment = await this.databaseService.dataSource.transaction(async (manager) => {
      const { appointment } = await this.createAppointment({
        patientId: payload.patientId,
        timeSlotId: payload.timeSlotId,
        notes: payload.notes,
        manager,
      });

      await this.timeSlotService.updateStatus({
        id: payload.timeSlotId,
        status: TimeSlotStatus.BOOKED,
        manager,
      });

      return appointment;
    });
    return {
      appointment,
    };
  }

  /**
   * Get all appointments belonging to a patient.
   */
  async findPatientAppointments(payload: FindPatientAppointmentsPayload): Promise<AppointmentsResponse> {
    const repository = this.getRepository(payload.manager);

    // TODO: Get patient ID from user ID after implementing Patient module.
    // const { patient } = await this.patientService.findByUserId({
    //   userId: payload.userId,
    //   manager: payload.manager,
    // });

    const appointments = await repository.find({
      where: {
        patientId: payload.userId, // TODO: Replace with patient.id
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

    const { doctor } = await this.doctorService.findByUserId({
      userId: payload.userId,
      manager: payload.manager,
    });

    const appointments = await repository.find({
      where: {
        timeSlot: {
          doctorId: doctor.id,
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
   * Get an appointment by ID belonging to the doctor.
   */
  async getDoctorAppointmentById(payload: FindDoctorAppointmentByIdPayload): Promise<AppointmentResponse> {
    const repository = this.getRepository(payload.manager);

    const { doctor } = await this.doctorService.findByUserId({
      userId: payload.userId,
      manager: payload.manager,
    });

    const appointment = await repository.findOne({
      where: {
        id: payload.id,
        timeSlot: {
          doctorId: doctor.id,
        },
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
}
