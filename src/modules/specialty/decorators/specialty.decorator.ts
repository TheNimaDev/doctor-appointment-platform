import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';

import { Permission, PERMISSIONS } from '@/common';

export const CreateSpecialtyDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

export const FindSpecialtiesDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_READ],
    }),
  );
};

export const FindSpecialtyDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.DOCTOR_READ],
    }),
  );
};

export const UpdateSpecialtyDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

export const DeleteSpecialtyDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};
