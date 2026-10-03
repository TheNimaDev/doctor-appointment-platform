import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import * as AppointmentDecorator from './decorators';
import type {
  ApiResponse,
  AppointmentResponse,
  AppointmentsResponse,
  AccessRequest,
  OwnershipRequest,
  SafeAppointment,
} from '@/types';
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
      patientId: req.patient!.id,
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
      patientId: req.patient!.id,
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
      doctorId: req.doctor!.id,
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
    @Req() req: OwnershipRequest<SafeAppointment>,
  ): Promise<ApiResponse<AppointmentResponse>> {
    return {
      message: 'Doctor appointment retrieved successfully.',
      data: {
        appointment: req.ownershipData,
      },
    };
  }

  /**
   * Get all appointments belonging to the current admin's clinic.
   */
  @Get('my-clinic')
  @AppointmentDecorator.FindMyClinicAppointmentsDecorators()
  async getMyClinicAppointments(@Req() req: AccessRequest): Promise<ApiResponse<AppointmentsResponse>> {
    const data = await this.appointmentService.findMyClinicAppointments({
      clinicId: req.clinic!.id,
    });

    return {
      message: 'Clinic appointments retrieved successfully.',
      data,
    };
  }

  /**
   * Get all appointments belonging to the current admin's clinic.
   */
  @Get('my-clinic/:id')
  @AppointmentDecorator.FindMyClinicAppointmentDecorators()
  async getMyClinicAppointmentById(
    @Req() req: OwnershipRequest<SafeAppointment>,
  ): Promise<ApiResponse<AppointmentResponse>> {
    return {
      message: 'Clinic appointment retrieved successfully.',
      data: {
        appointment: req.ownershipData,
      },
    };
  }

  /**
   * Get an appointment by ID belonging to the current patient.
   */
  @Get(':id')
  @AppointmentDecorator.FindPatientAppointmentDecorators()
  async getPatientAppointmentById(
    @Req() req: OwnershipRequest<SafeAppointment>,
  ): Promise<ApiResponse<AppointmentResponse>> {
    return {
      message: 'Patient appointment retrieved successfully.',
      data: {
        appointment: req.ownershipData,
      },
    };
  }

  /**
   * Cancel an appointment belonging to the current patient.
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
   * Confirm an appointment belonging to the current admin's clinic.
   */
  @Patch('my-clinic/:id/confirm')
  @AppointmentDecorator.ConfirmMyClinicAppointmentDecorators()
  async confirmMyClinicAppointment(@Param('id') id: string): Promise<ApiResponse<AppointmentResponse>> {
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
   * Confirm an appointment belonging to the current doctor.
   */
  @Patch('my/:id/confirm')
  @AppointmentDecorator.ConfirmMyAppointmentDecorators()
  async confirmMyAppointment(@Param('id') id: string): Promise<ApiResponse<AppointmentResponse>> {
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
   * Reject an appointment belonging to the current admin's clinic.
   */
  @Patch('my-clinic/:id/reject')
  @AppointmentDecorator.RejectMyClinicAppointmentDecorators()
  async rejectMyClinicAppointment(@Param('id') id: string): Promise<ApiResponse<AppointmentResponse>> {
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
   * Reject an appointment belonging to the current doctor.
   */
  @Patch('my/:id/reject')
  @AppointmentDecorator.RejectMyAppointmentDecorators()
  async rejectMyAppointment(@Param('id') id: string): Promise<ApiResponse<AppointmentResponse>> {
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
   * Complete an appointment belonging to the current admin's clinic.
   */
  @Patch('my-clinic/:id/complete')
  @AppointmentDecorator.CompleteMyClinicAppointmentDecorators()
  async completeMyClinicAppointment(@Param('id') id: string): Promise<ApiResponse<AppointmentResponse>> {
    const data = await this.appointmentService.handleAppointmentStatus({
      id,
      status: AppointmentStatus.COMPLETED,
    });

    return {
      message: 'Appointment completed successfully.',
      data,
    };
  }

  /**
   * Complete an appointment belonging to the current doctor.
   */
  @Patch('my/:id/complete')
  @AppointmentDecorator.CompleteMyAppointmentDecorators()
  async completeMyAppointment(@Param('id') id: string): Promise<ApiResponse<AppointmentResponse>> {
    const data = await this.appointmentService.handleAppointmentStatus({
      id,
      status: AppointmentStatus.COMPLETED,
    });

    return {
      message: 'Appointment completed successfully.',
      data,
    };
  }

  /**
   * Mark an appointment as no-show belonging to the current admin's clinic.
   */
  @Patch('my-clinic/:id/no-show')
  @AppointmentDecorator.NoShowMyClinicAppointmentDecorators()
  async markAppointmentAsNoShow(@Param('id') id: string): Promise<ApiResponse<AppointmentResponse>> {
    const data = await this.appointmentService.handleAppointmentStatus({
      id,
      status: AppointmentStatus.NO_SHOW,
    });

    return {
      message: 'Appointment marked as no-show successfully.',
      data,
    };
  }

  /**
   * Mark an appointment as no-show belonging to the current doctor.
   */
  @Patch('my/:id/no-show')
  @AppointmentDecorator.NoShowMyAppointmentDecorators()
  async markMyAppointmentAsNoShow(@Param('id') id: string): Promise<ApiResponse<AppointmentResponse>> {
    const data = await this.appointmentService.handleAppointmentStatus({
      id,
      status: AppointmentStatus.NO_SHOW,
    });

    return {
      message: 'Appointment marked as no-show successfully.',
      data,
    };
  }
}
