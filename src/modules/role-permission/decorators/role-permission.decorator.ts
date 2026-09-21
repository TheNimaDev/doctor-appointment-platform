import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Permission, PERMISSIONS } from '@/common';
import * as RolePermissionRes from '../res';
import * as RolePermissionDto from '../dto';

export const AddRolePermissionDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    ApiParam({
      name: 'roleId',
      description: 'Role ID',
      type: String,
      format: 'uuid',
      example: '4c6e8f1a-3d5b-4f7c-9a2e-1b3d5f7c9e0a',
    }),
    ApiBody({ type: RolePermissionDto.AddRolePermissionDto }),
    ApiCreatedResponse({ type: RolePermissionRes.AddRolePermissionResponse }),
    ApiBadRequestResponse({ type: RolePermissionRes.AddRolePermissionBadRequestResponse }),
    ApiNotFoundResponse({ type: RolePermissionRes.AddRolePermissionNotFoundResponse }),
    ApiConflictResponse({ type: RolePermissionRes.AddRolePermissionConflictResponse }),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

export const RemoveRolePermissionDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

export const FindRolePermissionsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};
