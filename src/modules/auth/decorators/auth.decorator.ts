import { applyDecorators, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from '@/common/guards';
import { Public } from '@/common';

export const RegisterDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    Public()
  );
};

export const VerifyEmailDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Public()
  );
};

export const LoginDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Public()
  );
};

export const LogoutDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
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
    Public()
  );
};

export const RefreshDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
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
  );
};

export const ForgotPasswordDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Public()
  );
};

export const ResetPasswordDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Public()
  );
};

export const ChangeEmailDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
  );
};

export const ConfirmChangeEmailDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Public(),
  );
};
