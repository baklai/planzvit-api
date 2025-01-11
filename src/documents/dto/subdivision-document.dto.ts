import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsString } from 'class-validator';

export class SubdivisionDocumentDto {
  @ApiProperty({ description: 'Місяць створення звіту', example: 12 })
  @IsNumber()
  readonly monthOfReport: number;

  @ApiProperty({ description: 'Рік створення звіту', example: 2024 })
  @IsNumber()
  readonly yearOfReport: number;

  @ApiProperty({ description: 'Ідентифікатор підрозділу', example: '6299b5cebf44864bfcea37a5' })
  @IsString()
  @IsMongoId()
  readonly subdivision: string;
}
