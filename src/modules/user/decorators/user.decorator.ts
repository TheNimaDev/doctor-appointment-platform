import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { Permission, PERMISSIONS } from '@/common';
import { ApiOkResponse } from '@nestjs/swagger';
import * as UserRes from '../res';

export const GetMeDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOkResponse({ type: UserRes.GetMeResponse }),
    Permission({
      permissions: [PERMISSIONS.USER_READ],
    }),
  );
};

export const UpdateMeDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.USER_UPDATE],
    }),
  );
};

export const DeleteMeDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.USER_DELETE],
    }),
  );
};
