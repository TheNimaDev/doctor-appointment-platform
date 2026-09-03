import { BadRequestException } from '@nestjs/common';
import type { BaseException } from '@/types';

const IRAN_TIME_ZONE = 'Asia/Tehran';
const IRAN_UTC_OFFSET = '+03:30';

export const getServerDateTime = (): Date => new Date();

export const getServerDate = (): string => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: IRAN_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(getServerDateTime());
};

export const getServerTime = (): string => {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: IRAN_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(getServerDateTime());
};

export const combineDateAndTime = (date: string, time: string): Date => {
  const value = new Date(`${date}T${time}${IRAN_UTC_OFFSET}`);

  if (Number.isNaN(value.getTime())) {
    throw new BadRequestException({
      message: 'Invalid date or time value.',
      error: 'Invalid Date Time',
    } as BaseException);
  }

  return value;
};

export const isDateTimeExpired = (date: string, time: string): boolean => {
  return combineDateAndTime(date, time) <= getServerDateTime();
};

export const getServerTimestamp = (): string => {
  return getServerDateTime().toISOString();
};
