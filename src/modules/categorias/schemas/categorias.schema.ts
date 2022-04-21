import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoriasDocument = Categorias & Document;

@Schema()
export class Categorias {
	@Prop({ required: true, trim: true })
	nombre: string;

	@Prop({ required: true, trim: true })
	ruta: string;

	@Prop()
	descripcion: string;

	@Prop()
	portada: string;

	@Prop()
	status: number;
}

export const CategoriasSchema = SchemaFactory.createForClass(Categorias);
