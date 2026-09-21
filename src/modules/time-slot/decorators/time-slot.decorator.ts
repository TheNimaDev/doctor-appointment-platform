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

export const FindAvailableClinicTimeSlotsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Public(),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_READ],
    }),
  );
};

export const FindMyTimeSlotsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_READ],
    }),
  );
};

export const FindMyClinicTimeSlotsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_READ],
    }),
  );
};

export const FindMyTimeSlotDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
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
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_READ],
    }),
  );
};

export const FindMyClinicAdminTimeSlotsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_READ],
    }),
  );
};

export const FindMyClinicAdminDoctorTimeSlotsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_READ],
    }),
  );
};

export const FindMyClinicAdminTimeSlotDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
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
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_UNBLOCK],
      clinicOwner: true,
      resource: 'time-slot',
    }),
  );
};
