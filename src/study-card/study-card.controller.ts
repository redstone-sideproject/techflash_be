import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Inject,
} from '@nestjs/common'
import { StudyCardService } from '@src/study-card/study-card.service'
import { Logger } from 'winston'
import { StudyCardDto } from '@src/study-card/dtos/study-card.dto'

@Controller('study-card')
export class StudyCardController {
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly studyCardService: StudyCardService,
  ) {}

  @Post()
  async getStudyCard(@Body() body: StudyCardDto) {
    if (!body.question.trim()) {
      throw new BadRequestException('Question field is required')
    }
    this.logger.info(`Input Topic - ${JSON.stringify(body)}`)
    return await this.studyCardService.getStudyCard(body.question)
  }
}
