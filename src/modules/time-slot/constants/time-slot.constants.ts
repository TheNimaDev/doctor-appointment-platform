import { TimeSlotStatus } from '../enums';

export const TIME_SLOT_ALLOWED_TRANSITIONS: Record<TimeSlotStatus, TimeSlotStatus[]> = {
  [TimeSlotStatus.AVAILABLE]: [TimeSlotStatus.BLOCKED, TimeSlotStatus.BOOKED],

  [TimeSlotStatus.BLOCKED]: [TimeSlotStatus.AVAILABLE],

  [TimeSlotStatus.BOOKED]: [TimeSlotStatus.AVAILABLE],

  [TimeSlotStatus.EXPIRED]: [],
};
