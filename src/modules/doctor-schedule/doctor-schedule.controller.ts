import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { DoctorScheduleService } from './doctor-schedule.service';
import { CreateDoctorScheduleDto, UpdateDoctorScheduleDto, UpdateDoctorScheduleStatusDto } from './dto';
import type { AccessRequest, ApiResponse, DoctorScheduleResponse, DoctorSchedulesResponse } from '@/types';
import * as DoctorScheduleDecorator from './decorators';
import { ScheduleStatus } from './enums';

@Controller('doctor-schedules')
export class DoctorScheduleController {
  constructor(private readonly doctorScheduleService: DoctorScheduleService) {}

  /**
   * Get all schedules of all clinics.
   */
  @Get()
  @DoctorScheduleDecorator.FindAllDoctorSchedulesDecorators()
  async getAll(@Query('status') status?: ScheduleStatus): Promise<ApiResponse<DoctorSchedulesResponse>> {
    const data = await this.doctorScheduleService.findAll({ status });

    return {
      message: 'Doctor schedules retrieved successfully.',
      data,
    };
  }

  /**
   * Get all active schedules of a clinic.
   *
   * Public endpoint.
   */
  @Get('clinic/:clinicId')
  @DoctorScheduleDecorator.FindDoctorSchedulesDecorators()
  async findActiveByClinic(@Param('clinicId') clinicId: string): Promise<ApiResponse<DoctorSchedulesResponse>> {
    const data = await this.doctorScheduleService.findActiveByClinic({
      clinicId,
    });

    return {
      message: 'Clinic schedules retrieved successfully.',
      data,
    };
  }

  /**
   * Get all active schedules of a doctor.
   *
   * Public endpoint.
   */
  @Get('doctor/:doctorId')
  @DoctorScheduleDecorator.FindDoctorSchedulesDecorators()
  async findActiveByDoctor(@Param('doctorId') doctorId: string): Promise<ApiResponse<DoctorSchedulesResponse>> {
    const data = await this.doctorScheduleService.findActiveByDoctor({
      doctorId,
    });

    return {
      message: 'Doctor schedules retrieved successfully.',
      data,
    };
  }

  /**
   * Get all active schedules of a doctor in a clinic.
   *
   * Public endpoint.
   */
  @Get('doctor/:doctorId/clinic/:clinicId')
  @DoctorScheduleDecorator.FindDoctorSchedulesDecorators()
  async findActiveByDoctorAndClinic(
    @Param('clinicId') clinicId: string,
    @Param('doctorId') doctorId: string,
  ): Promise<ApiResponse<DoctorSchedulesResponse>> {
    const data = await this.doctorScheduleService.findActiveByDoctorAndClinic({
      clinicId,
      doctorId,
    });

    return {
      message: 'Clinic schedules retrieved successfully.',
      data,
    };
  }

  /**
   * Get all schedules of the authenticated doctor.
   */
  @Get('my')
  @DoctorScheduleDecorator.FindMyDoctorSchedulesDecorators()
  async findMySchedules(@Req() req: AccessRequest): Promise<ApiResponse<DoctorSchedulesResponse>> {
    const data = await this.doctorScheduleService.findByDoctor({
      userId: req.user.userId,
    });

    return {
      message: 'Doctor schedules retrieved successfully.',
      data,
    };
  }

  /**
   * Get the authenticated doctor's schedules in a specific clinic.
   */
  @Get('my/clinic/:clinicId')
  @DoctorScheduleDecorator.FindMyDoctorClinicSchedulesDecorators()
  async findMyClinicSchedulesByDoctorId(
    @Req() req: AccessRequest,
    @Param('clinicId') clinicId: string,
  ): Promise<ApiResponse<DoctorSchedulesResponse>> {
    const data = await this.doctorScheduleService.findByDoctorAndClinic({
      userId: req.user.userId,
      clinicId,
    });

    return {
      message: 'Doctor schedules retrieved successfully.',
      data,
    };
  }

  /**
   * Get the authenticated doctor's schedule by ID.
   */
  @Get('my/:scheduleId')
  @DoctorScheduleDecorator.FindMyDoctorScheduleDecorators()
  async getMyById(
    @Req() req: AccessRequest,
    @Param('scheduleId') scheduleId: string,
  ): Promise<ApiResponse<DoctorScheduleResponse>> {
    const data = await this.doctorScheduleService.getById({
      id: scheduleId,
      userId: req.user.userId,
    });

    return {
      message: 'Doctor schedule retrieved successfully.',
      data,
    };
  }

  /**
   * Get all schedules of the authenticated clinic.
   *
   * Clinic admin endpoint.
   */
  @Get('my-clinic')
  @DoctorScheduleDecorator.FindMyClinicSchedulesDecorators()
  async findMyClinicSchedules(@Req() req: AccessRequest): Promise<ApiResponse<DoctorSchedulesResponse>> {
    const data = await this.doctorScheduleService.findByClinic({
      userId: req.user.userId,
    });

    return {
      message: 'Clinic schedules retrieved successfully.',
      data,
    };
  }

