import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { CreateClinicDto, UpdateClinicDto, UpdateClinicStatusDto } from './dto';
import type { AccessRequest, ApiResponse, ClinicResponse, ClinicsResponse } from '@/types';
import * as ClinicDecorator from './decorators';

@Controller('clinics')
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  /**
   * Create a new clinic for the current user.
   */
  @Post()
  @ClinicDecorator.CreateClinicDecorators()
  async create(
    @Req() req: AccessRequest,
    @Body() createClinicDto: CreateClinicDto,
  ): Promise<ApiResponse<ClinicResponse>> {
    const data = await this.clinicService.create({
      ownerId: req.user.userId,
      ...createClinicDto,
    });

    return {
      message: 'Clinic created successfully.',
      data,
    };
  }

  /**
   * Get all clinics.
   */
  @Get()
  @ClinicDecorator.FindClinicsDecorators()
  async findAll(): Promise<ApiResponse<ClinicsResponse>> {
    const data = await this.clinicService.findAll({});

    return {
      message: 'Clinics retrieved successfully.',
      data,
    };
  }

  /**
   * Get a specific clinic.
   */
  @Get(':id')
  @ClinicDecorator.FindClinicDecorators()
  async findById(@Param('id') id: string): Promise<ApiResponse<ClinicResponse>> {
    const data = await this.clinicService.findById({
      id,
    });

    return {
      message: 'Clinic retrieved successfully.',
      data,
    };
  }

  /**
   * Update the current user's clinic.
   */
  @Patch('me')
  @ClinicDecorator.UpdateClinicDecorators()
  async update(
    @Req() req: AccessRequest,
    @Body() updateClinicDto: UpdateClinicDto,
  ): Promise<ApiResponse<ClinicResponse>> {
    const data = await this.clinicService.update({
      ownerId: req.user.userId,
      ...updateClinicDto,
    });

    return {
      message: 'Clinic updated successfully.',
      data,
    };
  }

  /**
   * Soft-delete the current user's clinic.
   */
  @Delete('me')
  @ClinicDecorator.DeleteClinicDecorators()
  async delete(@Req() req: AccessRequest): Promise<ApiResponse> {
    await this.clinicService.delete({
      ownerId: req.user.userId,
    });

    return {
      message: 'Clinic deleted successfully.',
    };
  }

  /**
   * Update the status of a clinic.
   */
  @Patch(':id/status')
  @ClinicDecorator.UpdateClinicStatusDecorators()
  async updateStatus(
    @Param('id') id: string,
    @Body() updateClinicStatusDto: UpdateClinicStatusDto,
  ): Promise<ApiResponse<ClinicResponse>> {
    const data = await this.clinicService.updateStatus({
      id,
      ...updateClinicStatusDto,
    });

    return {
      message: 'Clinic status updated successfully.',
      data,
    };
  }
}
