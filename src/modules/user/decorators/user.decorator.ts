import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { Permission, PERMISSIONS } from '@/common';

export const GetMeDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.USER_READ],
      owner: true,
      resource: 'user',
    }),
  );
};

export const UpdateMeDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.USER_UPDATE],
      owner: true,
      resource: 'user',
    }),
  );
};

export const DeleteMeDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.USER_DELETE],
      owner: true,
      resource: 'user',
    }),
  );
};
