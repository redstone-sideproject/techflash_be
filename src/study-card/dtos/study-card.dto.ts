import { IsString } from 'class-validator'

export class StudyCardDto {
  @IsString()
  question: string
}
