import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import * as AppointmentDecorator from './decorators';
import type { ApiResponse, AppointmentResponse, AppointmentsResponse, AccessRequest } from '@/types';
import { CancelAppointmentDto, ReserveAppointmentDto } from './dto';
import { AppointmentStatus } from './enums';

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
   * Get an appointment by ID belonging to the current patient.
   */
  @Get(':id')
  @AppointmentDecorator.FindPatientAppointmentDecorators()
  async getPatientAppointmentById(
    @Req() req: AccessRequest,
    @Param('id') id: string,
  ): Promise<ApiResponse<AppointmentResponse>> {
    const data = await this.appointmentService.getPatientAppointmentById({
      id,
      userId: req.user.userId,
    });

    return {
      message: 'Patient appointment retrieved successfully.',
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

  /**
   * Cancel an appointment.
   */
  @Patch(':id/cancel')
  @AppointmentDecorator.CancelAppointmentDecorators()
  async cancelAppointment(
    @Param('id') id: string,
    @Body() cancelAppointmentDto: CancelAppointmentDto,
  ): Promise<ApiResponse<AppointmentResponse>> {
    const data = await this.appointmentService.handleAppointmentStatus({
      id,
      status: AppointmentStatus.CANCELLED,
      reason: cancelAppointmentDto.reason,
    });

    return {
      message: 'Appointment cancelled successfully.',
      data,
    };
  }

  /**
   * Confirm an appointment.
   */
  @Patch(':id/confirm')
  @AppointmentDecorator.ConfirmAppointmentDecorators()
  async confirmAppointment(@Param('id') id: string): Promise<ApiResponse<AppointmentResponse>> {
    const data = await this.appointmentService.handleAppointmentStatus({
      id,
      status: AppointmentStatus.CONFIRMED,
    });

    return {
      message: 'Appointment confirmed successfully.',
      data,
    };
  }

  /**
   * Reject an appointment.
   */
  @Patch(':id/reject')
  @AppointmentDecorator.RejectAppointmentDecorators()
  async rejectAppointment(@Param('id') id: string): Promise<ApiResponse<AppointmentResponse>> {
    const data = await this.appointmentService.handleAppointmentStatus({
      id,
      status: AppointmentStatus.REJECTED,
    });

    return {
      message: 'Appointment rejected successfully.',
      data,
    };
  }

  /**
   * Complete an appointment.
   */
  @Patch(':id/complete')
  @AppointmentDecorator.CompleteAppointmentDecorators()
  async completeAppointment(@Param('id') id: string): Promise<ApiResponse<AppointmentResponse>> {
    const data = await this.appointmentService.handleAppointmentStatus({
      id,
      status: AppointmentStatus.COMPLETED,
    });

    return {
      message: 'Appointment completed successfully.',
      data,
    };
  }
}
