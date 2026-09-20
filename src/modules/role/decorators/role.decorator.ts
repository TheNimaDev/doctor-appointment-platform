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
    ApiParam({
      name: 'id',
      description: 'Role ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({ type: RoleRes.FindRoleResponse }),
    ApiNotFoundResponse({ type: RoleRes.FindRoleNotFoundResponse }),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

export const UpdateRoleDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiParam({
      name: 'id',
      description: 'Role ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiBody({ type: RoleDto.UpdateRoleDto }),
    ApiOkResponse({ type: RoleRes.UpdateRoleResponse }),
    ApiBadRequestResponse({ type: RoleRes.UpdateRoleBadRequestResponse }),
    ApiConflictResponse({ type: RoleRes.UpdateRoleConflictResponse }),
    ApiNotFoundResponse({ type: RoleRes.UpdateRoleNotFoundResponse }),
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
