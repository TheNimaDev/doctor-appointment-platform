import { Controller, Get, Param, Patch, Query, Req } from '@nestjs/common';
import { TimeSlotService } from './time-slot.service';
import type { AccessRequest, ApiResponse, TimeSlotResponse, TimeSlotsResponse } from '@/types';
import * as TimeSlotDecorator from './decorators';
import { TimeSlotStatus } from './enums';

@Controller('time-slot')
export class TimeSlotController {
  constructor(private readonly timeSlotService: TimeSlotService) {}

  /**
   * Find available time slots for a doctor.
   */
  @Get('doctors/:doctorId')
  @TimeSlotDecorator.FindAvailableTimeSlotsDecorators()
  async findAvailableByDoctor(
    @Param('doctorId') doctorId: string,
    @Query('date') date?: string,
  ): Promise<ApiResponse<TimeSlotsResponse>> {
    const data = await this.timeSlotService.findByClinicOrDoctor({
      doctorId,
      date,
    });

    return {
      message: 'Available time slots retrieved successfully.',
      data,
    };
  }

  /**
   * Find available time slots for a doctor in a specific clinic.
   */
  @Get('doctors/:doctorId/clinics/:clinicId')
  @TimeSlotDecorator.FindAvailableDoctorClinicTimeSlotsDecorators()
  async findAvailableByDoctorAndClinic(
    @Param('doctorId') doctorId: string,
    @Param('clinicId') clinicId: string,
    @Query('date') date?: string,
  ): Promise<ApiResponse<TimeSlotsResponse>> {
    const data = await this.timeSlotService.findByClinicAndDoctor({
      doctorId,
      clinicId,
      date,
    });

    return {
      message: 'Available time slots retrieved successfully.',
      data,
    };
  }

  /**
   * Find available time slots for a clinic.
   */
  @Get('clinics/:clinicId')
  @TimeSlotDecorator.FindAvailableClinicTimeSlotsDecorators()
  async findAvailableByClinic(
    @Param('clinicId') clinicId: string,
    @Query('date') date?: string,
  ): Promise<ApiResponse<TimeSlotsResponse>> {
    const data = await this.timeSlotService.findByClinicOrDoctor({
      clinicId,
      date,
    });

    return {
      message: 'Available time slots retrieved successfully.',
      data,
    };
  }

  /**
   * Find all time slots belonging to the authenticated doctor.
   */
  @Get('my')
  @TimeSlotDecorator.FindMyTimeSlotsDecorators()
  async findMy(@Req() req: AccessRequest, @Query('date') date?: string): Promise<ApiResponse<TimeSlotsResponse>> {
    const data = await this.timeSlotService.findByClinicOrDoctor({
      doctorId: req.doctor!.id,
      date,
    });

    return {
      message: 'Time slots retrieved successfully.',
      data,
    };
  }

  /**
   * Find time slots of the authenticated doctor in a specific clinic.
   */
  @Get('my/clinics/:clinicId')
  @TimeSlotDecorator.FindMyClinicTimeSlotsDecorators()
  async findMyByClinic(
    @Req() req: AccessRequest,
    @Param('clinicId') clinicId: string,
    @Query('date') date?: string,
  ): Promise<ApiResponse<TimeSlotsResponse>> {
    const data = await this.timeSlotService.findByClinicAndDoctor({
      doctorId: req.doctor!.id,
      clinicId,
      date,
    });

    return {
      message: 'Time slots retrieved successfully.',
      data,
    };
  }

  /**
   * Find all time slots of all doctors in the authenticated admin's clinic.
   */
  @Get('my-clinic')
  @TimeSlotDecorator.FindMyClinicAdminTimeSlotsDecorators()
  async findMyClinic(@Req() req: AccessRequest, @Query('date') date?: string): Promise<ApiResponse<TimeSlotsResponse>> {
    const data = await this.timeSlotService.findByClinicOrDoctor({
      clinicId: req.clinic!.id,
      date,
    });

    return {
      message: 'Clinic time slots retrieved successfully.',
      data,
    };
  }

