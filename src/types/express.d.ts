import type { Lookup } from 'geoip-lite';
import type { IResult } from 'ua-parser-js';

declare global {
  namespace Express {
    /**
     * Additional client information attached to the request.
     */
    interface Request {
      clientInfo: {
        ipAddress: string | null;
        userAgent: string | null;
        ua: IResult;
        geo: Lookup | null;
      };
    }
  }
}
