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
    ApiParam({
      name: 'doctorId',
      description: 'Doctor ID',
      type: String,
      format: 'uuid',
      example: '4c6e8f1a-3d5b-4f7c-9a2e-1b3d5f7c9e0a',
    }),
    ApiOkResponse({ type: DoctorSpecialtyRes.FindDoctorSpecialtiesResponse }),
    ApiNotFoundResponse({ type: DoctorSpecialtyRes.FindDoctorSpecialtiesNotFoundResponse }),
    Permission({ permissions: [PERMISSIONS.DOCTOR_READ] }),
  );
};

export const SetDoctorSpecialtyPrimaryDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiParam({
      name: 'specialtyId',
      description: 'Specialty ID',
      type: String,
      format: 'uuid',
      example: '2b4d7e9a-1c3f-4b5d-8e7f-9a1b2c3d4e5f',
    }),
    ApiOkResponse({ type: DoctorSpecialtyRes.SetDoctorSpecialtyPrimaryResponse }),
    ApiNotFoundResponse({ type: DoctorSpecialtyRes.SetDoctorSpecialtyPrimaryNotFoundResponse }),
    Permission({ permissions: [PERMISSIONS.DOCTOR_UPDATE] }),
  );
};

export const RemoveDoctorSpecialtyDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiParam({
      name: 'specialtyId',
      description: 'Specialty ID',
      type: String,
      format: 'uuid',
      example: '2b4d7e9a-1c3f-4b5d-8e7f-9a1b2c3d4e5f',
    }),
    ApiOkResponse({ type: DoctorSpecialtyRes.RemoveDoctorSpecialtyResponse }),
    ApiNotFoundResponse({ type: DoctorSpecialtyRes.RemoveDoctorSpecialtyNotFoundResponse }),
    Permission({ permissions: [PERMISSIONS.DOCTOR_UPDATE] }),
  );
};
