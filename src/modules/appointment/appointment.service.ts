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
} from '@/types';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
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
}
