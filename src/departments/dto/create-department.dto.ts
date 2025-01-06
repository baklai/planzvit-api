import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsPhoneNumber, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({
    description: 'Скорочена назва відділу (повинні бути унікальними)',
    example: 'ВП'
  })
  @IsString()
  readonly code: string;

  @ApiProperty({
    description: 'Назва відділу (повинні бути унікальними)',
    example: 'Відділ продажів'
  })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'Номер телефону', example: '+38(234)567-89-10' })
  @IsString()
  @IsPhoneNumber()
  readonly phone: string;

  @ApiProperty({
    description: 'Начальник відділу',
    example: 'Прізвище В.В.'
  })
  @IsString()
  readonly manager: string;

  @ApiProperty({
    description: 'Ідентифікатор профілю, пов’язаний зі сповіщенням',
    example: ['6299b5cebf44864bfcea37a5']
  })
  @IsMongoId({ each: true })
  readonly services: string[];
}
