import { Document } from 'mongoose';
import { Images } from './images.interface';
export interface Productos extends Document {
	nombre: string;

	marca: string;

	ruta: string;

	codigo: string;

	codigoTarjeta: string;

	categoriaid?: string;

	nombrecategoria?: string;

	imagenes?: Images[];

	descripcion?: string;

	precio: number;

	status: number;

	datecreated: Date;
}
