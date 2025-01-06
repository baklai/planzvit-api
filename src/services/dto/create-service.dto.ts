import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    description: 'Номер сервісу (повинні бути унікальними)',
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

  @ApiProperty({ description: 'Вартість сервісу', example: '120' })
  @IsNumber()
  readonly price: string;
}
