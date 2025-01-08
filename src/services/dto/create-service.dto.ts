import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    description: 'Код сервісу (повинні бути унікальними)',
    example: '1234.2'
  })
  @IsString()
  readonly code: string;

  @ApiProperty({
    description: 'Назва сервісу (повинні бути унікальними)',
    example: 'Система техпідтримки'
  })
  @IsString()
  readonly name: string;

  @ApiPropertyOptional({ description: 'Вартість підтримки', example: 120 })
  @IsNumber()
  @IsOptional()
  readonly price: number;
}
