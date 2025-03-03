import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston'
import * as winston from 'winston'
import * as winstonDaily from 'winston-daily-rotate-file'
import { LoggerMiddleware } from '@src/logger/logger.middleware'

const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'silly'

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: logLevel,
          format: winston.format.combine(
            winston.format.timestamp({
              format: () =>
                `${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })} (UTC+9)`,
            }),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('TechFlash', {
              prettyPrint: true,
            }),
          ),
        }),

        new winstonDaily({
          level: 'info',
          dirname: 'logs',
          filename: `%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',

          format: winston.format.combine(
            winston.format.timestamp({
              format: () =>
                `${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })} (UTC+9)`,
            }),
            winston.format.json(),
          ),
        }),

        new winston.transports.File({
          level: 'error',
          filename: 'logs/error.log',
          format: winston.format.combine(
            winston.format.timestamp({
              format: () =>
                `${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })} (UTC+9)`,
            }),
            winston.format.json(),
          ),
        }),
      ],
    }),
  ],
  providers: [LoggerMiddleware],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
