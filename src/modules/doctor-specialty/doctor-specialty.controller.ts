import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { DoctorSpecialtyService } from './doctor-specialty.service';
import { AddDoctorSpecialtyDto } from './dto';
import type { ApiResponse, DoctorSpecialtiesResponse, DoctorSpecialtyResponse } from '@/types';
import * as DoctorSpecialtyDecorator from './decorators';

@Controller('doctors/:doctorId/specialties')
export class DoctorSpecialtyController {
  constructor(private readonly doctorSpecialtyService: DoctorSpecialtyService) {}

  /**
   * Add a specialty to a doctor.
   */
  @Post()
  @DoctorSpecialtyDecorator.AddDoctorSpecialtyDecorators()
  async add(
    @Param('doctorId') doctorId: string,
    @Body() addDoctorSpecialtyDto: AddDoctorSpecialtyDto,
  ): Promise<ApiResponse<DoctorSpecialtyResponse>> {
    const data = await this.doctorSpecialtyService.add({
      doctorId,
      ...addDoctorSpecialtyDto,
    });

    return {
      message: 'Specialty added to doctor successfully.',
      data,
    };
  }

  /**
   * Get all specialties assigned to a doctor.
   */
  @Get()
  @DoctorSpecialtyDecorator.FindDoctorSpecialtiesDecorators()
  async findAll(@Param('doctorId') doctorId: string): Promise<ApiResponse<DoctorSpecialtiesResponse>> {
    const data = await this.doctorSpecialtyService.findAll({
      doctorId,
    });

    return {
      message: 'Doctor specialties retrieved successfully.',
      data,
    };
  }

  /**
   * Set a doctor's specialty as primary.
   */
  @Patch(':specialtyId/primary')
  @DoctorSpecialtyDecorator.SetDoctorSpecialtyPrimaryDecorators()
  async setPrimary(
    @Param('doctorId') doctorId: string,
    @Param('specialtyId') specialtyId: string,
  ): Promise<ApiResponse<DoctorSpecialtyResponse>> {
    const data = await this.doctorSpecialtyService.setPrimary({
      doctorId,
      specialtyId,
    });

    return {
      message: 'Primary specialty updated successfully.',
      data,
    };
  }

  /**
   * Soft-delete a specialty from a doctor.
   */
  @Delete(':specialtyId')
  @DoctorSpecialtyDecorator.RemoveDoctorSpecialtyDecorators()
  async remove(@Param('doctorId') doctorId: string, @Param('specialtyId') specialtyId: string): Promise<ApiResponse> {
    await this.doctorSpecialtyService.remove({
      doctorId,
      specialtyId,
    });

    return {
      message: 'Specialty removed from doctor successfully.',
    };
  }
}
