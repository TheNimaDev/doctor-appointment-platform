import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities';

@Module({
  providers: [SessionService],
  imports: [TypeOrmModule.forFeature([Session])],
  exports: [SessionService],
})
export class SessionModule {}
