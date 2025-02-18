import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { RedisCustomModule } from '@src/redis/redis-custom.module'
import { StudyCardController } from '@study-card/study-card.controller'
import { StudyCardService } from '@study-card/study-card.service'

@Module({
  imports: [HttpModule, ConfigModule, RedisCustomModule],
  controllers: [StudyCardController],
  providers: [StudyCardService],
})
export class StudyCardModule {}
