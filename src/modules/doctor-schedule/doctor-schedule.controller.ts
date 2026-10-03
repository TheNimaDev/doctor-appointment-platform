import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { DoctorScheduleService } from './doctor-schedule.service';
import { CreateDoctorScheduleDto, UpdateDoctorScheduleDto, UpdateDoctorScheduleStatusDto } from './dto';
import type {
  AccessRequest,
  ApiResponse,
  DoctorScheduleResponse,
  DoctorSchedulesResponse,
  OwnershipRequest,
  SafeDoctorSchedule,
} from '@/types';
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
  @DoctorScheduleDecorator.FindDoctorSchedulesByClinicDecorators()
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
  @DoctorScheduleDecorator.FindDoctorSchedulesByDoctorDecorators()
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
  @DoctorScheduleDecorator.FindDoctorSchedulesByDoctorAndClinicDecorators()
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
      doctorId: req.doctor!.id,
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
      doctorId: req.doctor!.id,
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
  @Get('my/:id')
  @DoctorScheduleDecorator.FindMyDoctorScheduleDecorators()
  async getMyById(@Req() req: OwnershipRequest<SafeDoctorSchedule>): Promise<ApiResponse<DoctorScheduleResponse>> {
    return {
      message: 'Doctor schedule retrieved successfully.',
      data: {
        doctorSchedule: req.ownershipData,
      },
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
      clinicId: req.clinic!.id,
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
  @DoctorScheduleDecorator.FindDoctorSchedulesForClinicDecorators()
  async findDoctorSchedulesForClinic(
    @Req() req: AccessRequest,
    @Param('doctorId') doctorId: string,
  ): Promise<ApiResponse<DoctorSchedulesResponse>> {
    const data = await this.doctorScheduleService.findByDoctorAndClinic({
      clinicId: req.clinic!.id,
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
  @Get('my-clinic/:id')
  @DoctorScheduleDecorator.FindDoctorScheduleByClinicOwnerDecorators()
  async getByClinicOwner(
    @Req() req: OwnershipRequest<SafeDoctorSchedule>,
  ): Promise<ApiResponse<DoctorScheduleResponse>> {
    return {
      message: 'Doctor schedule retrieved successfully.',
      data: {
        doctorSchedule: req.ownershipData,
      },
    };
  }

  /**
   * Get a specific doctor schedule.
   *
   * Public endpoint.
   */
  @Get(':id')
  @DoctorScheduleDecorator.FindDoctorScheduleDecorators()
  async getById(@Param('id') id: string): Promise<ApiResponse<DoctorScheduleResponse>> {
    const data = await this.doctorScheduleService.getActiveById({
      id,
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
      doctorId: req.doctor!.id,
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
  @Patch('my/:id')
  @DoctorScheduleDecorator.UpdateMyDoctorScheduleDecorators()
  async update(
    @Param('id') id: string,
    @Body() updateDoctorScheduleDto: UpdateDoctorScheduleDto,
  ): Promise<ApiResponse<DoctorScheduleResponse>> {
    const data = await this.doctorScheduleService.updateDoctorSchedule({
      id,
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
  @Patch('my-clinic/:id')
  @DoctorScheduleDecorator.UpdateDoctorScheduleDecorators()
  async updateForDoctor(
    @Param('id') id: string,
    @Body() updateDoctorScheduleDto: UpdateDoctorScheduleDto,
  ): Promise<ApiResponse<DoctorScheduleResponse>> {
    const data = await this.doctorScheduleService.updateDoctorSchedule({
      id,
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
  @Patch('my/:id/status')
  @DoctorScheduleDecorator.UpdateMyDoctorScheduleStatusDecorators()
  async updateStatus(
    @Param('id') id: string,
    @Body() updateDoctorScheduleStatusDto: UpdateDoctorScheduleStatusDto,
  ): Promise<ApiResponse<DoctorScheduleResponse>> {
    const data = await this.doctorScheduleService.updateDoctorScheduleStatus({
      id,
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
  @Patch('my-clinic/:id/status')
  @DoctorScheduleDecorator.UpdateDoctorScheduleStatusDecorators()
  async updateStatusForDoctor(
    @Param('id') id: string,
    @Body() updateDoctorScheduleStatusDto: UpdateDoctorScheduleStatusDto,
  ): Promise<ApiResponse<DoctorScheduleResponse>> {
    const data = await this.doctorScheduleService.updateDoctorScheduleStatus({
      id,
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
  @Delete('my/:id')
  @DoctorScheduleDecorator.DeleteMyDoctorScheduleDecorators()
  async delete(@Param('id') id: string): Promise<ApiResponse> {
    await this.doctorScheduleService.deleteDoctorSchedule({
      id,
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
  @Delete('my-clinic/:id')
  @DoctorScheduleDecorator.DeleteDoctorScheduleDecorators()
  async deleteForDoctor(@Param('id') id: string): Promise<ApiResponse> {
    await this.doctorScheduleService.deleteDoctorSchedule({
      id,
    });

    return {
      message: 'Doctor schedule deleted successfully.',
    };
  }
}
