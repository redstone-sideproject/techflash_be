import { Injectable } from '@nestjs/common'

import { RedisService, DEFAULT_REDIS } from '@liaoliaots/nestjs-redis'
import Redis from 'ioredis'
import { TLearningCardResponse } from '@src/study-card/study-card.type'

@Injectable()
export class RedisCustomService {
  private readonly redis: Redis
  constructor(private readonly redisService: RedisService) {
    this.redis = redisService.getOrThrow()
  }

  async findSimilarQuestion(
    embeddingQuestion: number[],
  ): Promise<TLearningCardResponse | null> {
    console.log('start similar')

    const embeddingBuffer = Buffer.from(
      new Float32Array(embeddingQuestion).buffer,
    )

    const result = (await this.redis.call(
      'FT.SEARCH',
      'questions_index',
      '*=>[KNN 1 @embedding $vec AS score]',
      'PARAMS',
      2,
      'vec',
      embeddingBuffer,
      'SORTBY',
      'score',
      'RETURN',
      '2',
      'answer',
      'score',
      'DIALECT',
      2,
    )) as [number, string, [string, string, string, string]]

    if (result.length <= 1) return null

    const parsedResult = {
      score: parseFloat(result[2][1]),
      answer: JSON.parse(result[2][3]) as TLearningCardResponse,
    }

    console.log(parsedResult)
    if (parsedResult.score < 0.3) {
      return parsedResult.answer
    }

    return null
  }

  async saveQuestion(
    question: string,
    embeddingQuestion: number[],
    answer: TLearningCardResponse,
  ) {
    const answerJson = JSON.stringify(answer)
    const embeddingBuffer = Buffer.from(
      new Float32Array(embeddingQuestion).buffer,
    )

    await this.redis.hset(`question:${question}`, {
      embedding: embeddingBuffer,
      answer: answerJson,
    })

    await this.redis.call(
      'FT.ADD',
      'questions_index',
      `question:${question}`,
      1.0,
      'REPLACE',
      'FIELDS',
      'question',
      question,
      'embedding',
      embeddingBuffer,
      'answer',
      answerJson,
    )
  }
}
