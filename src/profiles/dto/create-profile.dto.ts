import { Scope } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength
} from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ description: 'Електронна адреса профілю', example: 'john@example.com' })
  @IsEmail()
  @IsString()
  readonly email: string;

  @ApiProperty({
    description: 'Пароль профілю (мінімум 6 символів)',
    example: 'vJaPk2eg9UaN'
  })
  @IsString()
  @MinLength(6, { message: 'Пароль має бути не менше 6 символів' })
  readonly password: string;

  @ApiProperty({ description: "Повне ім'я профілю", example: 'John Doe' })
  @IsString()
  readonly fullname: string;

  @ApiProperty({ description: 'Номер телефону в профілі', example: '+38(234)567-89-10' })
  @IsString()
  @IsPhoneNumber()
  readonly phone: string;

  @ApiPropertyOptional({
    description: 'Прапорець, що вказує, чи активний профіль',
    default: false,
    example: true
  })
  @IsBoolean()
  @IsOptional()
  readonly isActivated: boolean;

  @ApiPropertyOptional({
    description: 'Дозволи по профілю',
    default: 'user',
    example: 'user'
  })
  @IsArray()
  @IsString()
  @IsOptional()
  readonly scope: string;
}
