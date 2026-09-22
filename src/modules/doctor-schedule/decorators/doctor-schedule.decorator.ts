import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Permission, Public, PERMISSIONS } from '@/common';
import * as ScheduleRes from '../res';
import { ScheduleStatus } from '../enums';

export const FindAllDoctorSchedulesDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiQuery({
      name: 'status',
      required: false,
      enum: ScheduleStatus,
    }),
    ApiOkResponse({
      type: ScheduleRes.FindAllDoctorSchedulesResponse,
    }),
    ApiBadRequestResponse({
      type: ScheduleRes.FindAllDoctorSchedulesBadRequestResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

export const FindDoctorSchedulesByClinicDecorators = () => {
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
    ApiOkResponse({
      type: ScheduleRes.FindDoctorSchedulesByClinicResponse,
    }),
    ApiNotFoundResponse({
      type: ScheduleRes.FindDoctorSchedulesByClinicNotFoundResponse,
    }),
  );
};

export const FindDoctorSchedulesByDoctorDecorators = () => {
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
    ApiOkResponse({
      type: ScheduleRes.FindDoctorSchedulesByDoctorResponse,
    }),
    ApiNotFoundResponse({
      type: ScheduleRes.FindDoctorSchedulesByDoctorNotFoundResponse,
    }),
  );
};

export const FindDoctorSchedulesByDoctorAndClinicDecorators = () => {
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
    ApiOkResponse({
      type: ScheduleRes.FindDoctorSchedulesByDoctorAndClinicResponse,
    }),
    ApiNotFoundResponse({
      type: ScheduleRes.FindDoctorSchedulesByDoctorAndClinicNotFoundResponse,
    }),
  );
};

export const FindMyDoctorSchedulesDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOkResponse({
      type: ScheduleRes.FindMyDoctorSchedulesResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_READ],
    }),
  );
};

export const FindMyDoctorClinicSchedulesDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiParam({
      name: 'clinicId',
      description: 'Clinic ID',
      type: String,
      format: 'uuid',
      example: '2b4d7e9a-1c3f-4b5d-8e7f-9a1b2c3d4e5f',
    }),
    ApiOkResponse({
      type: ScheduleRes.FindMyDoctorSchedulesByClinicResponse,
    }),
    ApiNotFoundResponse({
      type: ScheduleRes.FindMyDoctorSchedulesByClinicNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_READ],
    }),
  );
};

export const FindMyDoctorScheduleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiParam({
      name: 'scheduleId',
      description: 'Doctor schedule ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: ScheduleRes.FindMyDoctorScheduleResponse,
    }),
    ApiNotFoundResponse({
      type: ScheduleRes.FindMyDoctorScheduleNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_READ],
    }),
  );
};

export const FindMyClinicSchedulesDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOkResponse({
      type: ScheduleRes.FindMyClinicSchedulesResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_READ],
    }),
  );
};

export const FindDoctorSchedulesForClinicDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiParam({
      name: 'doctorId',
      description: 'Doctor ID',
      type: String,
      format: 'uuid',
      example: '4c6e8f1a-3d5b-4f7c-9a2e-1b3d5f7c9e0a',
    }),
    ApiOkResponse({
      type: ScheduleRes.FindDoctorSchedulesForClinicResponse,
    }),
    ApiNotFoundResponse({
      type: ScheduleRes.FindDoctorSchedulesForClinicNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_READ],
    }),
  );
};

export const FindDoctorScheduleByClinicOwnerDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiParam({
      name: 'scheduleId',
      description: 'Doctor schedule ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: ScheduleRes.FindDoctorScheduleByClinicOwnerResponse,
    }),
    ApiNotFoundResponse({
      type: ScheduleRes.FindDoctorScheduleByClinicOwnerNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_READ],
      clinicOwner: true,
      resource: 'doctor-schedule',
      resourceIdParam: 'scheduleId',
    }),
  );
};

export const FindDoctorScheduleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Public(),
    ApiParam({
      name: 'scheduleId',
      description: 'Doctor schedule ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: ScheduleRes.FindDoctorScheduleResponse,
    }),
    ApiNotFoundResponse({
      type: ScheduleRes.FindDoctorScheduleNotFoundResponse,
    }),
  );
};

export const UpdateDoctorScheduleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_UPDATE],
      clinicOwner: true,
      resource: 'doctor-schedule',
      resourceIdParam: 'scheduleId',
    }),
  );
};

export const UpdateMyDoctorScheduleStatusDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_UPDATE_STATUS],
    }),
  );
};

export const UpdateDoctorScheduleStatusDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_UPDATE_STATUS],
      clinicOwner: true,
      resource: 'doctor-schedule',
      resourceIdParam: 'scheduleId',
    }),
  );
};

export const DeleteMyDoctorScheduleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_DELETE],
    }),
  );
};

export const DeleteDoctorScheduleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_DELETE],
      clinicOwner: true,
      resource: 'doctor-schedule',
      resourceIdParam: 'scheduleId',
    }),
  );
};
