import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TokensDto {
  @ApiProperty({
    description:
      'Доступ до токена JWT. JWT — це облікові дані, які можуть надавати доступ до ресурсів.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  })
  @IsString()
  readonly accessToken: string;

  @ApiProperty({
    description:
      'Оновити токен JWT. JWT — це облікові дані, які можуть надавати доступ до ресурсів.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  })
  @IsString()
  readonly refreshToken: string;
}
