import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class SubscribeToSchoolRequestBodyDto {
  @ApiProperty({ description: '학교 ID' })
  @IsNotEmpty()
  @IsNumber()
  schoolId: number;
}

@Exclude()
export class SubscribeToSchoolResponseDto {
  @Expose()
  @ApiProperty({
    description: '구독 ID',
  })
  subscriptionId: number;

  constructor(data: SubscribeToSchoolResponseDto) {
    Object.assign(this, data);
  }
}
