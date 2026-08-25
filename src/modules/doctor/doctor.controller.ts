import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto, UpdateDoctorDto } from './dto';
import type { ApiResponse, DoctorResponse, DoctorsResponse } from '@/types';
import * as DoctorDecorator from './decorators';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  /**
   * Create a new doctor profile.
   */
  @Post()
  @DoctorDecorator.CreateDoctorDecorators()
  async create(@Body() createDoctorDto: CreateDoctorDto): Promise<ApiResponse<DoctorResponse>> {
    const data = await this.doctorService.create({
      ...createDoctorDto,
    });

    return {
      message: 'Doctor created successfully.',
      data,
    };
  }

  /**
   * Get all doctors.
   */
  @Get()
  @DoctorDecorator.FindDoctorsDecorators()
  async findAll(): Promise<ApiResponse<DoctorsResponse>> {
    const data = await this.doctorService.findAll({});

    return {
      message: 'Doctors retrieved successfully.',
      data,
    };
  }

  /**
   * Get a doctor by ID.
   */
  @Get(':id')
  @DoctorDecorator.FindDoctorDecorators()
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
   * Update a doctor profile.
   */
  @Patch(':id')
  @DoctorDecorator.UpdateDoctorDecorators()
  async update(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ): Promise<ApiResponse<DoctorResponse>> {
    const data = await this.doctorService.update({
      id,
      ...updateDoctorDto,
    });

    return {
      message: 'Doctor updated successfully.',
      data,
    };
  }

  /**
   * Soft-delete a doctor profile.
   */
  @Delete(':id')
  @DoctorDecorator.DeleteDoctorDecorators()
  async delete(@Param('id') id: string): Promise<ApiResponse> {
    await this.doctorService.delete({
      id,
    });

    return {
      message: 'Doctor deleted successfully.',
    };
  }
}
