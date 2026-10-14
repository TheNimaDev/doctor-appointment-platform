import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiQuery,
} from '@nestjs/swagger';
import * as TransactionRes from '../res';
import * as TransactionDto from '../dto';
import { Permission, PERMISSIONS } from '@/common';

export const CreateTransactionDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    ApiBearerAuth('accessToken'),
    ApiQuery({
      name: 'paymentId',
      description: 'Payment ID',
      type: String,
      format: 'uuid',
      example: '4c6e8f1a-3d5b-4f7c-9a2e-1b3d5f7c9e0a',
    }),
    ApiBody({
      type: TransactionDto.CreateTransactionDto,
    }),
    ApiCreatedResponse({
      type: TransactionRes.CreateTransactionResponse,
    }),
    ApiBadRequestResponse({
      type: TransactionRes.CreateTransactionBadRequestResponse,
    }),
    ApiNotFoundResponse({
      type: TransactionRes.CreateTransactionNotFoundResponse,
    }),
    Permission({
      permissions: [PERMISSIONS.TRANSACTION_CREATE],
      ownership: 'owner',
      resource: 'payment',
      resourceIdParam: 'paymentId',
    }),
  );
};
