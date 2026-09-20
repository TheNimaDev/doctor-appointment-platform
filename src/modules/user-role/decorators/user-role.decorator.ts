import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { Permission, PERMISSIONS } from '@/common';
import * as UserRoleRes from '../res';

export const FindUserRolesDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiParam({
      name: 'userId',
      description: 'User ID',
      type: String,
      format: 'uuid',
      example: '2b4d7e9a-1c3f-4b5d-8e7f-9a1b2c3d4e5f',
    }),
    ApiOkResponse({ type: UserRoleRes.FindUserRolesResponse }),
    ApiNotFoundResponse({ type: UserRoleRes.FindUserRolesNotFoundResponse }),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

export const AddUserRoleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

export const RemoveUserRoleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};
