import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { MedicalRecordResponse } from '@/types';
import { medicalRecordResponseSchema } from './medical-record.response';

const path = 'medical-records/all/appointment/:appointmentId';

export class FindMedicalRecordByAppointmentResponse extends getBaseOkResponseSchema<MedicalRecordResponse>({
  path,
  response: {
    message: 'Medical record retrieved successfully.',
    data: medicalRecordResponseSchema,
  },
}) {}

export class FindMedicalRecordByAppointmentNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Medical record not found for this appointment.',
  error: 'Medical Record Not Found',
}) {}
