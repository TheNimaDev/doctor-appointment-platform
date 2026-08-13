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
   *
   * - Creates a new medical specialty.
   * - Handles unique name and slug constraints.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSpecialtyDto: CreateSpecialtyDto): Promise<ApiResponse<SpecialtyResponse>> {
    const specialty = await this.specialtyService.create({
      ...createSpecialtyDto,
    });

    return {
      message: 'Specialty created successfully.',
      data: specialty,
    };
  }

  /**
   * Get all specialties.
   *
   * - Returns all available specialties.
   * - Intended for specialty listing and filtering.
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
   *
   * - Returns the specialty associated with the given ID or slug.
   * - Uses the ID lookup when the parameter is a valid UUID.
   * - Falls back to slug lookup otherwise.
   * - Throws NotFoundException if the specialty does not exist.
   */
  @Get(':idOrSlug')
  @HttpCode(HttpStatus.OK)
  async findByIdOrSlug(@Param('idOrSlug') idOrSlug: string): Promise<ApiResponse<SpecialtyResponse>> {
    let data: SpecialtyResponse;

    if (isUUID(idOrSlug)) {
      data = await this.specialtyService.findById({
        id: idOrSlug,
      });
    } else {
      data = await this.specialtyService.findBySlug({
        slug: idOrSlug,
      });
    }

    return {
      message: 'Specialty retrieved successfully.',
      data,
    };
  }

  /**
   * Update a specialty.
   *
   * - Updates only the provided specialty fields.
   * - Sensitive fields such as status are not updated here.
   * - Throws NotFoundException if the specialty does not exist.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateSpecialtyDto: UpdateSpecialtyDto): Promise<ApiResponse> {
    await this.specialtyService.update({
      id,
      ...updateSpecialtyDto,
    });

    return {
      message: 'Specialty updated successfully.',
    };
  }

  /**
   * Soft-delete a specialty.
   *
   * - The specialty remains in the database.
   * - The deletedAt field is populated.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<ApiResponse> {
    await this.specialtyService.delete({
      id,
    });

    return {
      message: 'Specialty deleted successfully.',
    };
  }
}
