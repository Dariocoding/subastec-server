import { Document } from 'mongoose';

export interface Contactos extends Document {
	nombre: string;

	telefono: string;

	email: string;

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
