import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from './modules/database/database.service';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Use environment
  const configService = app.get(ConfigService);
  let PORT = configService.get<number>('PORT', 3001);
  let BASE_URL = configService.get<string>('BASE_URL', 'api/v1');
  let APP_NAME = configService.get<string>('APP_NAME', 'Doctor Appointment Platform');

  //Base url
  app.setGlobalPrefix(BASE_URL);

  // Cheack DB connection
  const databaseService = app.get(DatabaseService);
  const isConnected: boolean = await databaseService.isConnected();
  if (!isConnected) {
    await app.close();
    throw new Error('❌ Database connection failed');
  }

  // Listen app
  await app.listen(PORT);
}
bootstrap();
