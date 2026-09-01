import { AppointmentStatus } from '../enums';

export const APPOINTMENT_ALLOWED_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  [AppointmentStatus.PENDING]: [AppointmentStatus.CONFIRMED, AppointmentStatus.REJECTED, AppointmentStatus.CANCELLED],

  [AppointmentStatus.CONFIRMED]: [AppointmentStatus.CANCELLED, AppointmentStatus.COMPLETED, AppointmentStatus.NO_SHOW],

  [AppointmentStatus.REJECTED]: [],

  [AppointmentStatus.CANCELLED]: [],

  [AppointmentStatus.COMPLETED]: [],

  [AppointmentStatus.NO_SHOW]: [],
};
