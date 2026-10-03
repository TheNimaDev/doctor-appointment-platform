import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { CreateClinicDto, FindClinicDto, UpdateClinicDto } from './dto';
import type {
  AccessRequest,
  ApiResponse,
  ClinicResponse,
  ClinicsResponse,
  OwnershipRequest,
  SafeClinic,
} from '@/types';
import * as ClinicDecorator from './decorators';

@Controller('clinics')
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  /**
   * Create a new clinic.
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
   * Get the current user's clinic.
   */
  @Get('my')
  @ClinicDecorator.FindMyClinicDecorators()
  async findMy(@Req() req: OwnershipRequest<SafeClinic>): Promise<ApiResponse<ClinicResponse>> {
    return {
      message: 'Clinic retrieved successfully.',
      data: {
        clinic: req.ownershipData,
      },
    };
  }

  /**
   * Get all active clinics.
   */
  @Get()
  @ClinicDecorator.FindClinicsDecorators()
  async findAllActive(): Promise<ApiResponse<ClinicsResponse>> {
    const data = await this.clinicService.findAll({});

    return {
      message: 'Clinics retrieved successfully.',
      data,
    };
  }

  /**
   * Get all clinics with any status.
   */
  @Get('all')
  @ClinicDecorator.FindClinicsWithAllStatusDecorators()
  async findAll(@Query() findClinicDto: FindClinicDto): Promise<ApiResponse<ClinicsResponse>> {
    const data = await this.clinicService.findAll({
      ...findClinicDto,
    });

    return {
      message: 'Clinics retrieved successfully.',
      data,
    };
  }

  /**
   * Get a clinic by ID any status.
   */
  @Get('all/:id')
  @ClinicDecorator.FindClinicWithAllStatusDecorators()
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
   * Get an active clinic by ID.
   */
  @Get(':id')
  @ClinicDecorator.FindClinicDecorators()
  async findActiveById(@Param('id') id: string): Promise<ApiResponse<ClinicResponse>> {
    const data = await this.clinicService.findActiveById({
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
  @Patch()
  @ClinicDecorator.UpdateMyClinicDecorators()
  async updateMy(
    @Req() req: AccessRequest,
    @Body() updateClinicDto: UpdateClinicDto,
  ): Promise<ApiResponse<ClinicResponse>> {
    const data = await this.clinicService.update({
      id: req.clinic!.id,
      ...updateClinicDto,
    });

    return {
      message: 'Clinic updated successfully.',
      data,
    };
  }

  /**
   * Update a clinic.
   */
  @Patch(':id')
  @ClinicDecorator.UpdateClinicDecorators()
  async update(
    @Param('id') id: string,
    @Body() updateClinicDto: UpdateClinicDto,
  ): Promise<ApiResponse<ClinicResponse>> {
    const data = await this.clinicService.update({
      id,
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
  @Delete()
  @ClinicDecorator.DeleteMyClinicDecorators()
  async deleteMy(@Req() req: AccessRequest): Promise<ApiResponse> {
    await this.clinicService.delete({
      id: req.clinic!.id,
    });

    return {
      message: 'Clinic deleted successfully.',
    };
  }

  /**
   * Soft-delete a clinic.
   */
  @Delete(':id')
  @ClinicDecorator.DeleteClinicDecorators()
  async delete(@Param('id') id: string): Promise<ApiResponse> {
    await this.clinicService.delete({
      id,
    });

    return {
      message: 'Clinic deleted successfully.',
    };
  }
}
