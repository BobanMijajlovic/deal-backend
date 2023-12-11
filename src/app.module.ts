import { Module, Scope } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { Jwt_atGuard } from './common/guards';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, PrismaModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: Jwt_atGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: LoggingInterceptor,
    },
    AppService,
  ],
})
export class AppModule {}
