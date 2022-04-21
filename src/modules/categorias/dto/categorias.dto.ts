import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoriaDto {
	@IsNotEmpty()
	@IsString()
	nombre: string;

	ruta?: string;

	descripcion?: string;

	portada?: string;

	status: number;

	borrarImagen?: string;
}
