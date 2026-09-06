import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { DoctorClinicService } from './doctor-clinic.service';
import type { ApiResponse, DoctorClinicResponse, DoctorClinicsResponse } from '@/types';
import * as DoctorClinicDecorator from './decorators';

@Controller('doctor-clinics')
export class DoctorClinicController {
  constructor(private readonly doctorClinicService: DoctorClinicService) {}

  /**
   * Create a doctor-clinic relation.
   */
  @Post(':clinicId/:doctorId')
  @DoctorClinicDecorator.CreateDoctorClinicDecorators()
  async create(
    @Param('clinicId') clinicId: string,
    @Param('doctorId') doctorId: string,
  ): Promise<ApiResponse<DoctorClinicResponse>> {
    const data = await this.doctorClinicService.create({
      doctorId,
      clinicId,
    });

    return {
      message: 'Doctor-clinic relation created successfully.',
      data,
    };
  }

  /**
   * Get all clinics associated with a doctor.
   */
  @Get('doctor/:doctorId')
  @DoctorClinicDecorator.FindDoctorClinicsByDoctorDecorators()
  async findByDoctorId(@Param('doctorId') doctorId: string): Promise<ApiResponse<DoctorClinicsResponse>> {
    const data = await this.doctorClinicService.findByDoctorId({
      doctorId,
    });

    return {
      message: 'Doctor clinics retrieved successfully.',
      data,
    };
  }

  /**
   * Get all doctors associated with a clinic.
   */
  @Get('clinic/:clinicId')
  @DoctorClinicDecorator.FindDoctorClinicsByClinicDecorators()
  async findByClinicId(@Param('clinicId') clinicId: string): Promise<ApiResponse<DoctorClinicsResponse>> {
    const data = await this.doctorClinicService.findByClinicId({
      clinicId,
    });

    return {
      message: 'Clinic doctors retrieved successfully.',
      data,
    };
  }

  /**
   * Delete a doctor-clinic relation.
   */
  @Delete(':clinicId/:doctorId')
  @DoctorClinicDecorator.DeleteDoctorClinicDecorators()
  async delete(@Param('clinicId') clinicId: string, @Param('doctorId') doctorId: string): Promise<ApiResponse> {
    await this.doctorClinicService.delete({
      doctorId,
      clinicId,
    });

    return {
      message: 'Doctor-clinic relation deleted successfully.',
    };
  }
}
