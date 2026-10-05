import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
const path = 'prescriptions/item/:id';

export class DeletePrescriptionItemResponse extends getBaseOkResponseSchema<void>({
  path,
  response: {
    message: 'Prescription item deleted successfully.',
  },
}) {}

export class DeletePrescriptionItemBadRequestResponse extends getNormalErrorResponse({
  path,
  statusCode: 400,
  message: 'A prescription must contain at least one item.',
  error: 'Cannot Delete Last Prescription Item',
}) {}

export class DeletePrescriptionItemNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Prescription item not found in database.',
  error: 'Prescription Item Not Found',
}) {}
