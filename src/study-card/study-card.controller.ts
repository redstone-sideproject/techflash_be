import { Controller } from '@nestjs/common'
import { StudyCardService } from '@src/study-card/study-card.service'

@Controller('study-card')
export class StudyCardController {
  constructor(private readonly studyCardService: StudyCardService) {}
}
