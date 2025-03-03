import { Injectable, NestMiddleware, Logger } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name)

  use(req: Request, res: Response, next: NextFunction) {
    const url = req.originalUrl
    const method = req.method
    const logMessage = `${method} ${url}`

    this.logger.log(logMessage)

    next()
  }
}
