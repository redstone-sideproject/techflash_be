import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RedisModule } from '@liaoliaots/nestjs-redis'

import { RedisCustomService } from '@src/redis/redis-custom.service'
import { redisConfig } from '@src/redis/redis-custom.config'

@Module({
  imports: [
    ConfigModule,
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => redisConfig(configService),
    }),
  ],
  providers: [RedisCustomService],
  exports: [RedisCustomService],
})
export class RedisCustomModule {}
