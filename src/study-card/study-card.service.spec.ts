import { Test, TestingModule } from '@nestjs/testing'
import { StudyCardService } from '@src/study-card/study-card.service'

describe('StudyCardService', () => {
  let service: StudyCardService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudyCardService],
    }).compile()

    service = module.get<StudyCardService>(StudyCardService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
