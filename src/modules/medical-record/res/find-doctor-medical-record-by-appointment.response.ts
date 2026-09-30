import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';

import type { MedicalRecordResponse } from '@/types';
import { medicalRecordResponseSchema } from './medical-record.response';

const path = 'medical-records/doctor/appointment/:appointmentId';

export class FindDoctorMedicalRecordByAppointmentResponse extends getBaseOkResponseSchema<MedicalRecordResponse>({
  path,
  response: {
    message: 'Doctor medical record retrieved successfully.',
    data: medicalRecordResponseSchema,
  },
}) {}

export class FindDoctorMedicalRecordByAppointmentNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Medical record not found for this appointment.',
  error: 'Medical Record Not Found',
}) {}
