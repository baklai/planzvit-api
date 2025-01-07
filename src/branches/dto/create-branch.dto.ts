import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

class Subdivision {
  @ApiProperty({ description: 'Назва підрозділу' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'Повна назва підрозділу' })
  @IsString()
  readonly description: string;
}

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

  @ApiProperty({
    description: 'Перелік підрозділів',
    type: [Subdivision]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Subdivision)
  readonly subdivisions: Subdivision[];
}
