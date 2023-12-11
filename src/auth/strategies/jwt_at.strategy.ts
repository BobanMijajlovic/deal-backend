import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './d';
import { AuthService } from '@app/auth/auth.service';
import { ENV } from '@app/constants';

@Injectable()
export class Jwt_atStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private config: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>(ENV.JWT_TOKEN_ACCESS_SECRET),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.authService.getUser(payload.sub);
    if (!user) throw new UnauthorizedException();
    return payload;
  }
}
