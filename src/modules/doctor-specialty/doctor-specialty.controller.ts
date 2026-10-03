import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { DoctorSpecialtyService } from './doctor-specialty.service';
import { AddDoctorSpecialtyDto } from './dto';
import type { AccessRequest, ApiResponse, DoctorSpecialtiesResponse, DoctorSpecialtyResponse } from '@/types';
import * as DoctorSpecialtyDecorator from './decorators';

@Controller('doctor-specialties')
export class DoctorSpecialtyController {
  constructor(private readonly doctorSpecialtyService: DoctorSpecialtyService) {}

  /**
   * Add a specialty to a doctor.
   */
  @Post('my')
  @DoctorSpecialtyDecorator.AddDoctorSpecialtyDecorators()
  async add(
    @Req() req: AccessRequest,
    @Body() addDoctorSpecialtyDto: AddDoctorSpecialtyDto,
  ): Promise<ApiResponse<DoctorSpecialtyResponse>> {
    const data = await this.doctorSpecialtyService.add({
      doctorId: req.doctor!.id,
      ...addDoctorSpecialtyDto,
    });

    return {
      message: 'Specialty added to doctor successfully.',
      data,
    };
  }

  /**
   * Find all specialties assigned to the current doctor.
   */
  @Get('my')
  @DoctorSpecialtyDecorator.FindMyDoctorSpecialtiesDecorators()
  async findMySpecialties(@Req() req: AccessRequest): Promise<ApiResponse<DoctorSpecialtiesResponse>> {
    const data = await this.doctorSpecialtyService.findAllByUserId({
      doctorId: req.doctor!.id,
    });

    return {
      message: 'Doctor specialties retrieved successfully.',
      data,
    };
  }

  /**
   * Get all specialties assigned to a doctor.
   */
  @Get('doctors/:doctorId')
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
  @Patch('my/:id/primary')
  @DoctorSpecialtyDecorator.SetDoctorSpecialtyPrimaryDecorators()
  async setPrimary(@Req() req: AccessRequest, @Param('id') id: string): Promise<ApiResponse<DoctorSpecialtyResponse>> {
    const data = await this.doctorSpecialtyService.setPrimary({
      id,
      doctorId: req.doctor!.id,
    });

    return {
      message: 'Primary specialty updated successfully.',
      data,
    };
  }

  /**
   * Soft-delete a specialty from a doctor.
   */
  @Delete('my/:id')
  @DoctorSpecialtyDecorator.RemoveDoctorSpecialtyDecorators()
  async remove(@Param('id') id: string): Promise<ApiResponse> {
    await this.doctorSpecialtyService.remove({
      id,
    });

    return {
      message: 'Specialty removed from doctor successfully.',
    };
  }
}
