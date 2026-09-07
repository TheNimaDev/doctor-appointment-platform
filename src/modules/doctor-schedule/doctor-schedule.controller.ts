import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { DoctorScheduleService } from './doctor-schedule.service';
import { CreateDoctorScheduleDto, UpdateDoctorScheduleDto, UpdateDoctorScheduleStatusDto } from './dto';
import type { AccessRequest, ApiResponse, DoctorScheduleResponse, DoctorSchedulesResponse } from '@/types';
import * as DoctorScheduleDecorator from './decorators';

@Controller('clinics')
export class DoctorScheduleController {
  constructor(private readonly doctorScheduleService: DoctorScheduleService) {}

  /**
   * Get all schedules of a doctor in a clinic.
   *
   * Public endpoint.
   */
  @Get(':clinicId/doctors/:doctorId/schedules')
  @DoctorScheduleDecorator.FindDoctorSchedulesDecorators()
  async findByDoctorAndClinic(
    @Param('clinicId') clinicId: string,
    @Param('doctorId') doctorId: string,
  ): Promise<ApiResponse<DoctorSchedulesResponse>> {
    const data = await this.doctorScheduleService.findByDoctorAndClinic({
      clinicId,
      doctorId,
    });

    return {
      message: 'Doctor schedules retrieved successfully.',
      data,
    };
  }

  /**
   * Get a specific doctor schedule.
   *
   * Public endpoint.
   */
  @Get(':clinicId/doctors/:doctorId/schedules/:scheduleId')
  @DoctorScheduleDecorator.FindDoctorScheduleDecorators()
  async findById(
    @Param('clinicId') clinicId: string,
    @Param('doctorId') doctorId: string,
    @Param('scheduleId') scheduleId: string,
  ): Promise<ApiResponse<DoctorScheduleResponse>> {
    const data = await this.doctorScheduleService.getById({
      id: scheduleId,
      clinicId,
      doctorId,
    });

    return {
      message: 'Doctor schedule retrieved successfully.',
      data,
    };
  }

  /**
   * Create a schedule for the authenticated doctor.
   */
  @Post(':clinicId/my-schedules')
  @DoctorScheduleDecorator.CreateMyDoctorScheduleDecorators()
  async create(
    @Req() req: AccessRequest,
    @Param('clinicId') clinicId: string,
    @Body() createDoctorScheduleDto: CreateDoctorScheduleDto,
  ): Promise<ApiResponse<DoctorScheduleResponse>> {
    const data = await this.doctorScheduleService.createDoctorSchedule({
      userId: req.user.userId,
      clinicId,
      ...createDoctorScheduleDto,
    });

    return {
      message: 'Doctor schedule created successfully.',
      data,
    };
  }

  /**
   * Create a schedule for a doctor.
   *
   * Clinic admin endpoint.
   */
  @Post(':clinicId/doctors/:doctorId/schedules')
  @DoctorScheduleDecorator.CreateDoctorScheduleDecorators()
  async createForDoctor(
    @Param('clinicId') clinicId: string,
    @Param('doctorId') doctorId: string,
    @Body() createDoctorScheduleDto: CreateDoctorScheduleDto,
  ): Promise<ApiResponse<DoctorScheduleResponse>> {
    const data = await this.doctorScheduleService.createDoctorSchedule({
      doctorId,
      clinicId,
      ...createDoctorScheduleDto,
    });

    return {
      message: 'Doctor schedule created successfully.',
      data,
    };
  }

  /**
   * Update the authenticated doctor's own schedule.
   */
  @Patch(':clinicId/my-schedules/:scheduleId')
  @DoctorScheduleDecorator.UpdateMyDoctorScheduleDecorators()
  async update(
    @Req() req: AccessRequest,
    @Param('clinicId') clinicId: string,
    @Param('scheduleId') scheduleId: string,
    @Body() updateDoctorScheduleDto: UpdateDoctorScheduleDto,
  ): Promise<ApiResponse<DoctorScheduleResponse>> {
    const data = await this.doctorScheduleService.updateDoctorSchedule({
      id: scheduleId,
      userId: req.user.userId,
      clinicId,
      ...updateDoctorScheduleDto,
    });

    return {
      message: 'Doctor schedule updated successfully.',
      data,
    };
  }

