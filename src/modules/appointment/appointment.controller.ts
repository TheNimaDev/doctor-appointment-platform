import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import * as AppointmentDecorator from './decorators';
import type { ApiResponse, AppointmentResponse, AppointmentsResponse, AccessRequest } from '@/types';
import { ReserveAppointmentDto } from './dto';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  /**
   * Reserve an appointment.
   */
  @Post()
  @AppointmentDecorator.ReserveAppointmentDecorators()
  async reserveAppointment(
    @Req() req: AccessRequest,
    @Body() reserveAppointmentDto: ReserveAppointmentDto,
  ): Promise<ApiResponse<AppointmentResponse>> {
    const data = await this.appointmentService.reserveAppointment({
      patientId: req.user.userId,
      ...reserveAppointmentDto,
    });

    return {
      message: 'Appointment reserved successfully.',
      data,
    };
  }

  /**
   * Get all appointments.
   */
  @Get('all')
  @AppointmentDecorator.FindAppointmentsDecorators()
  async findAll(): Promise<ApiResponse<AppointmentsResponse>> {
    const data = await this.appointmentService.findAll({});

    return {
      message: 'Appointments retrieved successfully.',
      data,
    };
  }

  /**
   * Get an appointment by ID.
   */
  @Get('all/:id')
  @AppointmentDecorator.FindAppointmentDecorators()
  async getById(@Param('id') id: string): Promise<ApiResponse<AppointmentResponse>> {
    const data = await this.appointmentService.getById({
      id,
    });

    return {
      message: 'Appointment retrieved successfully.',
      data,
    };
  }

  /**
   * Get all appointments belonging to the current patient.
   */
  @Get()
  @AppointmentDecorator.FindPatientAppointmentsDecorators()
  async findPatientAppointments(@Req() req: AccessRequest): Promise<ApiResponse<AppointmentsResponse>> {
    const data = await this.appointmentService.findPatientAppointments({
      userId: req.user.userId,
    });

    return {
      message: 'Patient appointments retrieved successfully.',
      data,
    };
  }

  /**
   * Get all appointments belonging to the current doctor.
   */
  @Get('doctor')
  @AppointmentDecorator.FindDoctorAppointmentsDecorators()
  async findDoctorAppointments(@Req() req: AccessRequest): Promise<ApiResponse<AppointmentsResponse>> {
    const data = await this.appointmentService.findDoctorAppointments({
      userId: req.user.userId,
    });

    return {
      message: 'Doctor appointments retrieved successfully.',
      data,
    };
  }

  /**
   * Get an appointment by ID belonging to the current doctor.
   */
  @Get('doctor/:id')
  @AppointmentDecorator.FindDoctorAppointmentDecorators()
  async getDoctorAppointmentById(
    @Req() req: AccessRequest,
    @Param('id') id: string,
  ): Promise<ApiResponse<AppointmentResponse>> {
    const data = await this.appointmentService.getDoctorAppointmentById({
      userId: req.user.userId,
      id,
    });

    return {
      message: 'Doctor appointment retrieved successfully.',
      data,
    };
  }
}
