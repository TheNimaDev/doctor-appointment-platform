import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Modules from '@/modules';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import {
  AccessTokenGuard,
  ClientInfoMiddleware,
  OwnershipGuard,
  PermissionsGuard,
  ResponseInterceptor,
} from '@/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    // Load environment configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Configure event emitter
    EventEmitterModule.forRoot(),

    // Application modules
    Modules.DatabaseModule,
    Modules.UserModule,
    Modules.AuthModule,
    Modules.EmailModule,
    Modules.MailModule,
    Modules.RefreshTokenModule,
    Modules.SessionModule,
    Modules.DoctorModule,
    Modules.SpecialtyModule,
    Modules.DoctorSpecialtyModule,
    Modules.ClinicModule,
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
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_GUARD,
      useClass: OwnershipGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClientInfoMiddleware).forRoutes('*');
  }
}
