import { TimeSlotStatus } from '../enums';

export const TIME_SLOT_ALLOWED_TRANSITIONS: Record<TimeSlotStatus, TimeSlotStatus[]> = {
  [TimeSlotStatus.AVAILABLE]: [TimeSlotStatus.BLOCKED, TimeSlotStatus.BOOKED, TimeSlotStatus.EXPIRED],

  [TimeSlotStatus.BLOCKED]: [TimeSlotStatus.AVAILABLE, TimeSlotStatus.EXPIRED],

  [TimeSlotStatus.BOOKED]: [TimeSlotStatus.AVAILABLE, TimeSlotStatus.EXPIRED],

  [TimeSlotStatus.EXPIRED]: [],
};
