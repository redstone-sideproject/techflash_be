import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { StudyCardController } from '@study-card/study-card.controller'
import { StudyCardService } from '@study-card/study-card.service'

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [StudyCardController],
  providers: [StudyCardService],
})
export class StudyCardModule {}
