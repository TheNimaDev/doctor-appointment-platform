import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { SpecialtyService } from './specialty.service';
import { CreateSpecialtyDto, UpdateSpecialtyDto } from './dto';
import type { ApiResponse, SpecialtiesResponse, SpecialtyResponse } from '@/types';
import { isUUID } from 'class-validator';

@Controller('specialties')
export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) {}

  /**
   * Create a new specialty.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSpecialty(@Body() createSpecialtyDto: CreateSpecialtyDto): Promise<ApiResponse<SpecialtyResponse>> {
    const specialty = await this.specialtyService.createSpecialty({
      ...createSpecialtyDto,
    });

    return {
      message: 'Specialty created successfully.',
      data: specialty,
    };
  }

  /**
   * Get all specialties.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<ApiResponse<SpecialtiesResponse>> {
    const specialties = await this.specialtyService.findAll({});

    return {
      message: 'Specialties retrieved successfully.',
      data: specialties,
    };
  }

  /**
   * Get a specialty by ID or slug.
   */
  @Get(':idOrSlug')
  @HttpCode(HttpStatus.OK)
  async getByIdOrSlug(@Param('idOrSlug') idOrSlug: string): Promise<ApiResponse<SpecialtyResponse>> {
    let specialty: SpecialtyResponse;

    if (isUUID(idOrSlug)) {
      specialty = await this.specialtyService.getById({
        id: idOrSlug,
      });
    } else {
      specialty = await this.specialtyService.findBySlug({
        slug: idOrSlug,
      });
    }

    return {
      message: 'Specialty retrieved successfully.',
      data: specialty,
    };
  }

  /**
   * Update a specialty.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateSpecialty(
    @Param('id') id: string,
    @Body() updateSpecialtyDto: UpdateSpecialtyDto,
  ): Promise<ApiResponse<SpecialtyResponse>> {
    const specialty = await this.specialtyService.updateSpecialty({
      id,
      ...updateSpecialtyDto,
    });

    return {
      message: 'Specialty updated successfully.',
      data: specialty,
    };
  }

  /**
   * Soft-delete a specialty.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteSpecialty(@Param('id') id: string): Promise<ApiResponse> {
    await this.specialtyService.deleteSpecialty({
      id,
    });

    return {
      message: 'Specialty deleted successfully.',
    };
  }
}
