import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RefreshJwtResponseDto {
  @Expose()
  @ApiProperty({
    description: 'access token',
  })
  accessToken: string;

  @Expose()
  @ApiProperty({
    description: 'refresh token',
  })
  refreshToken: string;

  constructor(data: RefreshJwtResponseDto) {
    Object.assign(this, data);
  }
}
