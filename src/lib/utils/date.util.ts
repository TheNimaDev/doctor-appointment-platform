import { BadRequestException } from '@nestjs/common';
import type { BaseException } from '@/types';
import { DayOfWeek } from '@/modules/doctor-schedule/enums';

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

export const getDayOfWeek = (date: Date): DayOfWeek => {
  const day = new Intl.DateTimeFormat('en-US', {
    timeZone: IRAN_TIME_ZONE,
    weekday: 'long',
  }).format(date);

  return day.toUpperCase() as DayOfWeek;
};

export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);

  return hours * 60 + minutes;
};

export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:00`;
};

export const addDays = (date: string, days: number): string => {
  const value = new Date(`${date}T00:00:00${IRAN_UTC_OFFSET}`);

  value.setUTCDate(value.getUTCDate() + days);

  return new Intl.DateTimeFormat('en-CA', {
    timeZone: IRAN_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(value);
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
