import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Context, Permission, PERMISSIONS } from '@/common';
import * as AppointmentRes from '../res';
import * as AppointmentDto from '../dto';

export const FindAppointmentsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    ApiOkResponse({
      type: AppointmentRes.FindAppointmentsResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

export const FindAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    ApiParam({
      name: 'id',
      description: 'Appointment ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: AppointmentRes.FindAppointmentResponse,
    }),
    ApiNotFoundResponse({
      type: AppointmentRes.FindAppointmentNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

export const ReserveAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    ApiBearerAuth('accessToken'),
    Context('patient'),
    ApiBody({
      type: AppointmentDto.ReserveAppointmentDto,
    }),
    ApiCreatedResponse({
      type: AppointmentRes.ReserveAppointmentResponse,
    }),
    ApiBadRequestResponse({
      type: AppointmentRes.ReserveAppointmentBadRequestResponse,
    }),
    ApiConflictResponse({
      type: AppointmentRes.ReserveAppointmentConflictResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_RESERVE],
    }),
  );
};

export const FindPatientAppointmentsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    Context('patient'),
    ApiOkResponse({
      type: AppointmentRes.FindPatientAppointmentsResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_READ_PATIENT],
    }),
  );
};

export const FindPatientAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    ApiParam({
      name: 'id',
      description: 'Appointment ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: AppointmentRes.FindPatientAppointmentResponse,
    }),
    ApiNotFoundResponse({
      type: AppointmentRes.FindPatientAppointmentNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_READ_PATIENT],
      ownership: 'patient',
      resource: 'appointment',
    }),
  );
};

export const FindDoctorAppointmentsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    Context('doctor'),
    ApiOkResponse({
      type: AppointmentRes.FindDoctorAppointmentsResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_READ_DOCTOR],
    }),
  );
};

export const FindDoctorAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    ApiParam({
      name: 'id',
      description: 'Appointment ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: AppointmentRes.FindDoctorAppointmentResponse,
    }),
    ApiNotFoundResponse({
      type: AppointmentRes.FindDoctorAppointmentNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_READ_DOCTOR],
      ownership: 'doctor',
      resource: 'appointment',
    }),
  );
};

export const FindMyClinicAppointmentsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    Context('clinic'),
    ApiOkResponse({
      type: AppointmentRes.FindMyClinicAppointmentsResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_READ_DOCTOR],
    }),
  );
};

export const FindMyClinicAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    ApiParam({
      name: 'id',
      description: 'Appointment ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: AppointmentRes.FindMyClinicAppointmentResponse,
    }),
    ApiNotFoundResponse({
      type: AppointmentRes.FindMyClinicAppointmentNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_READ_DOCTOR],
      ownership: 'clinic',
      resource: 'appointment',
    }),
  );
};

export const CancelAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    ApiParam({
      name: 'id',
      description: 'Appointment ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiBody({
      type: AppointmentDto.CancelAppointmentDto,
    }),
    ApiOkResponse({
      type: AppointmentRes.CancelAppointmentResponse,
    }),
    ApiBadRequestResponse({
      type: AppointmentRes.CancelAppointmentBadRequestResponse,
    }),
    ApiNotFoundResponse({
      type: AppointmentRes.CancelAppointmentNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_CANCEL],
      ownership: 'doctor',
      resource: 'appointment',
    }),
  );
};

export const ConfirmMyClinicAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    ApiParam({
      name: 'id',
      description: 'Appointment ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: AppointmentRes.ConfirmAppointmentResponse,
    }),
    ApiNotFoundResponse({
      type: AppointmentRes.ConfirmAppointmentNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_CONFIRM],
      ownership: 'clinic',
      resource: 'appointment',
    }),
  );
};

export const ConfirmMyAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    ApiParam({
      name: 'id',
      description: 'Appointment ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: AppointmentRes.ConfirmAppointmentResponse,
    }),
    ApiNotFoundResponse({
      type: AppointmentRes.ConfirmAppointmentNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_CONFIRM],
      ownership: 'doctor',
      resource: 'appointment',
    }),
  );
};

export const RejectMyClinicAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    ApiParam({
      name: 'id',
      description: 'Appointment ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: AppointmentRes.RejectAppointmentResponse,
    }),
    ApiNotFoundResponse({
      type: AppointmentRes.RejectAppointmentNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_REJECT],
      ownership: 'clinic',
      resource: 'appointment',
    }),
  );
};

export const RejectMyAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    ApiParam({
      name: 'id',
      description: 'Appointment ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: AppointmentRes.RejectAppointmentResponse,
    }),
    ApiNotFoundResponse({
      type: AppointmentRes.RejectAppointmentNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_REJECT],
      ownership: 'doctor',
      resource: 'appointment',
    }),
  );
};

export const CompleteMyClinicAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    ApiParam({
      name: 'id',
      description: 'Appointment ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: AppointmentRes.CompleteAppointmentResponse,
    }),
    ApiNotFoundResponse({
      type: AppointmentRes.CompleteAppointmentNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_COMPLETE],
      ownership: 'clinic',
      resource: 'appointment',
    }),
  );
};

export const CompleteMyAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    ApiParam({
      name: 'id',
      description: 'Appointment ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: AppointmentRes.CompleteAppointmentResponse,
    }),
    ApiNotFoundResponse({
      type: AppointmentRes.CompleteAppointmentNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_COMPLETE],
      ownership: 'doctor',
      resource: 'appointment',
    }),
  );
};

export const NoShowMyClinicAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    ApiParam({
      name: 'id',
      description: 'Appointment ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: AppointmentRes.NoShowAppointmentResponse,
    }),
    ApiNotFoundResponse({
      type: AppointmentRes.NoShowAppointmentNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_NO_SHOW],
      ownership: 'clinic',
      resource: 'appointment',
    }),
  );
};

export const NoShowMyAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    ApiParam({
      name: 'id',
      description: 'Appointment ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: AppointmentRes.NoShowAppointmentResponse,
    }),
    ApiNotFoundResponse({
      type: AppointmentRes.NoShowAppointmentNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.APPOINTMENT_NO_SHOW],
      ownership: 'doctor',
      resource: 'appointment',
    }),
  );
};
