import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Permission, PERMISSIONS, Public } from '@/common';
import * as DoctorRes from '../res';
import * as DoctorDto from '../dto';
import { DoctorStatus } from '../enums';

export const CreateDoctorDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    ApiBody({ type: DoctorDto.CreateDoctorDto }),
    ApiCreatedResponse({ type: DoctorRes.CreateDoctorResponse }),
    ApiBadRequestResponse({ type: DoctorRes.CreateDoctorBadRequestResponse }),
    ApiConflictResponse({ type: DoctorRes.CreateDoctorConflictResponse }),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_CREATE],
    }),
  );
};

export const FindDoctorsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Public(),
    ApiOkResponse({ type: DoctorRes.FindDoctorsResponse }),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_READ],
    }),
  );
};

export const FindMyDoctorDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOkResponse({ type: DoctorRes.FindMyDoctorResponse }),
    ApiNotFoundResponse({ type: DoctorRes.FindMyDoctorNotFoundResponse }),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_READ],
    }),
  );
};

export const FindDoctorsWithAllStatusDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiQuery({ name: 'status', required: false, enum: DoctorStatus }),
    ApiOkResponse({ type: DoctorRes.FindDoctorsWithAllStatusResponse }),
    ApiBadRequestResponse({ type: DoctorRes.FindDoctorsWithAllStatusBadRequestResponse }),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

export const FindDoctorDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Public(),
    ApiParam({
      name: 'id',
      description: 'Doctor ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({ type: DoctorRes.FindDoctorResponse }),
    ApiNotFoundResponse({ type: DoctorRes.FindDoctorNotFoundResponse }),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_READ],
    }),
  );
};

export const FindDoctorWithAllStatusDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

export const UpdateMyDoctorDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_UPDATE],
    }),
  );
};

export const UpdateDoctorDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

export const DeleteMyDoctorDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_DELETE],
    }),
  );
};

export const DeleteDoctorDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};
