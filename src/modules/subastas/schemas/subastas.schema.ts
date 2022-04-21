import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Productos } from 'src/modules/productos/schemas';
import { PaqueteBid } from 'src/modules/settings/paquete-bids/schemas/paqueteBids.schema';
export type SubastaDocument = Subasta & Document;

@Schema()
export class Subasta {
	@Prop({ required: true, trim: true })
	titulo: string;

	@Prop()
	fotoSubasta: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: Productos.name })
	productoid: Productos;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: PaqueteBid.name })
	paqueteBid: PaqueteBid;

	@Prop({ default: Date.now })
	dateCreated: Date;

	@Prop({ required: true })
	fechaInicio: Date;

	@Prop({ required: true })
	fechaFinalizacion: Date;

	@Prop({ required: true })
	costopuja: number;

	@Prop({ required: true })
	preciominimo: number;

	@Prop({ default: 1 })
	status: number;
}
export const SubastaSchema = SchemaFactory.createForClass(Subasta);
