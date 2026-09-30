import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';

import type { MedicalRecordResponse } from '@/types';
import { medicalRecordResponseSchema } from './medical-record.response';

const path = 'medical-records/my-clinic/appointment/:appointmentId';

export class FindMyClinicMedicalRecordByAppointmentResponse extends getBaseOkResponseSchema<MedicalRecordResponse>({
  path,
  response: {
    message: 'Clinic medical record retrieved successfully.',
    data: medicalRecordResponseSchema,
  },
}) {}

export class FindMyClinicMedicalRecordByAppointmentNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Medical record not found for this appointment in clinic.',
  error: 'Medical Record Not Found',
}) {}
