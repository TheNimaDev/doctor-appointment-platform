import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Context, Permission, PERMISSIONS } from '@/common';
import * as PrescriptionRes from '../res';
import * as PrescriptionDto from '../dto';

/**
 * Create Prescription
 */
export const CreatePrescriptionDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    ApiBearerAuth('accessToken'),
    Context('doctor'),
    ApiParam({
      name: 'appointmentId',
      description: 'Appointment ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiBody({
      type: PrescriptionDto.CreatePrescriptionDto,
    }),
    ApiCreatedResponse({
      type: PrescriptionRes.CreatePrescriptionResponse,
    }),
    ApiBadRequestResponse({
      type: PrescriptionRes.CreatePrescriptionBadRequestResponse,
    }),
    ApiConflictResponse({
      type: PrescriptionRes.CreatePrescriptionConflictResponse,
    }),
    ApiNotFoundResponse({
      type: PrescriptionRes.CreatePrescriptionNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.PRESCRIPTION_CREATE],
      ownership: 'doctor',
      resource: 'appointment',
      resourceIdParam: 'appointmentId',
    }),
  );
};

/**
 * Find all Prescriptions
 */
export const FindPrescriptionsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    ApiOkResponse({
      type: PrescriptionRes.FindPrescriptionsResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

/**
 * Find Prescription by ID
 */
export const FindPrescriptionDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    ApiParam({
      name: 'id',
      description: 'Prescription ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: PrescriptionRes.FindPrescriptionResponse,
    }),
    ApiNotFoundResponse({
      type: PrescriptionRes.FindPrescriptionNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

/**
 * Find Prescription by Appointment ID
 */
export const FindPrescriptionByAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    ApiParam({
      name: 'appointmentId',
      description: 'Appointment ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: PrescriptionRes.FindPrescriptionByAppointmentResponse,
    }),
    ApiNotFoundResponse({
      type: PrescriptionRes.FindPrescriptionByAppointmentNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

/**
 * Find patient's Prescriptions
 */
export const FindPatientPrescriptionsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    Context('patient'),
    ApiOkResponse({
      type: PrescriptionRes.FindPatientPrescriptionsResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.PRESCRIPTION_READ_PATIENT],
    }),
  );
};

/**
 * Find patient's Prescription by ID
 */
export const FindPatientPrescriptionDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    Context('patient'),
    ApiParam({
      name: 'id',
      description: 'Prescription ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: PrescriptionRes.FindPatientPrescriptionResponse,
    }),
    ApiNotFoundResponse({
      type: PrescriptionRes.FindPatientPrescriptionNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.PRESCRIPTION_READ_PATIENT],
      ownership: 'patient',
      resource: 'prescription',
    }),
  );
};

/**
 * Find patient's Prescription by Appointment ID
 */
export const FindPatientPrescriptionByAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    Context('patient'),
    ApiParam({
      name: 'appointmentId',
      description: 'Appointment ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: PrescriptionRes.FindPatientPrescriptionByAppointmentResponse,
    }),
    ApiNotFoundResponse({
      type: PrescriptionRes.FindPatientPrescriptionByAppointmentNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.PRESCRIPTION_READ_PATIENT],
      ownership: 'patient',
      resource: 'appointment',
      resourceIdParam: 'appointmentId',
    }),
  );
};

/**
 * Find doctor's Prescriptions
 */
export const FindDoctorPrescriptionsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    Context('doctor'),
    ApiOkResponse({
      type: PrescriptionRes.FindDoctorPrescriptionsResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.PRESCRIPTION_READ_DOCTOR],
    }),
  );
};

/**
 * Find doctor's Prescription by ID
 */
export const FindDoctorPrescriptionDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    Context('doctor'),
    ApiParam({
      name: 'id',
      description: 'Prescription ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: PrescriptionRes.FindDoctorPrescriptionResponse,
    }),
    ApiNotFoundResponse({
      type: PrescriptionRes.FindDoctorPrescriptionNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.PRESCRIPTION_READ_DOCTOR],
      ownership: 'doctor',
      resource: 'prescription',
    }),
  );
};

/**
 * Find doctor's Prescription by Appointment ID
 */
export const FindDoctorPrescriptionByAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    Context('doctor'),
    ApiParam({
      name: 'appointmentId',
      description: 'Appointment ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: PrescriptionRes.FindDoctorPrescriptionByAppointmentResponse,
    }),
    ApiNotFoundResponse({
      type: PrescriptionRes.FindDoctorPrescriptionByAppointmentNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.PRESCRIPTION_READ_DOCTOR],
      ownership: 'doctor',
      resource: 'appointment',
      resourceIdParam: 'appointmentId',
    }),
  );
};

/**
 * Find clinic admin's Prescriptions
 */
export const FindMyClinicPrescriptionsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    Context('clinic'),
    ApiOkResponse({
      type: PrescriptionRes.FindMyClinicPrescriptionsResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.PRESCRIPTION_READ_CLINIC],
    }),
  );
};

/**
 * Find clinic admin's Prescription by ID
 */
export const FindMyClinicPrescriptionDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    Context('clinic'),
    ApiParam({
      name: 'id',
      description: 'Prescription ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: PrescriptionRes.FindMyClinicPrescriptionResponse,
    }),
    ApiNotFoundResponse({
      type: PrescriptionRes.FindMyClinicPrescriptionNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.PRESCRIPTION_READ_CLINIC],
      ownership: 'clinic',
      resource: 'prescription',
    }),
  );
};

/**
 * Find clinic admin's Prescription by Appointment ID
 */
export const FindMyClinicPrescriptionByAppointmentDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    Context('clinic'),
    ApiParam({
      name: 'appointmentId',
      description: 'Appointment ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: PrescriptionRes.FindMyClinicPrescriptionByAppointmentResponse,
    }),
    ApiNotFoundResponse({
      type: PrescriptionRes.FindMyClinicPrescriptionByAppointmentNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.PRESCRIPTION_READ_CLINIC],
      ownership: 'clinic',
      resource: 'appointment',
      resourceIdParam: 'appointmentId',
    }),
  );
};

/**
 * Update Prescription
 */
export const UpdatePrescriptionDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    Context('doctor'),
    ApiParam({
      name: 'id',
      description: 'Prescription ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiBody({
      type: PrescriptionDto.UpdatePrescriptionDto,
    }),
    ApiOkResponse({
      type: PrescriptionRes.UpdatePrescriptionResponse,
    }),
    ApiBadRequestResponse({
      type: PrescriptionRes.UpdatePrescriptionBadRequestResponse,
    }),
    ApiNotFoundResponse({
      type: PrescriptionRes.UpdatePrescriptionNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.PRESCRIPTION_UPDATE],
      ownership: 'doctor',
      resource: 'prescription',
    }),
  );
};

/**
 * Delete Prescription
 */
export const DeletePrescriptionDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.NO_CONTENT),
    ApiBearerAuth('accessToken'),
    Context('doctor'),
    ApiParam({
      name: 'id',
      description: 'Prescription ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiNoContentResponse(),
    ApiNotFoundResponse({
      type: PrescriptionRes.DeletePrescriptionNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.PRESCRIPTION_DELETE],
      ownership: 'doctor',
      resource: 'prescription',
    }),
  );
};
