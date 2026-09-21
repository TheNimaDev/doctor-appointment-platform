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
import * as PermissionRes from '../res';
import * as PermissionDto from '../dto';

export const CreatePermissionDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    ApiBody({ type: PermissionDto.CreatePermissionDto }),
    ApiCreatedResponse({ type: PermissionRes.CreatePermissionResponse }),
    ApiBadRequestResponse({ type: PermissionRes.CreatePermissionBadRequestResponse }),
    ApiConflictResponse({ type: PermissionRes.CreatePermissionConflictResponse }),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

export const FindPermissionsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOkResponse({ type: PermissionRes.FindPermissionsResponse }),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

export const FindPermissionDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiParam({
      name: 'id',
      description: 'Permission ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({ type: PermissionRes.FindPermissionResponse }),
    ApiNotFoundResponse({ type: PermissionRes.FindPermissionNotFoundResponse }),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

export const UpdatePermissionDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiParam({
      name: 'id',
      description: 'Permission ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiBody({ type: PermissionDto.UpdatePermissionDto }),
    ApiOkResponse({ type: PermissionRes.UpdatePermissionResponse }),
    ApiBadRequestResponse({ type: PermissionRes.UpdatePermissionBadRequestResponse }),
    ApiConflictResponse({ type: PermissionRes.UpdatePermissionConflictResponse }),
    ApiNotFoundResponse({ type: PermissionRes.UpdatePermissionNotFoundResponse }),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

export const DeletePermissionDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};
