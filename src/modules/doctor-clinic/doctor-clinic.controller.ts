import { Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { DoctorClinicService } from './doctor-clinic.service';
import type { AccessRequest, ApiResponse, DoctorClinicResponse, DoctorClinicsResponse } from '@/types';
import * as DoctorClinicDecorator from './decorators';

@Controller('doctor-clinics')
export class DoctorClinicController {
  constructor(private readonly doctorClinicService: DoctorClinicService) {}

  /**
   * Create a doctor-clinic relation.
   */
  @Post(':doctorId')
  @DoctorClinicDecorator.CreateDoctorClinicDecorators()
  async create(
    @Req() req: AccessRequest,
    @Param('doctorId') doctorId: string,
  ): Promise<ApiResponse<DoctorClinicResponse>> {
    const data = await this.doctorClinicService.create({
      doctorId,
      clinicOwnerId: req.user.userId,
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
   * Get all doctors associated with the current user's clinic.
   */
  @Get('my-clinic')
  @DoctorClinicDecorator.FindMyClinicDoctorsDecorators()
  async findByClinic(@Req() req: AccessRequest): Promise<ApiResponse<DoctorClinicsResponse>> {
    const data = await this.doctorClinicService.findClinicDoctors({
      clinicOwnerId: req.user.userId,
    });

    return {
      message: 'Clinic doctors retrieved successfully.',
      data,
    };
  }

  /**
   * Get all clinics associated with the current doctor.
   */
  @Get('my')
  @DoctorClinicDecorator.FindMyDoctorClinicsDecorators()
  async findByDoctor(@Req() req: AccessRequest): Promise<ApiResponse<DoctorClinicsResponse>> {
    const data = await this.doctorClinicService.findDoctorClinics({
      userId: req.user.userId,
    });

    return {
      message: 'Doctor clinics retrieved successfully.',
      data,
    };
  }

  /**
   * Delete a doctor-clinic relation.
   */
  @Delete(':doctorId')
  @DoctorClinicDecorator.DeleteDoctorClinicDecorators()
  async delete(@Req() req: AccessRequest, @Param('doctorId') doctorId: string): Promise<ApiResponse> {
    await this.doctorClinicService.delete({
      doctorId,
      clinicOwnerId: req.user.userId,
    });

    return {
      message: 'Doctor-clinic relation deleted successfully.',
    };
  }
}
