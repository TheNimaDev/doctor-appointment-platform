import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { MedicalRecordService } from './medical-record.service';
import * as MedicalRecordDecorator from './decorators';
import type {
  AccessRequest,
  ApiResponse,
  MedicalRecordResponse,
  MedicalRecordsResponse,
  OwnershipRequest,
  SafeMedicalRecord,
} from '@/types';
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
    @Param('appointmentId') appointmentId: string,
    @Body() createMedicalRecordDto: CreateMedicalRecordDto,
  ): Promise<ApiResponse<MedicalRecordResponse>> {
    const data = await this.medicalRecordService.create({
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
      patientId: req.patient!.id,
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
    @Req() req: OwnershipRequest<SafeMedicalRecord>,
  ): Promise<ApiResponse<MedicalRecordResponse>> {
    return {
      message: 'Patient medical record retrieved successfully.',
      data: {
        medicalRecord: req.ownershipData,
      },
    };
  }

  /**
   * Get a medical record by appointment ID belonging to the current patient.
   */
  @Get('my/appointment/:appointmentId')
  @MedicalRecordDecorator.FindPatientMedicalRecordByAppointmentDecorators()
  async findPatientMedicalRecordByAppointmentId(
    @Req() req: OwnershipRequest<SafeMedicalRecord>,
  ): Promise<ApiResponse<MedicalRecordResponse>> {
    return {
      message: 'Patient medical record retrieved successfully.',
      data: {
        medicalRecord: req.ownershipData,
      },
    };
  }

  /**
   * Get all medical records belonging to the current doctor.
   */
  @Get('doctor')
  @MedicalRecordDecorator.FindDoctorMedicalRecordsDecorators()
  async findDoctorMedicalRecords(@Req() req: AccessRequest): Promise<ApiResponse<MedicalRecordsResponse>> {
    const data = await this.medicalRecordService.findDoctorMedicalRecords({
      doctorId: req.doctor!.id,
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
    @Req() req: OwnershipRequest<SafeMedicalRecord>,
  ): Promise<ApiResponse<MedicalRecordResponse>> {
    return {
      message: 'Doctor medical record retrieved successfully.',
      data: {
        medicalRecord: req.ownershipData,
      },
    };
  }

  /**
   * Get a medical record by appointment ID belonging to the current doctor.
   */
  @Get('doctor/appointment/:appointmentId')
  @MedicalRecordDecorator.FindDoctorMedicalRecordByAppointmentDecorators()
  async findDoctorMedicalRecordByAppointmentId(
    @Req() req: OwnershipRequest<SafeMedicalRecord>,
  ): Promise<ApiResponse<MedicalRecordResponse>> {
    return {
      message: 'Doctor medical record retrieved successfully.',
      data: {
        medicalRecord: req.ownershipData,
      },
    };
  }

  /**
   * Get all medical records belonging to the current admin's clinic.
   */
  @Get('my-clinic')
  @MedicalRecordDecorator.FindMyClinicMedicalRecordsDecorators()
  async findMyClinicMedicalRecords(@Req() req: AccessRequest): Promise<ApiResponse<MedicalRecordsResponse>> {
    const data = await this.medicalRecordService.findClinicAdminMedicalRecords({
      clinicId: req.clinic!.id,
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
    @Req() req: OwnershipRequest<SafeMedicalRecord>,
  ): Promise<ApiResponse<MedicalRecordResponse>> {
    return {
      message: 'Clinic medical record retrieved successfully.',
      data: {
        medicalRecord: req.ownershipData,
      },
    };
  }

  /**
   * Get a medical record by appointment ID belonging to the current admin's clinic.
   */
  @Get('my-clinic/appointment/:appointmentId')
  @MedicalRecordDecorator.FindMyClinicMedicalRecordByAppointmentDecorators()
  async findMyClinicMedicalRecordByAppointmentId(
    @Req() req: OwnershipRequest<SafeMedicalRecord>,
  ): Promise<ApiResponse<MedicalRecordResponse>> {
    return {
      message: 'Clinic medical record retrieved successfully.',
      data: {
        medicalRecord: req.ownershipData,
      },
    };
  }

  /**
   * Update a medical record.
   */
  @Patch(':id')
  @MedicalRecordDecorator.UpdateMedicalRecordDecorators()
  async update(
    @Param('id') id: string,
    @Body() updateMedicalRecordDto: UpdateMedicalRecordDto,
  ): Promise<ApiResponse<MedicalRecordResponse>> {
    const data = await this.medicalRecordService.update({
      id,
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
  async delete(@Param('id') id: string): Promise<ApiResponse> {
    await this.medicalRecordService.delete({
      id,
    });

    return {
      message: 'Medical record deleted successfully.',
    };
  }
}
