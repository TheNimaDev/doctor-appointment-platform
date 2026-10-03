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
import { Context, Permission, PERMISSIONS } from '@/common';
import * as PatientRes from '../res';
import * as PatientDto from '../dto';
import { Gender } from '../enums';

/**
 * Create a new patient profile.
 */
export const CreatePatientDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    ApiBearerAuth('accessToken'),
    ApiBody({ type: PatientDto.CreatePatientDto }),
    ApiCreatedResponse({ type: PatientRes.CreatePatientResponse }),
    ApiBadRequestResponse({
      type: PatientRes.CreatePatientBadRequestResponse,
    }),
    ApiConflictResponse({
      type: PatientRes.CreatePatientConflictResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.PATIENT_CREATE],
    }),
  );
};

/**
 * Get the authenticated patient's profile.
 */
export const FindMyPatientDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    Context('patient'),
    ApiOkResponse({
      type: PatientRes.FindMyPatientResponse,
    }),
    ApiNotFoundResponse({
      type: PatientRes.FindMyPatientNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.PATIENT_READ],
    }),
  );
};

/**
 * Get all patients.
 */
export const FindPatientsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    ApiQuery({
      name: 'gender',
      required: false,
      enum: Gender,
    }),
    ApiOkResponse({
      type: PatientRes.FindPatientsResponse,
    }),
    ApiBadRequestResponse({
      type: PatientRes.FindPatientsBadRequestResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

/**
 * Get a patient by ID.
 */
export const FindPatientDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    ApiParam({
      name: 'id',
      description: 'Patient ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: PatientRes.FindPatientResponse,
    }),
    ApiNotFoundResponse({
      type: PatientRes.FindPatientNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

/**
 * Update the authenticated patient's profile.
 */
export const UpdateMyPatientDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    Context('patient'),
    ApiBody({
      type: PatientDto.UpdatePatientDto,
    }),
    ApiOkResponse({
      type: PatientRes.UpdateMyPatientResponse,
    }),
    ApiBadRequestResponse({
      type: PatientRes.UpdateMyPatientBadRequestResponse,
    }),
    ApiNotFoundResponse({
      type: PatientRes.UpdateMyPatientNotFoundResponse,
    }),
    ApiConflictResponse({
      type: PatientRes.UpdateMyPatientConflictResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.PATIENT_UPDATE],
    }),
  );
};

/**
 * Update a patient profile.
 */
export const UpdatePatientDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    ApiParam({
      name: 'id',
      description: 'Patient ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiBody({
      type: PatientDto.UpdatePatientDto,
    }),
    ApiOkResponse({
      type: PatientRes.UpdatePatientResponse,
    }),
    ApiBadRequestResponse({
      type: PatientRes.UpdatePatientBadRequestResponse,
    }),
    ApiConflictResponse({
      type: PatientRes.UpdatePatientConflictResponse,
    }),
    ApiNotFoundResponse({
      type: PatientRes.UpdatePatientNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};
