import { applyDecorators, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RefreshTokenGuard } from '@/common/guards';
import { Public } from '@/common';
import * as AuthRes from '../res';
import * as AuthDto from '../dto';

export const RegisterDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    ApiBody({ type: AuthDto.RegisterDto }),
    ApiCreatedResponse({ type: AuthRes.RegisterResponse }),
    ApiBadRequestResponse({ type: AuthRes.RegisterBadRequestResponse }),
    ApiConflictResponse({ type: AuthRes.RegisterConflictResponse }),
    Public(),
  );
};

export const VerifyEmailDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiQuery({ type: AuthDto.VerifyEmailDto }),
    ApiOkResponse({ type: AuthRes.VerifyEmailResponse }),
    ApiBadRequestResponse({ type: AuthRes.VerifyEmailBadRequestResponse }),
    Public(),
  );
};

export const LoginDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBody({ type: AuthDto.LoginDto }),
    ApiOkResponse({ type: AuthRes.LoginResponseSchema }),
    ApiUnauthorizedResponse({ type: AuthRes.LoginUnauthorizedResponse }),
    ApiBadRequestResponse({ type: AuthRes.LoginBadRequestResponse }),
    Public(),
  );
};

export const LogoutDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOkResponse({ type: AuthRes.LogoutResponse }),
    ApiUnauthorizedResponse({ type: AuthRes.LogoutUnauthorizedResponse }),
    ApiNotFoundResponse({ type: AuthRes.LogoutNotFoundResponse }),
    Public({
      isPublicAccess: false,
      isPublicPermission: true,
    }),
    UseGuards(RefreshTokenGuard),
  );
};

export const LogoutAllDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOkResponse({ type: AuthRes.LogoutAllResponse }),
    ApiUnauthorizedResponse({ type: AuthRes.LogoutAllUnauthorizedResponse }),
    ApiNotFoundResponse({ type: AuthRes.LogoutAllNotFoundResponse }),
    Public({
      isPublicAccess: false,
      isPublicPermission: true,
    }),
    UseGuards(RefreshTokenGuard),
  );
};

export const VerifyEmailResendDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBody({ type: AuthDto.ResendVerificationEmailDto }),
    ApiOkResponse({ type: AuthRes.VerifyEmailResendResponse }),
    ApiUnauthorizedResponse({ type: AuthRes.VerifyEmailResendUnauthorizedResponse }),
    ApiBadRequestResponse({ type: AuthRes.VerifyEmailResendBadRequestResponse }),
    Public(),
  );
};

export const RefreshDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOkResponse({ type: AuthRes.RefreshResponse }),
    ApiUnauthorizedResponse({ type: AuthRes.RefreshUnauthorizedResponse }),
    Public({
      isPublicAccess: false,
      isPublicPermission: true,
    }),
    UseGuards(RefreshTokenGuard),
  );
};

export const ChangePasswordDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBody({ type: AuthDto.ChangePasswordDto }),
    ApiOkResponse({ type: AuthRes.ChangePasswordResponse }),
    ApiUnauthorizedResponse({ type: AuthRes.ChangePasswordUnauthorizedResponse }),
    ApiBadRequestResponse({ type: AuthRes.ChangePasswordBadRequestResponse }),
  );
};

export const ForgotPasswordDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBody({ type: AuthDto.ForgotPasswordDto }),
    ApiOkResponse({ type: AuthRes.ForgotPasswordResponse }),
    ApiBadRequestResponse({ type: AuthRes.ForgotPasswordBadRequestResponse }),
    Public(),
  );
};

export const ResetPasswordDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBody({ type: AuthDto.ResetPasswordDto }),
    ApiOkResponse({ type: AuthRes.ResetPasswordResponse }),
    ApiBadRequestResponse({ type: AuthRes.ResetPasswordBadRequestResponse }),
    Public(),
  );
};

export const ChangeEmailDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBody({ type: AuthDto.ChangeEmailDto }),
    ApiOkResponse({ type: AuthRes.ChangeEmailResponse }),
    ApiUnauthorizedResponse({ type: AuthRes.ChangeEmailUnauthorizedResponse }),
    ApiBadRequestResponse({ type: AuthRes.ChangeEmailBadRequestResponse }),
  );
};

export const ConfirmChangeEmailDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Public(),
  );
};
