import { RedisModuleOptions } from '@liaoliaots/nestjs-redis'
import { ConfigService } from '@nestjs/config'

export const redisConfig = (
  configService: ConfigService,
): RedisModuleOptions => ({
  config: {
    host: configService.get<string>('REDIS_HOST'),
    port: configService.get<number>('REDIS_PORT'),
    password: configService.get<string>('REDIS_PASSWORD'),
  },
})
