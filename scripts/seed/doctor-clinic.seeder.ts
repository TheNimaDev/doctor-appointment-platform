import { EntityManager } from 'typeorm';
import { User } from '@/modules/user/entities';
import { Clinic } from '@/modules/clinic/entities';
import { Doctor } from '@/modules/doctor/entities';
import { DoctorClinic } from '@/modules/doctor-clinic/entities';
import { DoctorClinicService } from '@/modules/doctor-clinic/doctor-clinic.service';
import { SEED_DOCTOR_CLINICS } from './seed-constants';

export async function seedDoctorClinics(
  doctorClinicService: DoctorClinicService,
  manager: EntityManager,
): Promise<void> {
  for (const seedDoctorClinic of SEED_DOCTOR_CLINICS) {
    const doctorUser = await manager.findOne(User, {
      where: {
        email: seedDoctorClinic.doctorEmail,
      },
    });

    if (!doctorUser) {
      throw new Error(`Doctor user "${seedDoctorClinic.doctorEmail}" not found.`);
    }

    const doctor = await manager.findOne(Doctor, {
      where: {
        userId: doctorUser.id,
      },
    });

    if (!doctor) {
      throw new Error(`Doctor profile for "${seedDoctorClinic.doctorEmail}" not found.`);
    }

    const clinicAdmin = await manager.findOne(User, {
      where: {
        email: seedDoctorClinic.clinicOwnerEmail,
      },
    });

    if (!clinicAdmin) {
      throw new Error(`Clinic owner "${seedDoctorClinic.clinicOwnerEmail}" not found.`);
    }

    const clinic = await manager.findOne(Clinic, {
      where: {
        ownerId: clinicAdmin.id,
      },
    });

    if (!clinic) {
      throw new Error(`Clinic owned by "${seedDoctorClinic.clinicOwnerEmail}" not found.`);
    }

    const exists = await manager.findOne(DoctorClinic, {
      where: {
        doctorId: doctor.id,
        clinicId: clinic.id,
      },
    });

    if (exists) {
      continue;
    }

    await doctorClinicService.create({
      doctorId: doctor.id,
      clinicOwnerId: clinicAdmin.id,
      manager,
    });

    console.log(`✅ Doctor "${seedDoctorClinic.doctorEmail}" assigned to clinic "${clinic.name}".`);
  }

  console.log(`✅ Doctor-clinic relations seeded.`);
}