  /**
   * Find time slots of a specific doctor in the authenticated admin's clinic.
   */
  @Get('my-clinic/doctors/:doctorId')
  @TimeSlotDecorator.FindMyClinicAdminDoctorTimeSlotsDecorators()
  async findMyClinicByDoctor(
    @Req() req: AccessRequest,
    @Param('doctorId') doctorId: string,
    @Query('date') date?: string,
  ): Promise<ApiResponse<TimeSlotsResponse>> {
    const data = await this.timeSlotService.findByClinicAndDoctor({
      doctorId,
      clinicId: req.clinic!.id,
      date,
    });

    return {
      message: 'Doctor time slots retrieved successfully.',
      data,
    };
  }

  /**
   * Get a specific time slot from the authenticated admin's clinic.
   */
  @Get('my-clinic/:id')
  @TimeSlotDecorator.FindMyClinicAdminTimeSlotDecorators()
  async getMyClinicById(@Param('id') id: string): Promise<ApiResponse<TimeSlotResponse>> {
    const data = await this.timeSlotService.getById({
      id,
    });

    return {
      message: 'Time slot retrieved successfully.',
      data,
    };
  }

  /**
   * Get a specific time slot belonging to the authenticated doctor.
   */
  @Get('my/:id')
  @TimeSlotDecorator.FindMyTimeSlotDecorators()
  async getMyById(@Param('id') id: string): Promise<ApiResponse<TimeSlotResponse>> {
    const data = await this.timeSlotService.getById({
      id,
    });

    return {
      message: 'Time slot retrieved successfully.',
      data,
    };
  }

  /**
   * Get an available time slot.
   */
  @Get(':id')
  @TimeSlotDecorator.FindAvailableTimeSlotDecorators()
  async getById(@Param('id') id: string): Promise<ApiResponse<TimeSlotResponse>> {
    const data = await this.timeSlotService.getById({
      id,
      status: TimeSlotStatus.AVAILABLE,
    });

    return {
      message: 'Time slot retrieved successfully.',
      data,
    };
  }

  /**
   * Block a time slot belonging to the authenticated doctor.
   */
  @Patch('my/:id/block')
  @TimeSlotDecorator.BlockMyTimeSlotDecorators()
  async blockMy(@Param('id') id: string): Promise<ApiResponse<TimeSlotResponse>> {
    const data = await this.timeSlotService.updateStatusHandler({
      id,
      status: TimeSlotStatus.BLOCKED,
    });

    return {
      message: 'Time slot blocked successfully.',
      data,
    };
  }

  /**
   * Unblock a time slot belonging to the authenticated doctor.
   */
  @Patch('my/:id/unblock')
  @TimeSlotDecorator.UnblockMyTimeSlotDecorators()
  async unblockMy(@Param('id') id: string): Promise<ApiResponse<TimeSlotResponse>> {
    const data = await this.timeSlotService.updateStatusHandler({
      id,
      status: TimeSlotStatus.AVAILABLE,
    });

    return {
      message: 'Time slot unblocked successfully.',
      data,
    };
  }

  /**
   * Block a time slot belonging to a doctor in the admin's clinic.
   */
  @Patch('my-clinic/:id/block')
  @TimeSlotDecorator.BlockMyClinicTimeSlotDecorators()
  async blockMyClinic(@Param('id') id: string): Promise<ApiResponse<TimeSlotResponse>> {
    const data = await this.timeSlotService.updateStatusHandler({
      id,
      status: TimeSlotStatus.BLOCKED,
    });

    return {
      message: 'Time slot blocked successfully.',
      data,
    };
  }

  /**
   * Unblock a time slot belonging to a doctor in the admin's clinic.
   */
  @Patch('my-clinic/:id/unblock')
  @TimeSlotDecorator.UnblockMyClinicTimeSlotDecorators()
  async unblockMyClinic(@Param('id') id: string): Promise<ApiResponse<TimeSlotResponse>> {
    const data = await this.timeSlotService.updateStatusHandler({
      id,
      status: TimeSlotStatus.AVAILABLE,
    });

    return {
      message: 'Time slot unblocked successfully.',
      data,
    };
  }
}
