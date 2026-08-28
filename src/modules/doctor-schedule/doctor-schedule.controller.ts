import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { DoctorScheduleService } from './doctor-schedule.service';
import { CreateDoctorScheduleDto, UpdateDoctorScheduleDto, UpdateDoctorScheduleStatusDto } from './dto';
import type { ApiResponse, DoctorScheduleResponse, DoctorSchedulesResponse } from '@/types';
import * as DoctorScheduleDecorator from './decorators';

@Controller('clinics/:clinicId/doctor-schedules')
export class DoctorScheduleController {
  constructor(private readonly doctorScheduleService: DoctorScheduleService) {}

  /**
   * Create a new doctor schedule for a clinic.
   */
  @Post()
  @DoctorScheduleDecorator.CreateDoctorScheduleDecorators()
  async create(
    @Param('clinicId') clinicId: string,
    @Body() createDoctorScheduleDto: CreateDoctorScheduleDto,
  ): Promise<ApiResponse<DoctorScheduleResponse>> {
    const data = await this.doctorScheduleService.createDoctorSchedule({
      clinicId,
      ...createDoctorScheduleDto,
    });

    return {
      message: 'Doctor schedule created successfully.',
      data,
    };
  }

  /**
   * Get all doctor schedules belonging to a clinic.
   */
  @Get()
  @DoctorScheduleDecorator.FindDoctorSchedulesDecorators()
  async findAll(@Param('clinicId') clinicId: string): Promise<ApiResponse<DoctorSchedulesResponse>> {
    const data = await this.doctorScheduleService.findByClinicId({
      clinicId,
    });

    return {
      message: 'Doctor schedules retrieved successfully.',
      data,
    };
  }

  /**
   * Get a specific doctor schedule.
   */
  @Get(':scheduleId')
  @DoctorScheduleDecorator.FindDoctorScheduleDecorators()
  async findById(
    @Param('clinicId') clinicId: string,
    @Param('scheduleId') scheduleId: string,
  ): Promise<ApiResponse<DoctorScheduleResponse>> {
    const data = await this.doctorScheduleService.getById({
      id: scheduleId,
      clinicId,
    });

    return {
      message: 'Doctor schedule retrieved successfully.',
      data,
    };
  }

  /**
   * Update a doctor schedule.
   */
  @Patch(':scheduleId')
  @DoctorScheduleDecorator.UpdateDoctorScheduleDecorators()
  async update(
    @Param('clinicId') clinicId: string,
    @Param('scheduleId') scheduleId: string,
    @Body() updateDoctorScheduleDto: UpdateDoctorScheduleDto,
  ): Promise<ApiResponse<DoctorScheduleResponse>> {
    const data = await this.doctorScheduleService.updateDoctorSchedule({
      id: scheduleId,
      clinicId,
      ...updateDoctorScheduleDto,
    });

    return {
      message: 'Doctor schedule updated successfully.',
      data,
    };
  }

  /**
   * Soft-delete a doctor schedule.
   */
  @Delete(':scheduleId')
  @DoctorScheduleDecorator.DeleteDoctorScheduleDecorators()
  async delete(@Param('clinicId') clinicId: string, @Param('scheduleId') scheduleId: string): Promise<ApiResponse> {
    await this.doctorScheduleService.deleteDoctorSchedule({
      id: scheduleId,
      clinicId,
    });

    return {
      message: 'Doctor schedule deleted successfully.',
    };
  }

  /**
   * Update the status of a doctor schedule.
   */
  @Patch(':scheduleId/status')
  @DoctorScheduleDecorator.UpdateDoctorScheduleStatusDecorators()
  async updateStatus(
    @Param('clinicId') clinicId: string,
    @Param('scheduleId') scheduleId: string,
    @Body() updateDoctorScheduleStatusDto: UpdateDoctorScheduleStatusDto,
  ): Promise<ApiResponse<DoctorScheduleResponse>> {
    const data = await this.doctorScheduleService.updateDoctorScheduleStatus({
      id: scheduleId,
      clinicId,
      ...updateDoctorScheduleStatusDto,
    });

    return {
      message: 'Doctor schedule status updated successfully.',
      data,
    };
  }
}
