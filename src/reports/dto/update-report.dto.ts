import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateReportDto {
  @ApiProperty({ description: 'Кількість нових робіт за поточний місяць', example: -5 })
  @IsNumber()
  readonly changesJobCount: number;
}
