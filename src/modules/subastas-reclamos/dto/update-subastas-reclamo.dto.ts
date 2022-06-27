import { PartialType } from '@nestjs/mapped-types';
import { CreateSubastasReclamoDto } from './create-subastas-reclamo.dto';

export class UpdateSubastasReclamoDto extends PartialType(CreateSubastasReclamoDto) {}
