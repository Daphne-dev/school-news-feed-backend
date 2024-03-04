import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSchoolPageRequestBodyDto {
  @ApiProperty({ description: '이름', example: '서울초등학교' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: '지역', example: '서울 강남구' })
  @IsNotEmpty()
  @IsString()
  region: string;
}

@Exclude()
export class CreateSchoolPageResponseDto {
  @Expose()
  @ApiProperty({
    description: '학교 ID',
  })
  schoolId: number;

  constructor(data: CreateSchoolPageResponseDto) {
    Object.assign(this, data);
  }
}
