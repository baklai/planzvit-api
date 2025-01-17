import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateReportStatusDto {
  @ApiProperty({ description: 'Статус звіту на поточний час', example: false })
  @IsBoolean()
  readonly completed: boolean;
}
