import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { PatientService } from './patient.service';
import type { AccessRequest, ApiResponse, PatientResponse, PatientsResponse } from '@/types';
import { CreatePatientDto, UpdatePatientDto, FindPatientDto } from './dto';
import * as PatientDecorator from './decorators';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  /**
   * Create a new patient profile.
   */
  @Post()
  @PatientDecorator.CreatePatientDecorators()
  async createPatient(
    @Req() req: AccessRequest,
    @Body() createPatientDto: CreatePatientDto,
  ): Promise<ApiResponse<PatientResponse>> {
    const data = await this.patientService.create({
      userId: req.user.userId,
      ...createPatientDto,
    });

    return {
      message: 'Patient created successfully.',
      data,
    };
  }

  /**
   * Get all patients.
   */
  @Get('all')
  @PatientDecorator.FindPatientsDecorators()
  async findAll(@Query() findPatientDto: FindPatientDto): Promise<ApiResponse<PatientsResponse>> {
    const data = await this.patientService.findAll({
      ...findPatientDto,
    });

    return {
      message: 'Patients retrieved successfully.',
      data,
    };
  }

  /**
   * Get the authenticated patient's profile.
   */
  @Get('my')
  @PatientDecorator.FindMyPatientDecorators()
  async findMy(@Req() req: AccessRequest): Promise<ApiResponse<PatientResponse>> {
    const data = await this.patientService.findByUserId({
      userId: req.user.userId,
    });

    return {
      message: 'Patient retrieved successfully.',
      data,
    };
  }

  /**
   * Get a patient by ID.
   */
  @Get(':id')
  @PatientDecorator.FindPatientDecorators()
  async getPatientById(@Param('id') id: string): Promise<ApiResponse<PatientResponse>> {
    const data = await this.patientService.findById({
      id,
    });

    return {
      message: 'Patient retrieved successfully.',
      data,
    };
  }

  /**
   * Update the authenticated patient's profile.
   */
  @Patch('my')
  @PatientDecorator.UpdateMyPatientDecorators()
  async updateMy(
    @Req() req: AccessRequest,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<ApiResponse<PatientResponse>> {
    const data = await this.patientService.update({
      userId: req.user.userId,
      ...updatePatientDto,
    });

    return {
      message: 'Patient updated successfully.',
      data,
    };
  }

  /**
   * Update a patient profile.
   */
  @Patch(':id')
  @PatientDecorator.UpdatePatientDecorators()
  async updatePatient(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<ApiResponse<PatientResponse>> {
    const data = await this.patientService.update({
      patientId: id,
      ...updatePatientDto,
    });

    return {
      message: 'Patient updated successfully.',
      data,
    };
  }
}
