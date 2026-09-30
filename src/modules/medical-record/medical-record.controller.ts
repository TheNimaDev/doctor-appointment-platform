import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { MedicalRecordService } from './medical-record.service';
import * as MedicalRecordDecorator from './decorators';
import type { AccessRequest, ApiResponse, MedicalRecordResponse, MedicalRecordsResponse } from '@/types';
import { CreateMedicalRecordDto, UpdateMedicalRecordDto } from './dto';

@Controller('medical-records')
export class MedicalRecordController {
  constructor(private readonly medicalRecordService: MedicalRecordService) {}

  /**
   * Create a medical record for a completed appointment.
   */
  @Post('appointment/:appointmentId')
  @MedicalRecordDecorator.CreateMedicalRecordDecorators()
  async create(
    @Req() req: AccessRequest,
    @Param('appointmentId') appointmentId: string,
    @Body() createMedicalRecordDto: CreateMedicalRecordDto,
  ): Promise<ApiResponse<MedicalRecordResponse>> {
    const data = await this.medicalRecordService.create({
      userId: req.user.userId,
      appointmentId,
      ...createMedicalRecordDto,
    });

    return {
      message: 'Medical record created successfully.',
      data,
    };
  }

  /**
   * Get all medical records.
   */
  @Get('all')
  @MedicalRecordDecorator.FindMedicalRecordsDecorators()
  async findAll(): Promise<ApiResponse<MedicalRecordsResponse>> {
    const data = await this.medicalRecordService.findAll({});

    return {
      message: 'Medical records retrieved successfully.',
      data,
    };
  }

  /**
   * Get a medical record by ID.
   */
  @Get('all/:id')
  @MedicalRecordDecorator.FindMedicalRecordDecorators()
  async findById(@Param('id') id: string): Promise<ApiResponse<MedicalRecordResponse>> {
    const data = await this.medicalRecordService.findById({
      id,
    });

    return {
      message: 'Medical record retrieved successfully.',
      data,
    };
  }

  /**
   * Get a medical record by appointment ID.
   */
  @Get('all/appointment/:appointmentId')
  @MedicalRecordDecorator.FindMedicalRecordByAppointmentDecorators()
  async findByAppointmentId(
    @Param('appointmentId') appointmentId: string,
  ): Promise<ApiResponse<MedicalRecordResponse>> {
    const data = await this.medicalRecordService.findByAppointmentId({
      appointmentId,
    });

    return {
      message: 'Medical record retrieved successfully.',
      data,
    };
  }

  /**
   * Get all medical records belonging to the current patient.
   */
  @Get('my')
  @MedicalRecordDecorator.FindPatientMedicalRecordsDecorators()
  async findPatientMedicalRecords(@Req() req: AccessRequest): Promise<ApiResponse<MedicalRecordsResponse>> {
    const data = await this.medicalRecordService.findPatientMedicalRecords({
      userId: req.user.userId,
    });

    return {
      message: 'Patient medical records retrieved successfully.',
      data,
    };
  }

  /**
   * Get a medical record by ID belonging to the current patient.
   */
  @Get('my/:id')
  @MedicalRecordDecorator.FindPatientMedicalRecordDecorators()
  async findPatientMedicalRecordById(
    @Req() req: AccessRequest,
    @Param('id') id: string,
  ): Promise<ApiResponse<MedicalRecordResponse>> {
    const data = await this.medicalRecordService.findPatientMedicalRecordById({
      userId: req.user.userId,
      id,
    });

    return {
      message: 'Patient medical record retrieved successfully.',
      data,
    };
  }

  /**
   * Get a medical record by appointment ID belonging to the current patient.
   */
  @Get('my/appointment/:appointmentId')
  @MedicalRecordDecorator.FindPatientMedicalRecordByAppointmentDecorators()
  async findPatientMedicalRecordByAppointmentId(
    @Req() req: AccessRequest,
    @Param('appointmentId') appointmentId: string,
  ): Promise<ApiResponse<MedicalRecordResponse>> {
    const data = await this.medicalRecordService.findPatientMedicalRecordByAppointmentId({
      userId: req.user.userId,
      appointmentId,
    });

    return {
      message: 'Patient medical record retrieved successfully.',
      data,
    };
  }

