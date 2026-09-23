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
import * as AppointmentRes from '../res';
import * as AppointmentDto from '../dto';

export const FindAppointmentsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
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
      owner: true,
      resource: 'appointment-patient',
    }),
  );
};

export const FindDoctorAppointmentsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
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
      owner: true,
      resource: 'appointment-doctor',
    }),
  );
};

export const FindMyClinicAppointmentsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
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
      clinicOwner: true,
      resource: 'appointment-doctor',
    }),
  );
};

export const CancelAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
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
      owner: true,
      resource: 'appointment-patient',
    }),
  );
};

export const ConfirmAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
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
      owner: true,
      resource: 'appointment-doctor',
    }),
  );
};

export const RejectAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
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
      owner: true,
      resource: 'appointment-doctor',
    }),
  );
};

export const CompleteAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
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
