import { IsNotEmpty, IsString } from 'class-validator';

export class SettingsDto {
	@IsString()
	@IsNotEmpty()
	nombre: string;

	@IsString()
	@IsNotEmpty()
	telefono: string;

	@IsString()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	mensaje: string;

	ip?: string;
	dispositivo?: string;
	useragent?: {
		browser: string;
		version: string;
		os: string;
		platform: string;
		source: string;
	};
	datecreated?: string;
}
