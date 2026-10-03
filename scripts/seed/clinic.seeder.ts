import { EntityManager } from 'typeorm';
import { Clinic } from '@/modules/clinic/entities';
import { ClinicService } from '@/modules/clinic/clinic.service';
import { User } from '@/modules/user/entities';
import { ClinicStatus } from '@/modules/clinic/enums';
import { SEED_CLINICS } from './seed-constants';

export async function seedClinics(clinicService: ClinicService, manager: EntityManager): Promise<void> {
  for (const seedClinic of SEED_CLINICS) {
    const user = await manager.findOne(User, {
      where: {
        email: seedClinic.ownerEmail,
      },
    });

    if (!user) {
      throw new Error(`Clinic owner "${seedClinic.ownerEmail}" not found.`);
    }

    const exists = await manager.findOne(Clinic, {
      where: {
        ownerId: user.id,
      },
    });

    if (exists) {
      continue;
    }

    const { clinic } = await clinicService.create({
      ownerId: user.id,
      name: seedClinic.name,
      city: seedClinic.city,
      address: seedClinic.address,
      manager,
    });

    await clinicService.updateStatus({
      id: clinic.id,
      status: ClinicStatus.ACTIVE,
      manager,
    });

    console.log(`✅ Clinic "${seedClinic.name}" seeded.`);
  }
}
