import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UpdateNewsRequestBodyDto {
  @ApiProperty({ description: '제목', example: '수정된 학교 소식입니다.' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: '내용', example: '수정된 학교 소식 예시입니다.' })
  @IsOptional()
  @IsString()
  content?: string;
}

@Exclude()
export class UpdateNewsResponseDto {
  @Expose()
  @ApiProperty({
    description: '학교 소식 ID',
  })
  newsId: number;

  constructor(data: UpdateNewsResponseDto) {
    Object.assign(this, data);
  }
}
