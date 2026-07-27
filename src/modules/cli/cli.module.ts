import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/modules/database';

@Module({
  imports: [DatabaseModule],
})
export class CliModule {}
