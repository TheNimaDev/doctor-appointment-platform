import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { MedicalRecordResponse } from '@/types';
import { medicalRecordResponseSchema } from './medical-record.response';

const path = 'medical-records/my/appointment/:appointmentId';

export class FindPatientMedicalRecordByAppointmentResponse extends getBaseOkResponseSchema<MedicalRecordResponse>({
  path,
  response: {
    message: 'Patient medical record retrieved successfully.',
    data: medicalRecordResponseSchema,
  },
}) {}

export class FindPatientMedicalRecordByAppointmentNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Medical record not found for this appointment.',
  error: 'Medical Record Not Found',
}) {}
