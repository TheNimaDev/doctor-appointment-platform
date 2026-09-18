import { EntityManager } from 'typeorm';

import { User } from '@/modules/user/entities';
import { Doctor } from '@/modules/doctor/entities';
import { DoctorService } from '@/modules/doctor/doctor.service';
import { DoctorStatus } from '@/modules/doctor/enums';
import { SEED_DOCTORS } from './seed-constants';

export async function seedDoctors(doctorService: DoctorService, manager: EntityManager): Promise<void> {
  for (const seedDoctor of SEED_DOCTORS) {
    const user = await manager.findOne(User, {
      where: {
        email: seedDoctor.userEmail,
      },
    });

    if (!user) {
      throw new Error(`Doctor user "${seedDoctor.userEmail}" not found.`);
    }

    const exists = await manager.findOne(Doctor, {
      where: {
        userId: user.id,
      },
    });

    if (exists) {
      continue;
    }

    const { doctor } = await doctorService.create({
      userId: user.id,
      medicalCode: seedDoctor.medicalCode,
      experienceYears: seedDoctor.experienceYears,
      consultationFee: seedDoctor.consultationFee,
      manager,
    });

    await doctorService.updateStatus({
      doctorId: doctor.id,
      status: DoctorStatus.ACTIVE,  
      manager,
    });

    console.log(`✅ Doctor "${seedDoctor.userEmail}" seeded.`);
  }
}