  /**
   * Update a doctor's schedule.
   *
   * Clinic admin endpoint.
   */
  @Patch(':clinicId/doctors/:doctorId/schedules/:scheduleId')
  @DoctorScheduleDecorator.UpdateDoctorScheduleDecorators()
  async updateForDoctor(
    @Param('clinicId') clinicId: string,
    @Param('doctorId') doctorId: string,
    @Param('scheduleId') scheduleId: string,
    @Body() updateDoctorScheduleDto: UpdateDoctorScheduleDto,
  ): Promise<ApiResponse<DoctorScheduleResponse>> {
    const data = await this.doctorScheduleService.updateDoctorSchedule({
      id: scheduleId,
      doctorId,
      clinicId,
      ...updateDoctorScheduleDto,
    });

    return {
      message: 'Doctor schedule updated successfully.',
      data,
    };
  }

  /**
   * Update the authenticated doctor's own schedule status.
   */
  @Patch(':clinicId/my-schedules/:scheduleId/status')
  @DoctorScheduleDecorator.UpdateMyDoctorScheduleStatusDecorators()
  async updateStatus(
    @Req() req: AccessRequest,
    @Param('clinicId') clinicId: string,
    @Param('scheduleId') scheduleId: string,
    @Body() updateDoctorScheduleStatusDto: UpdateDoctorScheduleStatusDto,
  ): Promise<ApiResponse<DoctorScheduleResponse>> {
    const data = await this.doctorScheduleService.updateDoctorScheduleStatus({
      id: scheduleId,
      userId: req.user.userId,
      clinicId,
      ...updateDoctorScheduleStatusDto,
    });

    return {
      message: 'Doctor schedule status updated successfully.',
      data,
    };
  }

  /**
   * Update a doctor's schedule status.
   *
   * Clinic admin endpoint.
   */
  @Patch(':clinicId/doctors/:doctorId/schedules/:scheduleId/status')
  @DoctorScheduleDecorator.UpdateDoctorScheduleStatusDecorators()
  async updateStatusForDoctor(
    @Param('clinicId') clinicId: string,
    @Param('doctorId') doctorId: string,
    @Param('scheduleId') scheduleId: string,
    @Body() updateDoctorScheduleStatusDto: UpdateDoctorScheduleStatusDto,
  ): Promise<ApiResponse<DoctorScheduleResponse>> {
    const data = await this.doctorScheduleService.updateDoctorScheduleStatus({
      id: scheduleId,
      doctorId,
      clinicId,
      ...updateDoctorScheduleStatusDto,
    });

    return {
      message: 'Doctor schedule status updated successfully.',
      data,
    };
  }

  /**
   * Delete the authenticated doctor's own schedule.
   */
  @Delete(':clinicId/my-schedules/:scheduleId')
  @DoctorScheduleDecorator.DeleteMyDoctorScheduleDecorators()
  async delete(
    @Req() req: AccessRequest,
    @Param('clinicId') clinicId: string,
    @Param('scheduleId') scheduleId: string,
  ): Promise<ApiResponse> {
    await this.doctorScheduleService.deleteDoctorSchedule({
      id: scheduleId,
      userId: req.user.userId,
      clinicId,
    });

    return {
      message: 'Doctor schedule deleted successfully.',
    };
  }

  /**
   * Delete a doctor's schedule.
   *
   * Clinic admin endpoint.
   */
  @Delete(':clinicId/doctors/:doctorId/schedules/:scheduleId')
  @DoctorScheduleDecorator.DeleteDoctorScheduleDecorators()
  async deleteForDoctor(
    @Param('clinicId') clinicId: string,
    @Param('doctorId') doctorId: string,
    @Param('scheduleId') scheduleId: string,
  ): Promise<ApiResponse> {
    await this.doctorScheduleService.deleteDoctorSchedule({
      id: scheduleId,
      doctorId,
      clinicId,
    });

    return {
      message: 'Doctor schedule deleted successfully.',
    };
  }
}
