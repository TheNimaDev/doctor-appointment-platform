import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { Permission, PERMISSIONS } from '@/common';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import * as UserRes from '../res';
import * as UserDto from '../dto';

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
    ApiBody({ type: UserDto.UpdateProfileDto }),
    ApiOkResponse({ type: UserRes.UpdateMeResponse }),
    ApiBadRequestResponse({ type: UserRes.UpdateMeBadRequestResponse }),
    Permission({
      permissions: [PERMISSIONS.USER_UPDATE],
    }),
  );
};

export const DeleteMeDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBody({ type: UserDto.DeleteMeDto }),
    ApiOkResponse({ type: UserRes.DeleteMeResponse }),
    ApiBadRequestResponse({ type: UserRes.DeleteMeBadRequestResponse }),
    ApiUnauthorizedResponse({ type: UserRes.DeleteMeUnauthorizedResponse }),
    Permission({
      permissions: [PERMISSIONS.USER_DELETE],
    }),
  );
};
