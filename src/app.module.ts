import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Modules from '@/modules';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

@Module({
  imports: [
    // Config service for environment
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Core App Modules
    Modules.DatabaseModule,
    Modules.UserModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
