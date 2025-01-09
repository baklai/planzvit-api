import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsMongoId,
  IsEmail,
  IsPhoneNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  IsDate
} from 'class-validator';
import { HydratedDocument } from 'mongoose';

import { PaginateResponseDto } from 'src/common/dto/paginate-response.dto';

@Schema()
export class Profile {
  @ApiProperty({
    description: 'ID запису (унікальний)',
    example: '6299b5cebf44864bfcea36d4',
    type: String
  })
  @IsString()
  @IsMongoId()
  readonly id: string;

  @ApiProperty({ description: 'Електронна адреса профілю', example: 'john@example.com' })
  @IsEmail()
  @IsString()
  @Prop({
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
    uniqueCaseInsensitive: true
  })
  readonly email: string;

  @Prop({ type: String, required: true, trim: true, minLength: 6, select: false })
  readonly password: string;

  @ApiProperty({ description: "Повне ім'я профілю", example: 'John Doe' })
  @IsString()
  @Prop({ type: String, required: true, trim: true })
  readonly fullname: string;

  @ApiProperty({ description: 'Номер телефону в профілі', example: '+38(234)567-89-10' })
  @IsString()
  @IsPhoneNumber()
  @Prop({
    type: String,
    required: true,
    trim: true
  })
  readonly phone: string;

  @ApiPropertyOptional({
    description: 'Прапорець, що вказує, чи активний профіль',
    default: false,
    example: false
  })
  @IsBoolean()
  @IsOptional()
  @Prop({ type: Boolean, default: false })
  readonly isActivated: boolean;

  @ApiPropertyOptional({
    description: 'Дозволи по профілю',
    default: 'user',
    example: 'user'
  })
  @IsString()
  @IsOptional()
  @Prop({ type: String, default: 'user' })
  readonly role: string;

  @ApiPropertyOptional({
    description: 'Дата створення запису',
    example: new Date()
  })
  @IsDate()
  @IsOptional()
  readonly createdAt: Date;

  @ApiPropertyOptional({
    description: 'Дата оновлення запису',
    example: new Date()
  })
  @IsDate()
  @IsOptional()
  readonly updatedAt: Date;
}

export class PaginateProfile extends PaginateResponseDto {
  @ApiProperty({ type: [Profile], description: 'Масив документів' })
  docs: Profile[];
}

export type ProfileDocument = HydratedDocument<Profile>;

export const ProfileSchema = SchemaFactory.createForClass(Profile);
