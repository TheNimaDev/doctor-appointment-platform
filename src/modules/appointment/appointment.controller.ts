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
  @Get()
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
  @Get(':id')
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
}
