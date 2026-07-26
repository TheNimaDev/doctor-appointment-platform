import { DataSource } from 'typeorm';
import 'dotenv/config';
import { join } from 'node:path';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USERNAME ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'doctor_appointment_platform',
  entities: [join(process.cwd(), 'src', '**', '*.entity.{ts,js}')],
  migrations: [join(process.cwd(), 'db', 'migrations', '*.{ts,js}')],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
});
