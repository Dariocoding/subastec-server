import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Categorias } from 'src/modules/categorias/schemas';
export type ProductosDocument = Productos & Document;
@Schema()
export class Productos {
	@Prop({ required: true, trim: true })
	nombre: string;

	@Prop({ trim: true })
	marca: string;

	@Prop({ trim: true })
	ruta: string;

	@Prop({ trim: true })
	codigo: string;

	@Prop({ trim: true })
	codigoTarjeta: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: Categorias.name })
	categoriaid: Categorias;

	@Prop()
	descripcion: string;

	@Prop({
		type: mongoose.Schema.Types.Decimal128,
	})
	precio: number;

	@Prop({ default: 1 })
	status: number;

	@Prop({ default: Date.now })
	datecreated: Date;
}

export const ProductosSchema = SchemaFactory.createForClass(Productos);
