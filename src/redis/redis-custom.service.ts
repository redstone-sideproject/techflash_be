import { Injectable } from '@nestjs/common'

import { RedisService, DEFAULT_REDIS } from '@liaoliaots/nestjs-redis'
import Redis from 'ioredis'

@Injectable()
export class RedisCustomService {
  private readonly redis: Redis
  constructor(private readonly redisService: RedisService) {
    this.redis = redisService.getOrThrow()
  }

  async set() {
    console.log('reids set method')
    return await this.redis.set('test', 'hi', 'EX', 10)
  }
}
