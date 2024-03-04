import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNewsRequestBodyDto {
  @ApiProperty({ description: '제목', example: '새로운 학교 소식입니다.' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: '내용', example: '학교 소식 예시입니다.' })
  @IsNotEmpty()
  @IsString()
  content: string;
}

@Exclude()
export class CreateNewsResponseDto {
  @Expose()
  @ApiProperty({
    description: '학교 소식 ID',
  })
  newsId: number;

  constructor(data: CreateNewsResponseDto) {
    Object.assign(this, data);
  }
}
