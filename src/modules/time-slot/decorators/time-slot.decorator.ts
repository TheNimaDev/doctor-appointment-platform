import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Permission, Public, PERMISSIONS } from '@/common';
import * as TimeSlotRes from '../res';

export const FindAvailableTimeSlotsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Public(),
    ApiParam({
      name: 'doctorId',
      description: 'Doctor ID',
      type: String,
      format: 'uuid',
      example: '4c6e8f1a-3d5b-4f7c-9a2e-1b3d5f7c9e0a',
    }),
    ApiQuery({
      name: 'date',
      description: 'Filter time slots by date',
      required: false,
      type: String,
      example: '2026-10-01',
    }),
    ApiOkResponse({
      type: TimeSlotRes.FindAvailableByDoctorResponse,
    }),
    ApiNotFoundResponse({
      type: TimeSlotRes.FindAvailableByDoctorNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_READ],
    }),
  );
};

export const FindAvailableDoctorClinicTimeSlotsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Public(),
    ApiParam({
      name: 'doctorId',
      description: 'Doctor ID',
      type: String,
      format: 'uuid',
      example: '4c6e8f1a-3d5b-4f7c-9a2e-1b3d5f7c9e0a',
    }),
    ApiParam({
      name: 'clinicId',
      description: 'Clinic ID',
      type: String,
      format: 'uuid',
      example: '2b4d7e9a-1c3f-4b5d-8e7f-9a1b2c3d4e5f',
    }),
    ApiQuery({
      name: 'date',
      description: 'Filter time slots by date',
      required: false,
      type: String,
      example: '2026-10-01',
    }),
    ApiOkResponse({
      type: TimeSlotRes.FindAvailableByDoctorAndClinicResponse,
    }),
    ApiNotFoundResponse({
      type: TimeSlotRes.FindAvailableByDoctorAndClinicNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_READ],
    }),
  );
};

export const FindAvailableClinicTimeSlotsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Public(),
    ApiParam({
      name: 'clinicId',
      description: 'Clinic ID',
      type: String,
      format: 'uuid',
      example: '2b4d7e9a-1c3f-4b5d-8e7f-9a1b2c3d4e5f',
    }),
    ApiQuery({
      name: 'date',
      description: 'Filter time slots by date',
      required: false,
      type: String,
      example: '2026-10-01',
    }),
    ApiOkResponse({
      type: TimeSlotRes.FindAvailableByClinicResponse,
    }),
    ApiNotFoundResponse({
      type: TimeSlotRes.FindAvailableByClinicNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_READ],
    }),
  );
};

export const FindMyTimeSlotsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiQuery({
      name: 'date',
      description: 'Filter time slots by date',
      required: false,
      type: String,
      example: '2026-10-01',
    }),
    ApiOkResponse({
      type: TimeSlotRes.FindMyTimeSlotsResponse,
    }),
    ApiNotFoundResponse({
      type: TimeSlotRes.FindMyTimeSlotsNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_READ],
    }),
  );
};

export const FindMyClinicTimeSlotsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiParam({
      name: 'clinicId',
      description: 'Clinic ID',
      type: String,
      format: 'uuid',
      example: '2b4d7e9a-1c3f-4b5d-8e7f-9a1b2c3d4e5f',
    }),
    ApiQuery({
      name: 'date',
      description: 'Filter time slots by date',
      required: false,
      type: String,
      example: '2026-10-01',
    }),
    ApiOkResponse({
      type: TimeSlotRes.FindMyClinicTimeSlotsResponse,
    }),
    ApiNotFoundResponse({
      type: TimeSlotRes.FindMyClinicTimeSlotsNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_READ],
    }),
  );
};

export const FindMyTimeSlotDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiParam({
      name: 'id',
      description: 'Time slot ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: TimeSlotRes.FindMyTimeSlotResponse,
    }),
    ApiNotFoundResponse({
      type: TimeSlotRes.FindMyTimeSlotNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_READ],
      owner: true,
      resource: 'time-slot',
    }),
  );
};

export const FindAvailableTimeSlotDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Public(),
    ApiParam({
      name: 'id',
      description: 'Time slot ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: TimeSlotRes.FindAvailableTimeSlotResponse,
    }),
    ApiNotFoundResponse({
      type: TimeSlotRes.FindAvailableTimeSlotNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_READ],
    }),
  );
};

export const FindMyClinicAdminTimeSlotsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiQuery({
      name: 'date',
      description: 'Filter time slots by date',
      required: false,
      type: String,
      example: '2026-10-01',
    }),
    ApiOkResponse({
      type: TimeSlotRes.FindMyClinicAdminTimeSlotsResponse,
    }),
    ApiNotFoundResponse({
      type: TimeSlotRes.FindMyClinicAdminTimeSlotsNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_READ],
    }),
  );
};

export const FindMyClinicAdminDoctorTimeSlotsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiParam({
      name: 'doctorId',
      description: 'Doctor ID',
      type: String,
      format: 'uuid',
      example: '4c6e8f1a-3d5b-4f7c-9a2e-1b3d5f7c9e0a',
    }),
    ApiQuery({
      name: 'date',
      description: 'Filter time slots by date',
      required: false,
      type: String,
      example: '2026-10-01',
    }),
    ApiOkResponse({
      type: TimeSlotRes.FindMyClinicAdminDoctorTimeSlotsResponse,
    }),
    ApiNotFoundResponse({
      type: TimeSlotRes.FindMyClinicAdminDoctorTimeSlotsNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_READ],
    }),
  );
};

export const FindMyClinicAdminTimeSlotDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiParam({
      name: 'id',
      description: 'Time slot ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: TimeSlotRes.FindMyClinicAdminTimeSlotResponse,
    }),
    ApiNotFoundResponse({
      type: TimeSlotRes.FindMyClinicAdminTimeSlotNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_READ],
      clinicOwner: true,
      resource: 'time-slot',
    }),
  );
};

export const BlockMyTimeSlotDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiParam({
      name: 'id',
      description: 'Time slot ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: TimeSlotRes.BlockMyTimeSlotResponse,
    }),
    ApiNotFoundResponse({
      type: TimeSlotRes.BlockMyTimeSlotNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_BLOCK],
      owner: true,
      resource: 'time-slot',
    }),
  );
};

export const UnblockMyTimeSlotDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiParam({
      name: 'id',
      description: 'Time slot ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: TimeSlotRes.UnblockMyTimeSlotResponse,
    }),
    ApiNotFoundResponse({
      type: TimeSlotRes.UnblockMyTimeSlotNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_UNBLOCK],
      owner: true,
      resource: 'time-slot',
    }),
  );
};

export const BlockMyClinicTimeSlotDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiParam({
      name: 'id',
      description: 'Time slot ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: TimeSlotRes.BlockMyClinicTimeSlotResponse,
    }),
    ApiNotFoundResponse({
      type: TimeSlotRes.BlockMyClinicTimeSlotNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_BLOCK],
      clinicOwner: true,
      resource: 'time-slot',
    }),
  );
};

export const UnblockMyClinicTimeSlotDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiParam({
      name: 'id',
      description: 'Time slot ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: TimeSlotRes.UnblockMyClinicTimeSlotResponse,
    }),
    ApiNotFoundResponse({
      type: TimeSlotRes.UnblockMyClinicTimeSlotNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_UNBLOCK],
      clinicOwner: true,
      resource: 'time-slot',
    }),
  );
};
