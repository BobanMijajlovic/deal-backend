import {Module, Scope} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {APP_GUARD, APP_INTERCEPTOR} from '@nestjs/core';
import {AuthModule} from './auth/auth.module';
import {PrismaModule} from './prisma/prisma.module';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {Jwt_atGuard} from './common/guards';
import {LoggingInterceptor} from './common/interceptors/logging.interceptor';
import {redisStore} from 'cache-manager-redis-store';
import {CacheModule, CacheStore} from '@nestjs/cache-manager';
import {ProductsModule} from './products/products.module';
import {UsersModule} from './modules/users/users.module';

@Module({
    imports: [
        CacheModule.registerAsync({
            imports: [ConfigModule],
            isGlobal: true,
            useFactory: async (config: ConfigService) => {
                const store = await redisStore({
                    socket: {
                        host: config.get('REDIS_HOST'),
                        port: +config.get('REDIS_PORT'),
                    },
                    password: config.get('REDIS_PASSWORD'),
                });

                return {
                    store: store as unknown as CacheStore,
                    ttl: 60 * 60 * 24 * 7,
                };
            },
            inject: [ConfigService],
        }),
        ConfigModule.forRoot({isGlobal: true}),
        AuthModule,
        PrismaModule,
        ProductsModule,
        UsersModule,
    ],
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
        AppService
    ],
})
export class AppModule {
}
