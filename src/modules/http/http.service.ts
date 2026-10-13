import { Injectable } from '@nestjs/common';
import { HttpService as NestHttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PostHttpRequestPayload } from '@/types';

@Injectable()
export class HttpService {
  constructor(private readonly httpService: NestHttpService) {}

  async post<T>(payload: PostHttpRequestPayload<T>): Promise<unknown> {
    const response = await firstValueFrom(this.httpService.post<T>(payload.url, payload.data));

    return response.data;
  }
}
