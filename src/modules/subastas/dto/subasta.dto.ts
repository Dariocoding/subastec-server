import { IsString, IsNotEmpty, IsDateString, IsNumber, IsDate } from 'class-validator';

export class SubastaDto {
	_id?: string;

	@IsString()
	@IsNotEmpty()
	titulo: string;

	fotoSubasta?: string;

	productoid?: string;

	paqueteBid?: string;

	fechaInicio: Date;

	fechaFinalizacion: Date;

	@IsNumber()
	@IsNotEmpty()
	costopuja: number;

	@IsNotEmpty()
	preciominimo: string;
}
