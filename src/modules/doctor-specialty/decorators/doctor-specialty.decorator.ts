import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Permission, PERMISSIONS, Public } from '@/common';
import * as DoctorSpecialtyRes from '../res';
import * as DoctorSpecialtyDto from '../dto';

export const AddDoctorSpecialtyDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    ApiBody({ type: DoctorSpecialtyDto.AddDoctorSpecialtyDto }),
    ApiCreatedResponse({ type: DoctorSpecialtyRes.AddDoctorSpecialtyResponse }),
    ApiBadRequestResponse({ type: DoctorSpecialtyRes.AddDoctorSpecialtyBadRequestResponse }),
    ApiNotFoundResponse({ type: DoctorSpecialtyRes.AddDoctorSpecialtyNotFoundResponse }),
    ApiConflictResponse({ type: DoctorSpecialtyRes.AddDoctorSpecialtyConflictResponse }),
    Permission({ permissions: [PERMISSIONS.DOCTOR_UPDATE] }),
  );
};

export const FindMyDoctorSpecialtiesDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOkResponse({ type: DoctorSpecialtyRes.FindMyDoctorSpecialtiesResponse }),
    ApiNotFoundResponse({ type: DoctorSpecialtyRes.FindMyDoctorSpecialtiesNotFoundResponse }),
    Permission({ permissions: [PERMISSIONS.DOCTOR_READ] }),
  );
};

export const FindDoctorSpecialtiesDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Public(),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_READ],
    }),
  );
};

export const SetDoctorSpecialtyPrimaryDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_UPDATE],
    }),
  );
};

export const RemoveDoctorSpecialtyDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_UPDATE],
    }),
  );
};
