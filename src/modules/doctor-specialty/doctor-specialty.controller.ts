import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { DoctorSpecialtyService } from './doctor-specialty.service';
import { AddDoctorSpecialtyDto } from './dto';
import type { ApiResponse, DoctorSpecialtiesResponse, DoctorSpecialtyResponse } from '@/types';

@Controller('doctors/:doctorId/specialties')
export class DoctorSpecialtyController {
  constructor(private readonly doctorSpecialtyService: DoctorSpecialtyService) {}

  /**
   * Add a specialty to a doctor.
   *
   * - Validates the doctor and specialty.
   * - Prevents duplicate specialties.
   * - Optionally marks the specialty as primary.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
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
   *
   * - Returns all active doctor-specialty relations.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
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
   *
   * - Removes the primary flag from other specialties.
   * - Marks the selected specialty as primary.
   */
  @Patch(':specialtyId/primary')
  @HttpCode(HttpStatus.OK)
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
   *
   * - Marks the doctor-specialty relation as deleted.
   * - Preserves the relation in the database.
   */
  @Delete(':specialtyId')
  @HttpCode(HttpStatus.OK)
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
