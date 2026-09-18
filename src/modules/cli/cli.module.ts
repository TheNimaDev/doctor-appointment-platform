import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@/modules/database';
import { UserModule } from '@/modules/user';
import { RoleModule } from '@/modules/role';
import { UserRoleModule } from '@/modules/user-role';
import { DoctorModule } from '@/modules/doctor';
import { ClinicModule } from '@/modules/clinic';
import { DoctorClinicModule } from '@/modules/doctor-clinic';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    UserModule,
    RoleModule,
    UserRoleModule,
    DoctorModule,
    ClinicModule,
    DoctorClinicModule,
  ],
})
export class CliModule {}
