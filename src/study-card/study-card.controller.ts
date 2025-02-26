import {
  Controller,
  Post,
  Get,
  Body,
  BadRequestException,
} from '@nestjs/common'
import { StudyCardService } from '@src/study-card/study-card.service'

@Controller('study-card')
export class StudyCardController {
  constructor(private readonly studyCardService: StudyCardService) {}

  @Post()
  async getStudyCard(@Body('question') question: string) {
    if (!question.trim()) {
      throw new BadRequestException('Question field is required')
    }
    return await this.studyCardService.getStudyCard(question)
  }
}
