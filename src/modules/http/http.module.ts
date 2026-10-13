import { Module } from '@nestjs/common';
import { HttpModule as NestHttpModule } from '@nestjs/axios';
import { HttpService } from './http.service';

@Module({
  imports: [
    NestHttpModule.register({
      timeout: 5000,
      maxRedirects: 0,
    }),
  ],
  providers: [HttpService],
  exports: [HttpService],
})
export class HttpModule {}
