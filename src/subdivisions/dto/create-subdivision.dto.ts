import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSubdivisionDto {
  @ApiProperty({
    description: 'Назва підрозділу (повинні бути унікальними)',
    example: 'ВП'
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'Повна назва підрозділу (повинні бути унікальними)',
    example: 'Відділ продажів'
  })
  @IsString()
  readonly description: string;
}
