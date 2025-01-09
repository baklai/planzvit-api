import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({
    description: 'Скорочена назва відділу (повинні бути унікальними)',
    example: 'ВП'
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'Назва відділу (повинні бути унікальними)',
    example: 'Відділ продажів'
  })
  @IsString()
  readonly description: string;

  @ApiProperty({ description: 'Номер телефону', example: '+38(234)567-89-10' })
  @IsString()
  @IsPhoneNumber()
  readonly phone: string;

  @ApiProperty({
    description: 'Відповідальна особа',
    example: 'Прізвище В.В.'
  })
  @IsString()
  readonly manager: string;

  @ApiPropertyOptional({
    description: 'Ідентифікатор сервісу',
    example: ['6299b5cebf44864bfcea37a5']
  })
  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  readonly services: string[];
}
