import { ConflictException, NotFoundException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import type { BaseException } from '@/types';

interface CheckDatabaseErrorParams {
  e: Error;
  mainResource: string;
  conflictField?: string | string[];
  notFoundField?: string;
  notFoundResource?: string;
}

export function checkDatabaseError(data: CheckDatabaseErrorParams): never {
  const { e, mainResource, conflictField, notFoundField, notFoundResource } = data;

  if (e instanceof QueryFailedError) {
    const driverError = e.driverError as {
      code?: string;
    };

    switch (driverError.code) {
      case 'ER_DUP_ENTRY': {
        const fields = Array.isArray(conflictField) ? conflictField.join(' or ') : conflictField;

        throw new ConflictException({
          message: `${mainResource} already exists in database${fields ? `, please change ${fields}` : '.'}`,
          error: `${mainResource} already exists`,
        } as BaseException);
      }

      case 'ER_NO_REFERENCED_ROW_2': {
        const resource = notFoundResource || mainResource;

        throw new NotFoundException({
          message: `${resource} not found in database, please check ${notFoundField || 'id'}`,
          error: `${resource} not found`,
        } as BaseException);
      }

      case 'ER_ROW_IS_REFERENCED_2': {
        throw new ConflictException({
          message: `${mainResource} cannot be deleted because it is used by other resources`,
          error: `${mainResource} is referenced`,
        } as BaseException);
      }
    }
  }

  throw e;
}
