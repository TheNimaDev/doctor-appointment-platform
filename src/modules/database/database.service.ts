import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(public readonly dataSource: DataSource) {}

  isConnected(): boolean {
    return this.dataSource.isInitialized;
  }
}
