import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSubastasDto {
	titulo: string;

	fotoSubasta?: string;

	productoid: number;

	paqueteBidId: number;

	fechaInicio: Date;

	fechaFinalizacion: Date;

	@IsNumber()
	@IsNotEmpty()
	costopuja: number;

	preciominimo: number;
}
