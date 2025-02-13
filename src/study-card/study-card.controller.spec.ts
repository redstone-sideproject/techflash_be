import { Test, TestingModule } from '@nestjs/testing'
import { StudyCardController } from '@src/study-card/study-card.controller'

describe('StudyCardController', () => {
  let controller: StudyCardController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudyCardController],
    }).compile()

    controller = module.get<StudyCardController>(StudyCardController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
