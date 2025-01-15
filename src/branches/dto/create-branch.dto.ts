import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({
    description: 'Назва служби (філії) (повинні бути унікальними)',
    example: 'ФП'
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'Повна назва служби (філії) (повинні бути унікальними)',
    example: 'Філія продажів'
  })
  @IsString()
  readonly description: string;

  @ApiPropertyOptional({
    description: 'Ідентифікатор структурного підрозділу',
    example: ['6299b5cebf44864bfcea37a5']
  })
  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  readonly subdivisions: string[];
}
