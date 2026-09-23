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
import { Permission, PERMISSIONS, Public } from '@/common';
import * as ClinicRes from '../res';
import * as ClinicDto from '../dto';
import { ClinicStatus } from '../enums';

export const CreateClinicDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    ApiBearerAuth('accessToken'),
    ApiBody({ type: ClinicDto.CreateClinicDto }),
    ApiCreatedResponse({ type: ClinicRes.CreateClinicResponse }),
    ApiBadRequestResponse({ type: ClinicRes.CreateClinicBadRequestResponse }),
    ApiConflictResponse({ type: ClinicRes.CreateClinicConflictResponse }),
    Permission({
      permissions: [PERMISSIONS.CLINIC_CREATE],
    }),
  );
};

export const FindMyClinicDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    ApiOkResponse({ type: ClinicRes.FindMyClinicResponse }),
    ApiNotFoundResponse({ type: ClinicRes.FindMyClinicNotFoundResponse }),
    Permission({
      permissions: [PERMISSIONS.CLINIC_READ],
    }),
  );
};

export const FindClinicsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Public(),
    ApiOkResponse({ type: ClinicRes.FindClinicsResponse }),
    Permission({
      permissions: [PERMISSIONS.CLINIC_READ],
    }),
  );
};

export const FindClinicsWithAllStatusDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    ApiQuery({ name: 'status', required: false, enum: ClinicStatus }),
    ApiOkResponse({ type: ClinicRes.FindClinicsWithAllStatusResponse }),
    ApiBadRequestResponse({ type: ClinicRes.FindClinicsWithAllStatusBadRequestResponse }),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

export const FindClinicDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Public(),
    ApiParam({
      name: 'id',
      description: 'Clinic ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({ type: ClinicRes.FindClinicResponse }),
    ApiNotFoundResponse({ type: ClinicRes.FindClinicNotFoundResponse }),
    Permission({
      permissions: [PERMISSIONS.CLINIC_READ],
    }),
  );
};

export const FindClinicWithAllStatusDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    ApiParam({
      name: 'id',
      description: 'Clinic ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({ type: ClinicRes.FindClinicWithAllStatusResponse }),
    ApiNotFoundResponse({ type: ClinicRes.FindClinicWithAllStatusNotFoundResponse }),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

export const UpdateMyClinicDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    ApiBody({ type: ClinicDto.UpdateClinicDto }),
    ApiOkResponse({ type: ClinicRes.UpdateMyClinicResponse }),
    ApiBadRequestResponse({ type: ClinicRes.UpdateMyClinicBadRequestResponse }),
    ApiNotFoundResponse({ type: ClinicRes.UpdateMyClinicNotFoundResponse }),
    ApiConflictResponse({ type: ClinicRes.UpdateMyClinicConflictResponse }),
    Permission({
      permissions: [PERMISSIONS.CLINIC_UPDATE],
    }),
  );
};

export const UpdateClinicDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    ApiParam({
      name: 'id',
      description: 'Clinic ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiBody({ type: ClinicDto.UpdateClinicDto }),
    ApiOkResponse({ type: ClinicRes.UpdateClinicResponse }),
    ApiBadRequestResponse({ type: ClinicRes.UpdateClinicBadRequestResponse }),
    ApiConflictResponse({ type: ClinicRes.UpdateClinicConflictResponse }),
    ApiNotFoundResponse({ type: ClinicRes.UpdateClinicNotFoundResponse }),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

export const DeleteMyClinicDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    ApiOkResponse({ type: ClinicRes.DeleteMyClinicResponse }),
    ApiNotFoundResponse({ type: ClinicRes.DeleteMyClinicNotFoundResponse }),
    Permission({
      permissions: [PERMISSIONS.CLINIC_DELETE],
    }),
  );
};

export const DeleteClinicDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    ApiParam({
      name: 'id',
      description: 'Clinic ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({ type: ClinicRes.DeleteClinicResponse }),
    ApiNotFoundResponse({ type: ClinicRes.DeleteClinicNotFoundResponse }),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};