  /**
   * Get all medical records belonging to the current doctor.
   */
  @Get('doctor')
  @MedicalRecordDecorator.FindDoctorMedicalRecordsDecorators()
  async findDoctorMedicalRecords(@Req() req: AccessRequest): Promise<ApiResponse<MedicalRecordsResponse>> {
    const data = await this.medicalRecordService.findDoctorMedicalRecords({
      userId: req.user.userId,
    });

    return {
      message: 'Doctor medical records retrieved successfully.',
      data,
    };
  }

  /**
   * Get a medical record by ID belonging to the current doctor.
   */
  @Get('doctor/:id')
  @MedicalRecordDecorator.FindDoctorMedicalRecordDecorators()
  async findDoctorMedicalRecordById(
    @Req() req: AccessRequest,
    @Param('id') id: string,
  ): Promise<ApiResponse<MedicalRecordResponse>> {
    const data = await this.medicalRecordService.findDoctorMedicalRecordById({
      userId: req.user.userId,
      id,
    });

    return {
      message: 'Doctor medical record retrieved successfully.',
      data,
    };
  }

  /**
   * Get a medical record by appointment ID belonging to the current doctor.
   */
  @Get('doctor/appointment/:appointmentId')
  @MedicalRecordDecorator.FindDoctorMedicalRecordByAppointmentDecorators()
  async findDoctorMedicalRecordByAppointmentId(
    @Req() req: AccessRequest,
    @Param('appointmentId') appointmentId: string,
  ): Promise<ApiResponse<MedicalRecordResponse>> {
    const data = await this.medicalRecordService.findDoctorMedicalRecordByAppointmentId({
      userId: req.user.userId,
      appointmentId,
    });

    return {
      message: 'Doctor medical record retrieved successfully.',
      data,
    };
  }

  /**
   * Get all medical records belonging to the current admin's clinic.
   */
  @Get('my-clinic')
  @MedicalRecordDecorator.FindMyClinicMedicalRecordsDecorators()
  async findMyClinicMedicalRecords(@Req() req: AccessRequest): Promise<ApiResponse<MedicalRecordsResponse>> {
    const data = await this.medicalRecordService.findClinicAdminMedicalRecords({
      userId: req.user.userId,
    });

    return {
      message: 'Clinic medical records retrieved successfully.',
      data,
    };
  }

  /**
   * Get a medical record by ID belonging to the current admin's clinic.
   */
  @Get('my-clinic/:id')
  @MedicalRecordDecorator.FindMyClinicMedicalRecordDecorators()
  async findMyClinicMedicalRecordById(
    @Req() req: AccessRequest,
    @Param('id') id: string,
  ): Promise<ApiResponse<MedicalRecordResponse>> {
    const data = await this.medicalRecordService.findClinicAdminMedicalRecordById({
      userId: req.user.userId,
      id,
    });

    return {
      message: 'Clinic medical record retrieved successfully.',
      data,
    };
  }

  /**
   * Get a medical record by appointment ID belonging to the current admin's clinic.
   */
  @Get('my-clinic/appointment/:appointmentId')
  @MedicalRecordDecorator.FindMyClinicMedicalRecordByAppointmentDecorators()
  async findMyClinicMedicalRecordByAppointmentId(
    @Req() req: AccessRequest,
    @Param('appointmentId') appointmentId: string,
  ): Promise<ApiResponse<MedicalRecordResponse>> {
    const data = await this.medicalRecordService.findClinicAdminMedicalRecordByAppointmentId({
      userId: req.user.userId,
      appointmentId,
    });

    return {
      message: 'Clinic medical record retrieved successfully.',
      data,
    };
  }

  /**
   * Update a medical record.
   */
  @Patch(':id')
  @MedicalRecordDecorator.UpdateMedicalRecordDecorators()
  async update(
    @Req() req: AccessRequest,
    @Param('id') id: string,
    @Body() updateMedicalRecordDto: UpdateMedicalRecordDto,
  ): Promise<ApiResponse<MedicalRecordResponse>> {
    const data = await this.medicalRecordService.update({
      userId: req.user.userId,
      medicalRecordId: id,
      ...updateMedicalRecordDto,
    });

    return {
      message: 'Medical record updated successfully.',
      data,
    };
  }

  /**
   * Soft-delete a medical record.
   */
  @Delete(':id')
  @MedicalRecordDecorator.DeleteMedicalRecordDecorators()
  async delete(@Req() req: AccessRequest, @Param('id') id: string): Promise<ApiResponse> {
    await this.medicalRecordService.delete({
      userId: req.user.userId,
      medicalRecordId: id,
    });

    return {
      message: 'Medical record deleted successfully.',
    };
  }
}
