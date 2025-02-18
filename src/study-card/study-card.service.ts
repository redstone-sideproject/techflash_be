import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { RedisCustomService } from '@src/redis/redis-custom.service'

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
  ) {}

  async testRedis() {
    return this.redisCustomService.set()
  }

  async getStudyCard(question: string) {
    const URL = this.configService.get<string>('FASTAPI_URL')
    try {
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

      return data
    } catch (_error) {
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
