import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Permission, PERMISSIONS } from '@/common';
import * as RoleRes from '../res';
import * as RoleDto from '../dto';

export const CreateRoleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    ApiBody({ type: RoleDto.CreateRoleDto }),
    ApiCreatedResponse({ type: RoleRes.CreateRoleResponse }),
    ApiBadRequestResponse({ type: RoleRes.CreateRoleBadRequestResponse }),
    ApiConflictResponse({ type: RoleRes.CreateRoleConflictResponse }),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

export const FindRolesDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOkResponse({ type: RoleRes.FindRolesResponse }),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

export const FindRoleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

export const UpdateRoleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

export const DeleteRoleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};
