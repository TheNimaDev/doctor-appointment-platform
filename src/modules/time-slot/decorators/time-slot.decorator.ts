import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { Permission, PERMISSIONS } from '@/common';

export const FindTimeSlotsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_MANAGE],
    }),
  );
};

export const FindTimeSlotDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_MANAGE],
    }),
  );
};

export const FindAvailableTimeSlotsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_READ],
    }),
  );
};

export const BlockTimeSlotDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_BLOCK],
    }),
  );
};

export const UnblockTimeSlotDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.TIME_SLOT_UNBLOCK],
    }),
  );
};
