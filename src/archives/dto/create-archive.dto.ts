import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateArchiveDto {
  @ApiProperty({ description: 'Кількість нових робіт за поточний місяць', example: -7 })
  @IsNumber()
  readonly changesJobCount: number;
}
