import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { Permission, PERMISSIONS, Public } from '@/common';
import * as ClinicRes from '../res';
import * as ClinicDto from '../dto';

export const CreateClinicDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
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
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

export const FindClinicDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Public(),
    Permission({
      permissions: [PERMISSIONS.CLINIC_READ],
    }),
  );
};

export const FindClinicWithAllStatusDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

export const UpdateMyClinicDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.CLINIC_UPDATE],
    }),
  );
};

export const UpdateClinicDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

export const DeleteMyClinicDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.CLINIC_DELETE],
    }),
  );
};

export const DeleteClinicDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};
