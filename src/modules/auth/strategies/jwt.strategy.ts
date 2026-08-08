import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessTokenPayload, UserAccess } from '@/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_TOKEN_SECRET'),
      ignoreExpiration: false,
    });
  }

  /**
   * Validate the JWT payload and return the authenticated user access data.
   */
  validate(payload: AccessTokenPayload): UserAccess {
    return {
      userId: payload.sub,
      permissions: payload.permissions,
      roles: payload.roles,
      iat: payload.iat,
      exp: payload.exp,
      display_name: payload?.display_name ?? '',
    };
  }
}
