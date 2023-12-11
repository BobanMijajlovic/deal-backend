import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Jwt_atStrategy, Jwt_rtStrategy } from './strategies';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [AuthService, Jwt_atStrategy, Jwt_rtStrategy, JwtService],
  controllers: [AuthController],
})
export class AuthModule {}
