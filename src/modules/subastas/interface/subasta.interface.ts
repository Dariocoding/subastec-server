import { Document } from 'mongoose';

export interface Subasta extends Document {
	_id?: string;

	titulo: string;
	fotoSubasta: string;
	productoid: string;
	fechaInicio: Date;
	fechaFinalizacion: Date;
	costopuja: number;
	preciominimo: number;
	dateCreated: Date;
	status: number;
}
