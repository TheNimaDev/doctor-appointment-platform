import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { CreateClinicDto, UpdateClinicDto, UpdateClinicStatusDto } from './dto';
import type { ApiResponse, ClinicResponse, ClinicsResponse } from '@/types';

@Controller('doctors/:doctorId/clinics')
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  /**
   * Create a new clinic for a doctor.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('doctorId') doctorId: string,
    @Body() createClinicDto: CreateClinicDto,
  ): Promise<ApiResponse<ClinicResponse>> {
    const data = await this.clinicService.create({
      doctorId,
      ...createClinicDto,
    });

    return {
      message: 'Clinic created successfully.',
      data,
    };
  }

  /**
   * Get all clinics belonging to a doctor.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findByDoctorId(@Param('doctorId') doctorId: string): Promise<ApiResponse<ClinicsResponse>> {
    const data = await this.clinicService.findByDoctorId({
      doctorId,
    });

    return {
      message: 'Doctor clinics retrieved successfully.',
      data,
    };
  }

  /**
   * Get a specific clinic belonging to a doctor.
   */
  @Get(':clinicId')
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param('doctorId') doctorId: string,
    @Param('clinicId') clinicId: string,
  ): Promise<ApiResponse<ClinicResponse>> {
    const data = await this.clinicService.findById({
      id: clinicId,
      doctorId,
    });

    return {
      message: 'Clinic retrieved successfully.',
      data,
    };
  }

  /**
   * Update a clinic.
   */
  @Patch(':clinicId')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('doctorId') doctorId: string,
    @Param('clinicId') clinicId: string,
    @Body() updateClinicDto: UpdateClinicDto,
  ): Promise<ApiResponse> {
    await this.clinicService.update({
      id: clinicId,
      doctorId,
      ...updateClinicDto,
    });

    return {
      message: 'Clinic updated successfully.',
    };
  }

  /**
   * Soft-delete a clinic.
   */
  @Delete(':clinicId')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('doctorId') doctorId: string, @Param('clinicId') clinicId: string): Promise<ApiResponse> {
    await this.clinicService.delete({
      id: clinicId,
      doctorId,
    });

    return {
      message: 'Clinic deleted successfully.',
    };
  }

  /**
   * Update the status of a clinic.
   */
  @Patch(':clinicId/status')
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('doctorId') doctorId: string,
    @Param('clinicId') clinicId: string,
    @Body() updateClinicStatusDto: UpdateClinicStatusDto,
  ): Promise<ApiResponse> {
    await this.clinicService.updateStatus({
      id: clinicId,
      doctorId,
      ...updateClinicStatusDto,
    });

    return {
      message: 'Clinic status updated successfully.',
    };
  }
}
