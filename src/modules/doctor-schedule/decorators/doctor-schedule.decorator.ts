import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Permission, Public, PERMISSIONS, Context } from '@/common';
import * as ScheduleRes from '../res';
import * as ScheduleDto from '../dto';
import { ScheduleStatus } from '../enums';

export const FindAllDoctorSchedulesDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
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
    ApiBearerAuth('accessToken'),
    Context('doctor'),
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
    ApiBearerAuth('accessToken'),
    Context('doctor'),
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
    ApiBearerAuth('accessToken'),
    Context('doctor'),
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
      ownership: 'doctor',
      resource: 'doctor-schedule',
    }),
  );
};

export const FindMyClinicSchedulesDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    Context('clinic'),
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
    ApiBearerAuth('accessToken'),
    Context('clinic'),
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
    ApiBearerAuth('accessToken'),
    Context('clinic'),
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
      ownership: 'clinic',
      resource: 'doctor-schedule',
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

export const CreateMyDoctorScheduleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    ApiBearerAuth('accessToken'),
    Context('doctor'),
    ApiBody({
      type: ScheduleDto.CreateDoctorScheduleDto,
    }),
    ApiCreatedResponse({
      type: ScheduleRes.CreateMyDoctorScheduleResponse,
    }),
    ApiBadRequestResponse({
      type: ScheduleRes.CreateMyDoctorScheduleBadRequestResponse,
    }),
    ApiConflictResponse({
      type: ScheduleRes.CreateMyDoctorScheduleConflictResponse,
    }),
    ApiNotFoundResponse({
      type: ScheduleRes.CreateMyDoctorScheduleNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_CREATE],
    }),
  );
};

export const UpdateMyDoctorScheduleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    Context('doctor'),
    ApiParam({
      name: 'scheduleId',
      description: 'Doctor schedule ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiBody({
      type: ScheduleDto.UpdateDoctorScheduleDto,
    }),
    ApiOkResponse({
      type: ScheduleRes.UpdateMyDoctorScheduleResponse,
    }),
    ApiBadRequestResponse({
      type: ScheduleRes.UpdateMyDoctorScheduleBadRequestResponse,
    }),
    ApiNotFoundResponse({
      type: ScheduleRes.UpdateMyDoctorScheduleNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_UPDATE],
      ownership: 'doctor',
      resource: 'doctor-schedule',
    }),
  );
};

export const UpdateDoctorScheduleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    Context('clinic'),
    ApiParam({
      name: 'scheduleId',
      description: 'Doctor schedule ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiBody({
      type: ScheduleDto.UpdateDoctorScheduleDto,
    }),
    ApiOkResponse({
      type: ScheduleRes.UpdateDoctorScheduleForClinicResponse,
    }),
    ApiBadRequestResponse({
      type: ScheduleRes.UpdateDoctorScheduleForClinicBadRequestResponse,
    }),
    ApiNotFoundResponse({
      type: ScheduleRes.UpdateDoctorScheduleForClinicNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_UPDATE],
      ownership: 'clinic',
      resource: 'doctor-schedule',
    }),
  );
};

export const UpdateMyDoctorScheduleStatusDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    Context('doctor'),
    ApiParam({
      name: 'scheduleId',
      description: 'Doctor schedule ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiBody({
      type: ScheduleDto.UpdateDoctorScheduleStatusDto,
    }),
    ApiOkResponse({
      type: ScheduleRes.UpdateMyDoctorScheduleStatusResponse,
    }),
    ApiBadRequestResponse({
      type: ScheduleRes.UpdateMyDoctorScheduleStatusBadRequestResponse,
    }),
    ApiNotFoundResponse({
      type: ScheduleRes.UpdateMyDoctorScheduleStatusNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_UPDATE_STATUS],
      ownership: 'doctor',
      resource: 'doctor-schedule',
    }),
  );
};

export const UpdateDoctorScheduleStatusDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    Context('clinic'),
    ApiParam({
      name: 'scheduleId',
      description: 'Doctor schedule ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiBody({
      type: ScheduleDto.UpdateDoctorScheduleStatusDto,
    }),
    ApiOkResponse({
      type: ScheduleRes.UpdateDoctorScheduleStatusForClinicResponse,
    }),
    ApiBadRequestResponse({
      type: ScheduleRes.UpdateDoctorScheduleStatusForClinicBadRequestResponse,
    }),
    ApiNotFoundResponse({
      type: ScheduleRes.UpdateDoctorScheduleStatusForClinicNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_UPDATE_STATUS],
      ownership: 'clinic',
      resource: 'doctor-schedule',
    }),
  );
};

export const DeleteMyDoctorScheduleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    Context('doctor'),
    ApiParam({
      name: 'scheduleId',
      description: 'Doctor schedule ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: ScheduleRes.DeleteMyDoctorScheduleResponse,
    }),
    ApiNotFoundResponse({
      type: ScheduleRes.DeleteMyDoctorScheduleNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_DELETE],
      ownership: 'doctor',
      resource: 'doctor-schedule',
    }),
  );
};

export const DeleteDoctorScheduleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    Context('clinic'),
    ApiParam({
      name: 'scheduleId',
      description: 'Doctor schedule ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: ScheduleRes.DeleteDoctorScheduleForClinicResponse,
    }),
    ApiNotFoundResponse({
      type: ScheduleRes.DeleteDoctorScheduleForClinicNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_SCHEDULE_DELETE],
      ownership: 'clinic',
      resource: 'doctor-schedule',
    }),
  );
};
