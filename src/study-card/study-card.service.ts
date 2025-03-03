import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { RedisCustomService } from '@src/redis/redis-custom.service'
import { OpenAiService } from '@src/open-ai/open-ai.service'

import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { catchError, firstValueFrom } from 'rxjs'
import { AxiosError } from 'axios'
import { Inject } from '@nestjs/common'
import { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { TLearningCardResponse } from '@src/study-card/study-card.type'

@Injectable()
export class StudyCardService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly redisCustomService: RedisCustomService,
    private readonly openAiService: OpenAiService,
  ) {}

  async getStudyCard(question: string) {
    const URL = this.configService.get<string>('FASTAPI_URL')
    try {
      // openAI API를 통해 질문 임베딩
      const embeddingQuestion =
        await this.openAiService.generateEmbedding(question)

      // 임베딩 값으로 Redis에서 유사한 질문 검색
      const cachedAnswer =
        await this.redisCustomService.findSimilarQuestion(embeddingQuestion)
      if (cachedAnswer) {
        this.logger.info(`successful find similar study-card - ${question}`)
        return cachedAnswer
      }

      // fastAPI로 질문 생성
      const { data } = await firstValueFrom(
        this.httpService
          .post<TLearningCardResponse>(`${URL}/ask/`, { question })
          .pipe(
            catchError((error: AxiosError) => {
              const status =
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
              const message =
                error.response?.data || 'External Fast-API call failed'

              throw new HttpException({ message, statusCode: status }, status)
            }),
          ),
      )

      // redis에 저장
      await this.redisCustomService.saveQuestion(
        question,
        embeddingQuestion,
        data,
      )

      this.logger.info(`successful create study-card - ${question}`)
      return data
    } catch (error) {
      this.logger.error(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Creating study-card Error: ${error} ` + `{stack: ${error.stack}}`,
      )
      throw new HttpException(
        {
          message: 'Failed to fetch study card',
          statusCode: HttpStatus.BAD_GATEWAY,
        },
        HttpStatus.BAD_GATEWAY,
      )
    }
  }
}
