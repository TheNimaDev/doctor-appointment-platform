import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import * as PrescriptionDecorator from './decorators';
import type {
  AccessRequest,
  ApiResponse,
  OwnershipRequest,
  PrescriptionResponse,
  PrescriptionsResponse,
  SafePrescription,
} from '@/types';
import {
  CreatePrescriptionDto,
  CreatePrescriptionItemDto,
  UpdatePrescriptionDto,
  UpdatePrescriptionItemDto,
} from './dto';

@Controller('prescriptions')
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  /**
   * Create a prescription for a completed appointment.
   */
  @Post('appointment/:appointmentId')
  @PrescriptionDecorator.CreatePrescriptionDecorators()
  async create(
    @Param('appointmentId') appointmentId: string,
    @Body() createPrescriptionDto: CreatePrescriptionDto,
  ): Promise<ApiResponse<PrescriptionResponse>> {
    const data = await this.prescriptionService.create({
      appointmentId,
      ...createPrescriptionDto,
    });

    return {
      message: 'Prescription created successfully.',
      data,
    };
  }

  /**
   * Create prescription items for a prescription.
   */
  @Post(':id')
  @PrescriptionDecorator.CreatePrescriptionItemsDecorators()
  async createItems(
    @Param('id') id: string,
    @Body() createPrescriptionItemDtos: CreatePrescriptionItemDto[],
  ): Promise<ApiResponse<PrescriptionResponse>> {
    const data = await this.prescriptionService.createItemsHandler({
      prescriptionId: id,
      items: createPrescriptionItemDtos,
    });

    return {
      message: 'Prescription items created successfully.',
      data,
    };
  }

  /**
   * Get all prescriptions.
   */
  @Get('all')
  @PrescriptionDecorator.FindPrescriptionsDecorators()
  async findAll(): Promise<ApiResponse<PrescriptionsResponse>> {
    const data = await this.prescriptionService.findAll({});

    return {
      message: 'Prescriptions retrieved successfully.',
      data,
    };
  }

  /**
   * Get a prescription by ID.
   */
  @Get('all/:id')
  @PrescriptionDecorator.FindPrescriptionDecorators()
  async findById(@Param('id') id: string): Promise<ApiResponse<PrescriptionResponse>> {
    const data = await this.prescriptionService.getById({
      id,
    });

    return {
      message: 'Prescription retrieved successfully.',
      data,
    };
  }

  /**
   * Get a prescription by appointment ID.
   */
  @Get('all/appointment/:appointmentId')
  @PrescriptionDecorator.FindPrescriptionByAppointmentDecorators()
  async findByAppointmentId(@Param('appointmentId') appointmentId: string): Promise<ApiResponse<PrescriptionResponse>> {
    const data = await this.prescriptionService.getByAppointmentId({
      appointmentId,
    });

    return {
      message: 'Prescription retrieved successfully.',
      data,
    };
  }

  /**
   * Get all prescriptions belonging to the current patient.
   */
  @Get('my')
  @PrescriptionDecorator.FindPatientPrescriptionsDecorators()
  async findPatientPrescriptions(@Req() req: AccessRequest): Promise<ApiResponse<PrescriptionsResponse>> {
    const data = await this.prescriptionService.findPatientPrescriptions({
      patientId: req.patient!.id,
    });

    return {
      message: 'Patient prescriptions retrieved successfully.',
      data,
    };
  }

  /**
   * Get a prescription by ID belonging to the current patient.
   */
  @Get('my/:id')
  @PrescriptionDecorator.FindPatientPrescriptionDecorators()
  async findPatientPrescriptionById(
    @Req() req: OwnershipRequest<SafePrescription>,
  ): Promise<ApiResponse<PrescriptionResponse>> {
    return {
      message: 'Patient prescription retrieved successfully.',
      data: {
        prescription: req.ownershipData,
      },
    };
  }

  /**
   * Get a prescription by appointment ID belonging to the current patient.
   */
  @Get('my/appointment/:appointmentId')
  @PrescriptionDecorator.FindPatientPrescriptionByAppointmentDecorators()
  async findPatientPrescriptionByAppointmentId(
    @Req() req: OwnershipRequest<SafePrescription>,
  ): Promise<ApiResponse<PrescriptionResponse>> {
    return {
      message: 'Patient prescription retrieved successfully.',
      data: {
        prescription: req.ownershipData,
      },
    };
  }

  /**
   * Get all prescriptions belonging to the current doctor.
   */
  @Get('doctor')
  @PrescriptionDecorator.FindDoctorPrescriptionsDecorators()
  async findDoctorPrescriptions(@Req() req: AccessRequest): Promise<ApiResponse<PrescriptionsResponse>> {
    const data = await this.prescriptionService.findDoctorPrescriptions({
      doctorId: req.doctor!.id,
    });

    return {
      message: 'Doctor prescriptions retrieved successfully.',
      data,
    };
  }

  /**
   * Get a prescription by ID belonging to the current doctor.
   */
  @Get('doctor/:id')
  @PrescriptionDecorator.FindDoctorPrescriptionDecorators()
  async findDoctorPrescriptionById(
    @Req() req: OwnershipRequest<SafePrescription>,
  ): Promise<ApiResponse<PrescriptionResponse>> {
    return {
      message: 'Doctor prescription retrieved successfully.',
      data: {
        prescription: req.ownershipData,
      },
    };
  }

  /**
   * Get a prescription by appointment ID belonging to the current doctor.
   */
  @Get('doctor/appointment/:appointmentId')
  @PrescriptionDecorator.FindDoctorPrescriptionByAppointmentDecorators()
  async findDoctorPrescriptionByAppointmentId(
    @Req() req: OwnershipRequest<SafePrescription>,
  ): Promise<ApiResponse<PrescriptionResponse>> {
    return {
      message: 'Doctor prescription retrieved successfully.',
      data: {
        prescription: req.ownershipData,
      },
    };
  }

  /**
   * Get all prescriptions belonging to the current admin's clinic.
   */
  @Get('my-clinic')
  @PrescriptionDecorator.FindMyClinicPrescriptionsDecorators()
  async findMyClinicPrescriptions(@Req() req: AccessRequest): Promise<ApiResponse<PrescriptionsResponse>> {
    const data = await this.prescriptionService.findClinicAdminPrescriptions({
      clinicId: req.clinic!.id,
    });

    return {
      message: 'Clinic prescriptions retrieved successfully.',
      data,
    };
  }

  /**
   * Get a prescription by ID belonging to the current admin's clinic.
   */
  @Get('my-clinic/:id')
  @PrescriptionDecorator.FindMyClinicPrescriptionDecorators()
  async findMyClinicPrescriptionById(
    @Req() req: OwnershipRequest<SafePrescription>,
  ): Promise<ApiResponse<PrescriptionResponse>> {
    return {
      message: 'Clinic prescription retrieved successfully.',
      data: {
        prescription: req.ownershipData,
      },
    };
  }

  /**
   * Get a prescription by appointment ID belonging to the current admin's clinic.
   */
  @Get('my-clinic/appointment/:appointmentId')
  @PrescriptionDecorator.FindMyClinicPrescriptionByAppointmentDecorators()
  async findMyClinicPrescriptionByAppointmentId(
    @Req() req: OwnershipRequest<SafePrescription>,
  ): Promise<ApiResponse<PrescriptionResponse>> {
    return {
      message: 'Clinic prescription retrieved successfully.',
      data: {
        prescription: req.ownershipData,
      },
    };
  }

  /**
   * Update a prescription.
   */
  @Patch(':id')
  @PrescriptionDecorator.UpdatePrescriptionDecorators()
  async update(
    @Param('id') id: string,
    @Body() updatePrescriptionDto: UpdatePrescriptionDto,
  ): Promise<ApiResponse<PrescriptionResponse>> {
    const data = await this.prescriptionService.update({
      id,
      ...updatePrescriptionDto,
    });

    return {
      message: 'Prescription updated successfully.',
      data,
    };
  }

  /**
   * Update a prescription item.
   */
  @Patch('item/:id')
  @PrescriptionDecorator.UpdatePrescriptionItemDecorators()
  async updateItem(
    @Param('id') id: string,
    @Body() updatePrescriptionItemDto: UpdatePrescriptionItemDto,
  ): Promise<ApiResponse<PrescriptionResponse>> {
    const data = await this.prescriptionService.updateItem({
      id,
      ...updatePrescriptionItemDto,
    });

    return {
      message: 'Prescription item updated successfully.',
      data,
    };
  }

  /**
   * Soft-delete a prescription.
   */
  @Delete(':id')
  @PrescriptionDecorator.DeletePrescriptionDecorators()
  async delete(@Param('id') id: string): Promise<ApiResponse> {
    await this.prescriptionService.delete({
      id,
    });

    return {
      message: 'Prescription deleted successfully.',
    };
  }

  /**
   * Soft-delete a prescription item.
   */
  @Delete('item/:id')
  @PrescriptionDecorator.DeletePrescriptionItemDecorators()
  async deleteItem(@Param('id') id: string): Promise<ApiResponse> {
    await this.prescriptionService.deleteItem({
      id,
    });

    return {
      message: 'Prescription item deleted successfully.',
    };
  }
}
