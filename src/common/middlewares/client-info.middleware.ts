import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';
import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class ClientInfoMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const ipAddress = this.getClientIp(req);

    const userAgent = req.headers['user-agent'] ?? '';
    const ua = new UAParser(userAgent).getResult();

    const geo = ipAddress ? geoip.lookup(ipAddress) : null;

    req.clientInfo = {
      ipAddress,
      ua,
      geo,
    };

    next();
  }

  private getClientIp(req: Request): string | null {
    const getFirst = (header: string | string[] | undefined): string | null => {
      if (!header) return null;

      if (Array.isArray(header)) {
        return header[0] ?? null;
      }

      return header.split(',')[0].trim();
    };

    return (
      getFirst(req.headers['cf-connecting-ip']) ||
      getFirst(req.headers['x-forwarded-for']) ||
      req.ip ||
      req.socket.remoteAddress?.replace(/^::ffff:/, '') ||
      null
    );
  }
}
