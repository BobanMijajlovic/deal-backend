import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { SignInDto, SignUpDto } from './dto';
import { ENV } from '@app/constants';
import { UserModel } from '@app/prisma/d';
import { PrismaService } from '@app/prisma/prisma.service';
import { CACHE_MANAGER, Cache} from '@nestjs/cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private async createTokens(user: UserModel) {
    const payload = {
      email: user.email,
      sub: user.id,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>(ENV.JWT_TOKEN_ACCESS_SECRET),
        expiresIn: this.config.get<string>(ENV.JWT_TOKEN_ACCESS_SECRET_EXP),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>(ENV.JWT_TOKEN_REFRESH_SECRET),
        expiresIn: this.config.get<string>(ENV.JWT_TOKEN_REFRESH_SECRET_EXP),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRtHash(userId: number, rt: string): Promise<void> {
    const tokenRt = await argon.hash(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        tokenRt,
      },
    });
  }

  async signUp(data: SignUpDto) {
    const userExists = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (userExists) throw new ConflictException('User exists');

    const hash = await argon.hash(data.password);
    const newUser = await this.prisma.user
      .create({
        data: {
          email: data.email,
          hash,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ConflictException('User exists');
          }
        }
        throw error;
      });
    return {
      email: newUser.email,
    };
  }

  async signIn(data: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user) throw new UnauthorizedException();

    const passwordMatches = await argon.verify(user.hash, data.password);
    if (!passwordMatches) throw new UnauthorizedException();

    const tokens = await this.createTokens(user);
    await this.updateRtHash(user.id, tokens.refreshToken);

    return {
      ...tokens,
    };
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
      },
      data: {
        tokenRt: null,
      },
    });
  }

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!!user?.tokenRt) throw new ForbiddenException();
    const isSame = await argon.verify(user.tokenRt, refreshToken);
    if (!isSame) throw new UnauthorizedException();
    const tokens = await this.createTokens(user);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async getUser(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        email: true,
      },
    });
  }
}
