import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true })
  app.enableCors({
    origin: ['https://techflash.zokbal.kr', 'http://localhost:5173'],
  })
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
