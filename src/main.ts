import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from './modules/database/database.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';

let PORT: number;
let BASE_URL: string;
let APP_NAME: string;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Use environment
  const configService = app.get(ConfigService);
  PORT = configService.get<number>('PORT', 3001);
  BASE_URL = configService.get<string>('BASE_URL', 'api/v1');
  APP_NAME = configService.get<string>('APP_NAME', 'Doctor Appointment Platform');

  //Base url
  app.setGlobalPrefix(BASE_URL);

  // Enable cookie parsing
  app.use(cookieParser());

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

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  underline: '\x1b[4m',

  red: '\x1b[31m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m',
  white: '\x1b[37m',
};

// Bootstrap and run application
bootstrap()
  .then(() => {
    const baseUrl = `http://localhost:${PORT}/${BASE_URL}`;
    console.clear();

    console.log(`
${colors.bold}${colors.blue}
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║     🚀 ${APP_NAME} API Started Successfully 🚀     ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
${colors.reset}

${colors.dim}${colors.gray}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}

${colors.bold}${colors.white}📊 SYSTEM INFO${colors.reset}
${colors.dim}${colors.gray}──────────────────────────────────────────────────────────────────────${colors.reset}

${colors.green}●${colors.reset} ${colors.bold}Environment${colors.reset}         ${colors.green}${process.env.NODE_ENV || 'development'}${colors.reset}
${colors.yellow}●${colors.reset} ${colors.bold}Process ID${colors.reset}           ${colors.yellow}${process.pid}${colors.reset}
${colors.magenta}●${colors.reset} ${colors.bold}Node Version${colors.reset}         ${colors.magenta}${process.version}${colors.reset}
${colors.cyan}●${colors.reset} ${colors.bold}Platform${colors.reset}             ${colors.cyan}${process.platform}${colors.reset}
${colors.gray}●${colors.reset} ${colors.bold}Started At${colors.reset}           ${colors.gray}${new Date().toLocaleString()}${colors.reset}

${colors.dim}${colors.gray}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}

${colors.bold}${colors.green}✅ All endpoints are ready to serve${colors.reset}

${colors.bold}${colors.white}📍 ENDPOINTS${colors.reset}
${colors.dim}${colors.gray}──────────────────────────────────────────────────────────────────────${colors.reset}

${colors.green}●${colors.reset} ${colors.bold}Server Address${colors.reset}     ${colors.green}${colors.underline}http://localhost:${PORT}${colors.reset}
${colors.magenta}●${colors.reset} ${colors.bold}API Base Path${colors.reset}      ${colors.magenta}${colors.underline}${baseUrl}${colors.reset}

${colors.dim}${colors.gray}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}

${colors.dim}${colors.gray}💡 Press Ctrl+C to shut down the server${colors.reset}

`);
  })
  .catch((error) => {
    console.error(`
${colors.bold}${colors.red}
╔═════════════════════════════════════════════════════════════════════╗
║                                                                     ║
║    ❌ FAILED TO START ${APP_NAME} APPLICATION ❌    ║
║                                                                     ║
╚═════════════════════════════════════════════════════════════════════╝
${colors.reset}      
${colors.bold}${colors.red}Error Details${colors.reset}
${colors.dim}${colors.gray}───────────────────────────────────────────────────────────────────────${colors.reset}

${
  error instanceof Error ? `${colors.red}${error.stack}${colors.reset}` : `${colors.red}${String(error)}${colors.reset}`
}

${colors.dim}${colors.gray}───────────────────────────────────────────────────────────────────────${colors.reset}
`);

    process.exit(1);
  });
