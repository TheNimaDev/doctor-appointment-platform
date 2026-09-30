import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto, FindDoctorDto, UpdateDoctorDto } from './dto';
import type { AccessRequest, ApiResponse, DoctorResponse, DoctorsResponse } from '@/types';
import * as DoctorDecorator from './decorators';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  /**
   * Create a new doctor profile.
   */
  @Post()
  @DoctorDecorator.CreateDoctorDecorators()
  async create(
    @Req() req: AccessRequest,
    @Body() createDoctorDto: CreateDoctorDto,
  ): Promise<ApiResponse<DoctorResponse>> {
    const data = await this.doctorService.create({
      userId: req.user.userId,
      ...createDoctorDto,
    });

    return {
      message: 'Doctor request created successfully.',
      data,
    };
  }

  /**
   * Get all active doctors.
   */
  @Get()
  @DoctorDecorator.FindDoctorsDecorators()
  async findAllActive(): Promise<ApiResponse<DoctorsResponse>> {
    const data = await this.doctorService.findAll({});

    return {
      message: 'Doctors retrieved successfully.',
      data,
    };
  }

  /**
   * Get the authenticated doctor's profile.
   */
  @Get('my')
  @DoctorDecorator.FindMyDoctorDecorators()
  async findMy(@Req() req: AccessRequest): Promise<ApiResponse<DoctorResponse>> {
    const data = await this.doctorService.findByUserId({
      userId: req.user.userId,
    });

    return {
      message: 'Doctor profile retrieved successfully.',
      data,
    };
  }

  /**
   * Get all doctors with any status.
   */
  @Get('all')
  @DoctorDecorator.FindDoctorsWithAllStatusDecorators()
  async findAll(@Query() findDoctorDto: FindDoctorDto): Promise<ApiResponse<DoctorsResponse>> {
    const data = await this.doctorService.findAll({
      ...findDoctorDto,
    });

    return {
      message: 'Doctors retrieved successfully.',
      data,
    };
  }

  /**
   * Get a doctor by ID with any status.
   */
  @Get('all/:id')
  @DoctorDecorator.FindDoctorWithAllStatusDecorators()
  async findById(@Param('id') id: string): Promise<ApiResponse<DoctorResponse>> {
    const data = await this.doctorService.findById({
      id,
    });

    return {
      message: 'Doctor retrieved successfully.',
      data,
    };
  }

  /**
   * Get an active doctor by ID.
   */
  @Get(':id')
  @DoctorDecorator.FindDoctorDecorators()
  async findActiveById(@Param('id') id: string): Promise<ApiResponse<DoctorResponse>> {
    const data = await this.doctorService.findActiveById({
      id,
    });

    return {
      message: 'Doctor retrieved successfully.',
      data,
    };
  }

  /**
   * Update authenticated doctor profile.
   */
  @Patch()
  @DoctorDecorator.UpdateMyDoctorDecorators()
  async updateMy(
    @Req() req: AccessRequest,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ): Promise<ApiResponse<DoctorResponse>> {
    const data = await this.doctorService.update({
      userId: req.user.userId,
      ...updateDoctorDto,
    });

    return {
      message: 'Doctor updated successfully.',
      data,
    };
  }

  /**
   * Update a doctor profile.
   */
  @Patch(':id')
  @DoctorDecorator.UpdateDoctorDecorators()
  async update(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ): Promise<ApiResponse<DoctorResponse>> {
    const data = await this.doctorService.update({
      doctorId: id,
      ...updateDoctorDto,
    });

    return {
      message: 'Doctor updated successfully.',
      data,
    };
  }

  /**
   * Soft-delete authenticated doctor profile.
   */
  @Delete()
  @DoctorDecorator.DeleteMyDoctorDecorators()
  async deleteMy(@Req() req: AccessRequest): Promise<ApiResponse> {
    await this.doctorService.delete({
      userId: req.user.userId,
    });

    return {
      message: 'Doctor deleted successfully.',
    };
  }

  /**
   * Soft-delete a doctor profile.
   */
  @Delete(':id')
  @DoctorDecorator.DeleteDoctorDecorators()
  async delete(@Param('id') id: string): Promise<ApiResponse> {
    await this.doctorService.delete({
      doctorId: id,
    });

    return {
      message: 'Doctor deleted successfully.',
    };
  }
}
