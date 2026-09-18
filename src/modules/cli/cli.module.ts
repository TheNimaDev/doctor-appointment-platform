import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, UserModule, RoleModule, UserRoleModule, DoctorModule, ClinicModule, DoctorClinicModule } from '@/modules';

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
