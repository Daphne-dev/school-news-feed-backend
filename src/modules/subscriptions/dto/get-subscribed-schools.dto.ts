import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetSubscribedSchoolsRequestQueryDto {
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
export class GetSubscribedSchoolItem {
  @Expose()
  @ApiProperty({
    description: '학교 ID',
  })
  schoolId: number;

  @Expose()
  @ApiProperty({ description: '이름', example: '서울초등학교' })
  name: string;

  @Expose()
  @ApiProperty({ description: '지역', example: '서울 강남구' })
  region: string;

  @Expose()
  @ApiProperty({ description: '학교 페이지 생성일', example: '2021-01-01T00:00:00.000Z' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: '구독일', example: '2021-01-01T00:00:00.000Z' })
  subscribedAt: Date;
}

@Exclude()
export class GetSubscribedSchoolsResponseDto {
  @Expose()
  @ApiProperty({ description: '구독 중인 학교 페이지 목록' })
  @Type(() => GetSubscribedSchoolItem)
  list: GetSubscribedSchoolItem[];

  constructor(data: GetSubscribedSchoolsResponseDto) {
    Object.assign(this, data);
  }
}
