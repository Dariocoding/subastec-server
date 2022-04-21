import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Productos as ProductosSchema } from './productos.schema';
export type ImagesDocument = Images & Document;

@Schema()
export class Images {
	@Prop({ required: true })
	filename: string;

	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
	productoid: ProductosSchema;
}

export const ImagesSchema = SchemaFactory.createForClass(Images);
