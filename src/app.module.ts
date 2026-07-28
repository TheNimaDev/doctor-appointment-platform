import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Modules from '@/modules';

@Module({
  imports: [
    // Config service for environment
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Core App Modules
    Modules.DatabaseModule,
  ],
})
export class AppModule {}
