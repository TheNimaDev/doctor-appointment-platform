import type { TimeSlotResponse, TimeSlotsResponse } from '@/types';
import { TimeSlotStatus } from '../enums';

const timeSlotExample = {
  id: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
  scheduleId: '4c6e8f1a-3d5b-4f7c-9a2e-1b3d5f7c9e0a',
  date: '2026-10-01',
  startTime: '09:00',
  endTime: '09:30',
  status: TimeSlotStatus.AVAILABLE,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-02-08T02:11:20.630Z'),
  deletedAt: null,
};

export const timeSlotResponseSchema: TimeSlotResponse = {
  timeSlot: timeSlotExample,
};

export const timeSlotsResponseSchema: TimeSlotsResponse = {
  timeSlots: [timeSlotExample],
};
