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
import * as MedicalRecordRes from '../res';
import * as MedicalRecordDto from '../dto';

/**
 * Create Medical Record
 */
export const CreateMedicalRecordDecorators = () => {
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
      type: MedicalRecordDto.CreateMedicalRecordDto,
    }),
    ApiCreatedResponse({
      type: MedicalRecordRes.CreateMedicalRecordResponse,
    }),
    ApiBadRequestResponse({
      type: MedicalRecordRes.CreateMedicalRecordBadRequestResponse,
    }),
    ApiConflictResponse({
      type: MedicalRecordRes.CreateMedicalRecordConflictResponse,
    }),
    ApiNotFoundResponse({
      type: MedicalRecordRes.CreateMedicalRecordNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.MEDICAL_RECORD_CREATE],
      ownership: 'doctor',
      resource: 'appointment',
      resourceIdParam: 'appointmentId',
    }),
  );
};

/**
 * Find all Medical Records
 */
export const FindMedicalRecordsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    ApiOkResponse({
      type: MedicalRecordRes.FindMedicalRecordsResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

/**
 * Find Medical Record by ID
 */
export const FindMedicalRecordDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    ApiParam({
      name: 'id',
      description: 'Medical Record ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: MedicalRecordRes.FindMedicalRecordResponse,
    }),
    ApiNotFoundResponse({
      type: MedicalRecordRes.FindMedicalRecordNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

/**
 * Find Medical Record by Appointment ID
 */
export const FindMedicalRecordByAppointmentDecorators = () => {
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
      type: MedicalRecordRes.FindMedicalRecordByAppointmentResponse,
    }),
    ApiNotFoundResponse({
      type: MedicalRecordRes.FindMedicalRecordByAppointmentNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.OWNER_ALL],
    }),
  );
};

/**
 * Find patient's Medical Records
 */
export const FindPatientMedicalRecordsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    Context('patient'),
    ApiOkResponse({
      type: MedicalRecordRes.FindPatientMedicalRecordsResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.MEDICAL_RECORD_READ_PATIENT],
    }),
  );
};

/**
 * Find patient's Medical Record by ID
 */
export const FindPatientMedicalRecordDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    Context('patient'),
    ApiParam({
      name: 'id',
      description: 'Medical Record ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: MedicalRecordRes.FindPatientMedicalRecordResponse,
    }),
    ApiNotFoundResponse({
      type: MedicalRecordRes.FindPatientMedicalRecordNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.MEDICAL_RECORD_READ_PATIENT],
      ownership: 'patient',
      resource: 'medical-record',
    }),
  );
};

/**
 * Find patient's Medical Record by Appointment ID
 */
export const FindPatientMedicalRecordByAppointmentDecorators = () => {
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
      type: MedicalRecordRes.FindPatientMedicalRecordByAppointmentResponse,
    }),
    ApiNotFoundResponse({
      type: MedicalRecordRes.FindPatientMedicalRecordByAppointmentNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.MEDICAL_RECORD_READ_PATIENT],
      ownership: 'patient',
      resource: 'appointment',
      resourceIdParam: 'appointmentId',
    }),
  );
};

/**
 * Find doctor's Medical Records
 */
export const FindDoctorMedicalRecordsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    Context('doctor'),
    ApiOkResponse({
      type: MedicalRecordRes.FindDoctorMedicalRecordsResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.MEDICAL_RECORD_READ_DOCTOR],
    }),
  );
};

/**
 * Find doctor's Medical Record by ID
 */
export const FindDoctorMedicalRecordDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    Context('doctor'),
    ApiParam({
      name: 'id',
      description: 'Medical Record ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: MedicalRecordRes.FindDoctorMedicalRecordResponse,
    }),
    ApiNotFoundResponse({
      type: MedicalRecordRes.FindDoctorMedicalRecordNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.MEDICAL_RECORD_READ_DOCTOR],
      ownership: 'doctor',
      resource: 'medical-record',
    }),
  );
};

/**
 * Find doctor's Medical Record by Appointment ID
 */
export const FindDoctorMedicalRecordByAppointmentDecorators = () => {
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
      type: MedicalRecordRes.FindDoctorMedicalRecordByAppointmentResponse,
    }),
    ApiNotFoundResponse({
      type: MedicalRecordRes.FindDoctorMedicalRecordByAppointmentNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.MEDICAL_RECORD_READ_DOCTOR],
      ownership: 'doctor',
      resource: 'appointment',
      resourceIdParam: 'appointmentId',
    }),
  );
};

/**
 * Find clinic admin's Medical Records
 */
export const FindMyClinicMedicalRecordsDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    Context('clinic'),
    ApiOkResponse({
      type: MedicalRecordRes.FindMyClinicMedicalRecordsResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.MEDICAL_RECORD_READ_CLINIC],
    }),
  );
};

/**
 * Find clinic admin's Medical Record by ID
 */
export const FindMyClinicMedicalRecordDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    Context('clinic'),
    ApiParam({
      name: 'id',
      description: 'Medical Record ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiOkResponse({
      type: MedicalRecordRes.FindMyClinicMedicalRecordResponse,
    }),
    ApiNotFoundResponse({
      type: MedicalRecordRes.FindMyClinicMedicalRecordNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.MEDICAL_RECORD_READ_CLINIC],
      ownership: 'clinic',
      resource: 'medical-record',
    }),
  );
};

/**
 * Find clinic admin's Medical Record by Appointment ID
 */
export const FindMyClinicMedicalRecordByAppointmentDecorators = () => {
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
      type: MedicalRecordRes.FindMyClinicMedicalRecordByAppointmentResponse,
    }),
    ApiNotFoundResponse({
      type: MedicalRecordRes.FindMyClinicMedicalRecordByAppointmentNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.MEDICAL_RECORD_READ_CLINIC],
      ownership: 'clinic',
      resource: 'appointment',
      resourceIdParam: 'appointmentId',
    }),
  );
};

/**
 * Update Medical Record
 */
export const UpdateMedicalRecordDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth('accessToken'),
    Context('doctor'),
    ApiParam({
      name: 'id',
      description: 'Medical Record ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiBody({
      type: MedicalRecordDto.UpdateMedicalRecordDto,
    }),
    ApiOkResponse({
      type: MedicalRecordRes.UpdateMedicalRecordResponse,
    }),
    ApiNotFoundResponse({
      type: MedicalRecordRes.UpdateMedicalRecordNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.MEDICAL_RECORD_UPDATE],
      ownership: 'doctor',
      resource: 'medical-record',
    }),
  );
};

/**
 * Delete Medical Record
 */
export const DeleteMedicalRecordDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.NO_CONTENT),
    ApiBearerAuth('accessToken'),
    Context('doctor'),
    ApiParam({
      name: 'id',
      description: 'Medical Record ID',
      type: String,
      format: 'uuid',
      example: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    }),
    ApiNoContentResponse(),
    ApiNotFoundResponse({
      type: MedicalRecordRes.DeleteMedicalRecordNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.MEDICAL_RECORD_DELETE],
      ownership: 'doctor',
      resource: 'medical-record',
    }),
  );
};
