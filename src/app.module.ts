import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Modules from '@/modules';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ResponseInterceptor } from '@/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    // Config service for environment
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Config Event Emitter
    EventEmitterModule.forRoot(),

    // Core App Modules
    Modules.DatabaseModule,
    Modules.UserModule,
    Modules.AuthModule,
    Modules.EmailModule,
    Modules.MailModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
