import { PartialType } from '@nestjs/swagger';

import { CreateSubdivisionDto } from './create-subdivision.dto';

export class UpdateSubdivisionDto extends PartialType(CreateSubdivisionDto) {}
