import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { RedisCustomService } from '@src/redis/redis-custom.service'
import { OpenAiService } from '@src/open-ai/open-ai.service'

import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { catchError, firstValueFrom } from 'rxjs'
import { AxiosError } from 'axios'

import { TLearningCardResponse } from '@src/study-card/study-card.type'

@Injectable()
export class StudyCardService {
  constructor(
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
      console.log('embedding')

      // 임베딩 값으로 Redis에서 유사한 질문 검색
      const cachedAnswer =
        await this.redisCustomService.findSimilarQuestion(embeddingQuestion)
      if (cachedAnswer) return cachedAnswer
      console.log('similar')

      // fastAPI로 질문 생성
      const { data } = await firstValueFrom(
        this.httpService
          .post<TLearningCardResponse>(`${URL}/v1/ask`, { question })
          .pipe(
            catchError((error: AxiosError) => {
              const status =
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
              const message = error.response?.data || 'External API call failed'

              throw new HttpException({ message, statusCode: status }, status)
            }),
          ),
      )
      console.log('fastapi')

      // redis에 저장
      await this.redisCustomService.saveQuestion(
        question,
        embeddingQuestion,
        data,
      )

      return data
    } catch (_error) {
      console.error(_error)
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
