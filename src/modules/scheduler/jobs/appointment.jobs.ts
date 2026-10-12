import { AppointmentService } from '@/modules/appointment/appointment.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppointmentJob {
  constructor(private readonly appointmentService: AppointmentService) {}

  /**
   * Expire appointments whose payment deadline has passed.
   */
  async expireAppointments() {
    await this.appointmentService.expireAppointments();
  }
}
