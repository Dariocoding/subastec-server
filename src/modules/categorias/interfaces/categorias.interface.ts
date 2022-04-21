import { Document } from 'mongoose';

export interface Categorias extends Document {
	nombre: string;

	ruta?: string;

	descripcion?: string;

	status: number;

	portada?: string;
	totalproductos?: number;

	productos?: Array<any>;
}
