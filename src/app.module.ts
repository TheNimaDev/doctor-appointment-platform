import { BadRequestException, MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Modules from '@/modules';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import {
  AccessTokenGuard,
  ClientInfoMiddleware,
  OwnershipGuard,
  PermissionsGuard,
  ResponseInterceptor,
} from '@/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpExceptionFilter } from '@/common/';
import { ValidationError } from 'class-validator';
import { ValidationFieldError } from './types';

function flattenValidationErrors(errors: ValidationError[], parentPath = ''): ValidationFieldError[] {
  const result: ValidationFieldError[] = [];

  for (const error of errors) {
    const field = parentPath ? `${parentPath}.${error.property}` : error.property;

    if (error.constraints) {
      for (const message of Object.values(error.constraints)) {
        result.push({
          field,
          error: message,
        });
      }
    }

    if (error.children?.length) {
      result.push(...flattenValidationErrors(error.children, field));
    }
  }

  return result;
}

@Module({
  imports: [
    // Load environment configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Configure event emitter
    EventEmitterModule.forRoot(),

    // Initialize task scheduling
    ScheduleModule.forRoot(),

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
    Modules.RoleModule,
    Modules.PermissionModule,
    Modules.RolePermissionModule,
    Modules.UserRoleModule,
    Modules.DoctorScheduleModule,
    Modules.TimeSlotModule,
    Modules.AppointmentModule,
    Modules.SchedulerModule,
    Modules.DoctorClinicModule,
    Modules.PatientModule,
    Modules.MedicalRecordModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,

        exceptionFactory: (errors: ValidationError[]) => {
          return new BadRequestException({
            message: 'Validation failed.',
            error: 'Bad Request',
            errors: flattenValidationErrors(errors),
          });
        },
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
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
