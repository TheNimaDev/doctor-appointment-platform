import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto, UpdateDoctorDto } from './dto';
import type { ApiResponse, DoctorResponse, DoctorsResponse } from '@/types';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  /**
   * Create a new doctor profile.
   *
   * - Creates a medical profile for an existing user.
   * - The doctor starts with PENDING_VERIFICATION status.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDoctorDto: CreateDoctorDto): Promise<ApiResponse<DoctorResponse>> {
    const doctor = await this.doctorService.create({
      ...createDoctorDto,
    });

    return {
      message: 'Doctor created successfully.',
      data: doctor,
    };
  }

  /**
   * Get all doctors.
   *
   * - Returns all doctor profiles.
   * - Intended for doctor listing and search.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<ApiResponse<DoctorsResponse>> {
    const doctors = await this.doctorService.findAll({});

    return {
      message: 'Doctors retrieved successfully.',
      data: doctors,
    };
  }

  /**
   * Get a doctor by ID.
   *
   * - Returns the doctor profile associated with the given ID.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string): Promise<ApiResponse<DoctorResponse>> {
    const doctor = await this.doctorService.findById({
      id,
    });

    return {
      message: 'Doctor retrieved successfully.',
      data: doctor,
    };
  }

  /**
   * Update a doctor profile.
   *
   * - Updates only the provided doctor profile fields.
   * - Sensitive fields such as status and rating are not updated here.
   * - Throws NotFoundException if the doctor does not exist.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto): Promise<ApiResponse> {
    await this.doctorService.update({
      id,
      ...updateDoctorDto,
    });

    return {
      message: 'Doctor updated successfully.',
    };
  }

  /**
   * Soft-delete a doctor profile.
   *
   * - The doctor remains in the database.
   * - The deletedAt field is populated.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<ApiResponse> {
    await this.doctorService.delete({
      id,
    });

    return {
      message: 'Doctor deleted successfully.',
    };
  }
}
