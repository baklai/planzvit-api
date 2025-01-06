import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({
    description: 'Назва відділу (повинні бути унікальними)',
    example: 'Відділ продажів'
  })
  @IsString()
  readonly name: string;

  @ApiPropertyOptional({
    description: 'Опис відділу',
    example: 'Відповідає за підвищення продажів і залучення клієнтів.'
  })
  @IsString()
  @IsOptional()
  readonly description: string;
}
