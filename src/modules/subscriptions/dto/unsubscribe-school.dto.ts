import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UnsubscribeToSchoolRequestBodyDto {
  @ApiProperty({ description: '학교 ID' })
  @IsNotEmpty()
  @IsNumber()
  schoolId: number;
}
