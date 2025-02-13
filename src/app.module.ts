import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { StudyCardModule } from './study-card/study-card.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}.local`,
    }),
    StudyCardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
