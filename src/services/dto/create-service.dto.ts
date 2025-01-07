import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    description: 'Код сервісу (повинні бути унікальними)',
    example: '1234.2'
  })
  @IsString()
  readonly number: string;

  @ApiProperty({
    description: 'Назва сервісу (повинні бути унікальними)',
    example: 'Система техпідтримки'
  })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'Вартість підтримки', example: 120 })
  @IsNumber()
  readonly price: number;
}
