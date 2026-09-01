import { Controller, Get, Param } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import * as AppointmentDecorator from './decorators';

import type { ApiResponse, AppointmentResponse, AppointmentsResponse } from '@/types';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

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
