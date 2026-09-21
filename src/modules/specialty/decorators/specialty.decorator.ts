import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
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
    Permission({
      permissions: [PERMISSIONS.SPECIALTY_READ],
    }),
  );
};

export const UpdateSpecialtyDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.SPECIALTY_UPDATE],
    }),
  );
};

export const DeleteSpecialtyDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.SPECIALTY_DELETE],
    }),
  );
};
