import { Module } from '@nestjs/common';
import { HttpModule as NestHttpModule } from '@nestjs/axios';

@Module({
  imports: [
    NestHttpModule.register({
      timeout: 5000,
      maxRedirects: 0,
    }),
  ],

})
export class HttpModule {}
