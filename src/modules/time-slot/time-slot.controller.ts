import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { TimeSlotService } from './time-slot.service';
import type { ApiResponse, TimeSlotResponse, TimeSlotsResponse } from '@/types';
import * as TimeSlotDecorator from './decorators';
import { TimeSlotStatus } from './enums';

@Controller('doctors/:doctorId/time-slots')
export class TimeSlotController {
  constructor(private readonly timeSlotService: TimeSlotService) {}

  /**
   * Get all time slots for a doctor on a specific date.
   */
  @Get()
  @TimeSlotDecorator.FindTimeSlotsDecorators()
  async findByDoctorAndDate(
    @Param('doctorId') doctorId: string,
    @Query('date') date: string,
  ): Promise<ApiResponse<TimeSlotsResponse>> {
    const timeSlots = await this.timeSlotService.findByDoctorAndDate({
      doctorId,
      date,
    });

    return {
      message: 'Time slots retrieved successfully.',
      data: timeSlots,
    };
  }

  /**
   * Get all available time slots for a doctor on a specific date.
   */
  @Get('available')
  @TimeSlotDecorator.FindAvailableTimeSlotsDecorators()
  async findAvailable(
    @Param('doctorId') doctorId: string,
    @Query('date') date: string,
  ): Promise<ApiResponse<TimeSlotsResponse>> {
    const timeSlots = await this.timeSlotService.findAvailable({
      doctorId,
      date,
    });

    return {
      message: 'Available time slots retrieved successfully.',
      data: timeSlots,
    };
  }

  /**
   * Get a time slot by ID.
   */
  @Get(':id')
  @TimeSlotDecorator.FindTimeSlotDecorators()
  async getById(@Param('id') id: string): Promise<ApiResponse<TimeSlotResponse>> {
    const timeSlot = await this.timeSlotService.getById({
      id,
    });

    return {
      message: 'Time slot retrieved successfully.',
      data: timeSlot,
    };
  }

  /**
   * Block a time slot.
   */
  @Patch(':id/block')
  @TimeSlotDecorator.BlockTimeSlotDecorators()
  async blockTimeSlot(@Param('id') id: string): Promise<ApiResponse<TimeSlotResponse>> {
    const timeSlot = await this.timeSlotService.updateStatus({
      id,
      status: TimeSlotStatus.BLOCKED,
    });

    return {
      message: 'Time slot blocked successfully.',
      data: timeSlot,
    };
  }

  /**
   * Unblock a time slot.
   */
  @Patch(':id/unblock')
  @TimeSlotDecorator.UnblockTimeSlotDecorators()
  async unblockTimeSlot(@Param('id') id: string): Promise<ApiResponse<TimeSlotResponse>> {
    const timeSlot = await this.timeSlotService.updateStatus({
      id,
      status: TimeSlotStatus.AVAILABLE,
    });

    return {
      message: 'Time slot unblocked successfully.',
      data: timeSlot,
    };
  }
}