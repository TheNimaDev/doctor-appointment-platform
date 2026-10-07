import { TimeSlotStatus } from '../enums';

export const TIME_SLOT_ALLOWED_TRANSITIONS: Record<TimeSlotStatus, TimeSlotStatus[]> = {
  [TimeSlotStatus.AVAILABLE]: [TimeSlotStatus.HELD, TimeSlotStatus.BLOCKED, TimeSlotStatus.EXPIRED],

  [TimeSlotStatus.HELD]: [TimeSlotStatus.AVAILABLE, TimeSlotStatus.BOOKED, TimeSlotStatus.EXPIRED],

  [TimeSlotStatus.BOOKED]: [TimeSlotStatus.EXPIRED],

  [TimeSlotStatus.BLOCKED]: [TimeSlotStatus.AVAILABLE, TimeSlotStatus.EXPIRED],

  [TimeSlotStatus.EXPIRED]: [],
};
