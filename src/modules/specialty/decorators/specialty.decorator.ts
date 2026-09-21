import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Permission, PERMISSIONS, Public } from '@/common';
import * as SpecialtyRes from '../res';
import * as SpecialtyDto from '../dto';

export const CreateSpecialtyDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    ApiBody({ type: SpecialtyDto.CreateSpecialtyDto }),
    ApiCreatedResponse({ type: SpecialtyRes.CreateSpecialtyResponse }),
    ApiBadRequestResponse({ type: SpecialtyRes.CreateSpecialtyBadRequestResponse }),
    ApiConflictResponse({ type: SpecialtyRes.CreateSpecialtyConflictResponse }),
    Permission({
      permissions: [PERMISSIONS.SPECIALTY_CREATE],
    }),
  );
};

export const FindSpecialtiesDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Public(),
    ApiOkResponse({ type: SpecialtyRes.FindSpecialtiesResponse }),
    Permission({
      permissions: [PERMISSIONS.SPECIALTY_READ],
    }),
  );
};

export const FindSpecialtyDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Public(),
    ApiParam({
      name: 'idOrSlug',
      description: 'Specialty ID or slug',
      type: String,
      example: 'cardiology',
    }),
    ApiOkResponse({ type: SpecialtyRes.FindSpecialtyResponse }),
    ApiNotFoundResponse({ type: SpecialtyRes.FindSpecialtyNotFoundResponse }),
    Permission({
      permissions: [PERMISSIONS.SPECIALTY_READ],
    }),
  );
};

export const UpdateSpecialtyDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiParam({
      name: 'id',
      description: 'Specialty ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiBody({ type: SpecialtyDto.UpdateSpecialtyDto }),
    ApiOkResponse({ type: SpecialtyRes.UpdateSpecialtyResponse }),
    ApiBadRequestResponse({ type: SpecialtyRes.UpdateSpecialtyBadRequestResponse }),
    ApiConflictResponse({ type: SpecialtyRes.UpdateSpecialtyConflictResponse }),
    ApiNotFoundResponse({ type: SpecialtyRes.UpdateSpecialtyNotFoundResponse }),
    Permission({
      permissions: [PERMISSIONS.SPECIALTY_UPDATE],
    }),
  );
};

export const DeleteSpecialtyDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiParam({
      name: 'id',
      description: 'Specialty ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({ type: SpecialtyRes.DeleteSpecialtyResponse }),
    ApiNotFoundResponse({ type: SpecialtyRes.DeleteSpecialtyNotFoundResponse }),
    Permission({
      permissions: [PERMISSIONS.SPECIALTY_DELETE],
    }),
  );
};
