import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
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

export const FindDoctorScheduleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Public(),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_READ],
    }),
  );
};

export const FindMyDoctorScheduleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_READ],
    }),
  );
};

export const FindMyDoctorSchedulesDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_READ],
    }),
  );
};

export const FindMyDoctorClinicSchedulesDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_READ],
    }),
  );
};

export const FindMyClinicSchedulesDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_READ],
    }),
  );
};

export const FindDoctorScheduleByClinicOwnerDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_READ],
      clinicOwner: true,
      resource: 'doctor-schedule',
      resourceIdParam: 'scheduleId',
    }),
  );
};

export const FindDoctorClinicSchedulesForClinicDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_READ],
    }),
  );
};

export const CreateMyDoctorScheduleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_CREATE],
    }),
  );
};

export const UpdateMyDoctorScheduleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_UPDATE],
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
