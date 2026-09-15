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
      owner: true,
      resource: 'appointment-patient',
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
      owner: true,
      resource: 'appointment-doctor',
    }),
  );
};

export const FindMyClinicAppointmentsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_READ_DOCTOR],
    }),
  );
};

export const FindMyClinicAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_READ_DOCTOR],
      clinicOwner: true,
      resource: 'appointment-doctor',
    }),
  );
};

export const CancelAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_CANCEL],
      owner: true,
      resource: 'appointment-patient',
    }),
  );
};

export const ConfirmAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_CONFIRM],
      owner: true,
      resource: 'appointment-doctor',
    }),
  );
};

export const RejectAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_REJECT],
      owner: true,
      resource: 'appointment-doctor',
    }),
  );
};

export const CompleteAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_COMPLETE],
      owner: true,
      resource: 'appointment-doctor',
    }),
  );
};

export const NoShowAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_NO_SHOW],
      owner: true,
      resource: 'appointment-doctor',
    }),
  );
};
