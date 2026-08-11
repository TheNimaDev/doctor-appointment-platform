import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities';
import { UserController } from './user.controller';
import { RefreshTokenModule } from '@/modules/refresh-token';
import { SessionModule } from '@/modules/session';

@Module({
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([User]), RefreshTokenModule, SessionModule],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
