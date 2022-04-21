import { PartialType } from '@nestjs/swagger';
import { CreatePaqueteBidDto } from './create-paquete-bid.dto';

export class UpdatePaqueteBidDto extends PartialType(CreatePaqueteBidDto) {}
