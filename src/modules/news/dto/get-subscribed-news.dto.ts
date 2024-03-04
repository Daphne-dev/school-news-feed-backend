import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetSubscribedSchoolNewsRequestQueryDto {
  @ApiProperty({ description: '페이지 번호', example: 1 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  page: number;

  @ApiProperty({ description: '페이지 개수', example: 10 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  pageSize: number;
}

@Exclude()
export class SubscribedSchoolNewsItem {
  @Expose()
  @ApiProperty({
    description: '학교 소식 ID',
  })
  newsId: number;

  @Expose()
  @ApiProperty({ description: '제목', example: '새로운 학교 소식입니다.' })
  title: string;

  @Expose()
  @ApiProperty({ description: '내용', example: '학교 소식 예시입니다.' })
  content: string;

  @Expose()
  @ApiProperty({ description: '학교 소식 생성일', example: '2021-01-01T00:00:00.000Z' })
  createdAt: Date;
}

@Exclude()
export class GetSubscribedSchoolNewsResponseDto {
  @Expose()
  @ApiProperty({ description: '구독 중인 학교 소식 목록' })
  @Type(() => SubscribedSchoolNewsItem)
  list: SubscribedSchoolNewsItem[];

  constructor(data: GetSubscribedSchoolNewsResponseDto) {
    Object.assign(this, data);
  }
}
