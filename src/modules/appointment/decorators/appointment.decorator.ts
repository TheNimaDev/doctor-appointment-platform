import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { Permission, PERMISSIONS } from '@/common';

export const FindAppointmentsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

export const FindAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

export const ReserveAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_RESERVE],
    }),
  );
};

export const FindPatientAppointmentsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_READ_PATIENT],
    }),
  );
};

export const FindPatientAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_READ_PATIENT],
    }),
  );
};

export const FindDoctorAppointmentsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_READ_DOCTOR],
    }),
  );
};

export const FindDoctorAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_READ_DOCTOR],
    }),
  );
};

export const CancelAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_CANCEL],
    }),
  );
};

export const ConfirmAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_CONFIRM],
    }),
  );
};

export const RejectAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_REJECT],
    }),
  );
};

export const CompleteAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_COMPLETE],
    }),
  );
};

export const NoShowAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_NO_SHOW],
    }),
  );
};
