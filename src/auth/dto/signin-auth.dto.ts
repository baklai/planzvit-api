import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SigninAuthDto {
  @ApiProperty({ description: 'Електронна адреса профілю', example: 'helpdesk@helpdesk.com' })
  @IsEmail()
  @IsString()
  @IsDefined({ message: 'Необхідно вказати електронну адресу' })
  @IsNotEmpty({ message: 'Поле електронної пошти не повинно бути порожнім' })
  readonly email: string;

  @ApiProperty({
    description: 'Пароль профілю (мінімум 6 символів)',
    example: 'enkFDOCsqPEE'
  })
  @IsString()
  @MinLength(6, { message: 'Пароль має бути не менше 6 символів' })
  @IsDefined({ message: 'Необхідно вказати пароль' })
  @IsNotEmpty({ message: 'Пароль не повинен бути порожнім' })
  readonly password: string;
}
