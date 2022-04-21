import { Document } from 'mongoose';

export interface Settings extends Document {
	nombre: string;

	correo: string;

	telefono: string;

	direccion: string;

	web: string;

	cantidad_subastas_inicio: number;

	orden_categoria: 'ASC' | 'DESC' | 'RAND' | 'ALPHABET';
}
