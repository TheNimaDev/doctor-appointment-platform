import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';

const path = 'doctor-clinics/:doctorId';

export class DeleteDoctorClinicResponse extends getBaseOkResponseSchema<void>({
  path,
  response: {
    message: 'Doctor-clinic relation deleted successfully.',
  },
}) {}

export class DeleteDoctorClinicNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Doctor-clinic relation not found in database.',
  error: 'DoctorClinic Not Found',
}) {}
