import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { ENV } from '@app/constants';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get<string>(ENV.DATABASE_URL),
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async deleteOne(id: number, model: string) {

      const r = await this[model].findUnique({
          where: {
              id
          }
      })

      if(!r) return {id}

    return this[model].delete({
          where: {
            id
          }
      })
  }
}
