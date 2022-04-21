import { IsNotEmpty, IsString } from 'class-validator';

export class SettingsDto {
	@IsString()
	@IsNotEmpty()
	nombre: string;

	correo: string;

	telefono: string;

	direccion: string;

	web: string;

	cantidad_subastas_inicio: number;

	orden_categoria: 'ASC' | 'DESC' | 'RAND' | 'ALPHABET';
}
