import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsNotEmpty, IsDefined, IsString, IsEmail } from 'class-validator';

export class SignupAuthDto {
  @ApiProperty({ description: "Повне і'мя профілю", example: 'John Doe' })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  readonly fullname: string;

  @ApiProperty({ description: 'Електронна адреса профілю', example: 'john@helpdesk.io' })
  @IsEmail()
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ description: 'пароль профілю', example: '12345678' })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ description: 'Номер телефону профілю', example: '+38(123)456-78-90' })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @IsPhoneNumber()
  readonly phone: string;
}