  /**
   * Get a doctor's schedules in the authenticated clinic.
   *
   * Clinic admin endpoint.
   */
  @Get('my-clinic/doctor/:doctorId')
  @DoctorScheduleDecorator.FindDoctorClinicSchedulesForClinicDecorators()
  async findDoctorSchedulesForClinic(
    @Req() req: AccessRequest,
    @Param('doctorId') doctorId: string,
  ): Promise<ApiResponse<DoctorSchedulesResponse>> {
    const data = await this.doctorScheduleService.findByDoctorAndClinic({
      clinicOwnerId: req.user.userId,
      doctorId,
    });

    return {
      message: 'Doctor schedules retrieved successfully.',
      data,
    };
  }

  /**
   * Get a specific schedule belonging to the authenticated clinic.
   *
   * Clinic admin endpoint.
   */
  @Get('my-clinic/:scheduleId')
  @DoctorScheduleDecorator.FindDoctorScheduleByClinicOwnerDecorators()
  async getByClinicOwner(
    @Req() req: AccessRequest,
    @Param('scheduleId') scheduleId: string,
  ): Promise<ApiResponse<DoctorScheduleResponse>> {
    const data = await this.doctorScheduleService.getById({
      id: scheduleId,
      clinicOwnerId: req.user.userId,
    });

    return {
      message: 'Doctor schedule retrieved successfully.',
      data,
    };
  }

  /**
   * Get a specific doctor schedule.
   *
   * Public endpoint.
   */
  @Get(':scheduleId')
  @DoctorScheduleDecorator.FindDoctorScheduleDecorators()
  async getById(@Param('scheduleId') scheduleId: string): Promise<ApiResponse<DoctorScheduleResponse>> {
    const data = await this.doctorScheduleService.getActiveById({
      id: scheduleId,
    });

    return {
      message: 'Doctor schedule retrieved successfully.',
      data,
    };
  }

  /**
   * Create a schedule for the authenticated doctor.
   */
  @Post('my')
  @DoctorScheduleDecorator.CreateMyDoctorScheduleDecorators()
  async create(
    @Req() req: AccessRequest,
    @Body() createDoctorScheduleDto: CreateDoctorScheduleDto,
  ): Promise<ApiResponse<DoctorScheduleResponse>> {
    const data = await this.doctorScheduleService.createDoctorSchedule({
      userId: req.user.userId,
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
  @Patch('my/:scheduleId')
  @DoctorScheduleDecorator.UpdateMyDoctorScheduleDecorators()
  async update(
    @Req() req: AccessRequest,
    @Param('scheduleId') scheduleId: string,
    @Body() updateDoctorScheduleDto: UpdateDoctorScheduleDto,
  ): Promise<ApiResponse<DoctorScheduleResponse>> {
    const data = await this.doctorScheduleService.updateDoctorSchedule({
      id: scheduleId,
      userId: req.user.userId,
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
  @Patch('my-clinic/:scheduleId')
  @DoctorScheduleDecorator.UpdateDoctorScheduleDecorators()
  async updateForDoctor(
    @Req() req: AccessRequest,
    @Param('scheduleId') scheduleId: string,
    @Body() updateDoctorScheduleDto: UpdateDoctorScheduleDto,
  ): Promise<ApiResponse<DoctorScheduleResponse>> {
    const data = await this.doctorScheduleService.updateDoctorSchedule({
      id: scheduleId,
      clinicOwnerId: req.user.userId,
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
  @Patch('my/:scheduleId/status')
  @DoctorScheduleDecorator.UpdateMyDoctorScheduleStatusDecorators()
  async updateStatus(
    @Req() req: AccessRequest,
    @Param('scheduleId') scheduleId: string,
    @Body() updateDoctorScheduleStatusDto: UpdateDoctorScheduleStatusDto,
  ): Promise<ApiResponse<DoctorScheduleResponse>> {
    const data = await this.doctorScheduleService.updateDoctorScheduleStatus({
      id: scheduleId,
      userId: req.user.userId,
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
  @Patch('my-clinic/:scheduleId/status')
  @DoctorScheduleDecorator.UpdateDoctorScheduleStatusDecorators()
  async updateStatusForDoctor(
    @Req() req: AccessRequest,
    @Param('scheduleId') scheduleId: string,
    @Body() updateDoctorScheduleStatusDto: UpdateDoctorScheduleStatusDto,
  ): Promise<ApiResponse<DoctorScheduleResponse>> {
    const data = await this.doctorScheduleService.updateDoctorScheduleStatus({
      id: scheduleId,
      clinicOwnerId: req.user.userId,
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
  @Delete('my/:scheduleId')
  @DoctorScheduleDecorator.DeleteMyDoctorScheduleDecorators()
  async delete(@Req() req: AccessRequest, @Param('scheduleId') scheduleId: string): Promise<ApiResponse> {
    await this.doctorScheduleService.deleteDoctorSchedule({
      id: scheduleId,
      userId: req.user.userId,
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
  @Delete('my-clinic/:scheduleId')
  @DoctorScheduleDecorator.DeleteDoctorScheduleDecorators()
  async deleteForDoctor(@Req() req: AccessRequest, @Param('scheduleId') scheduleId: string): Promise<ApiResponse> {
    await this.doctorScheduleService.deleteDoctorSchedule({
      id: scheduleId,
      clinicOwnerId: req.user.userId,
    });

    return {
      message: 'Doctor schedule deleted successfully.',
    };
  }
}
