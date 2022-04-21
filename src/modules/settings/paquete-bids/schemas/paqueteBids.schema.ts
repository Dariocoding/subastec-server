import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

export type PaqueteBidDocument = PaqueteBid & Document;
@Schema()
export class PaqueteBid {
	@Prop()
	bonus: number;

	@Prop({ required: true })
	cantidadBids: number;

	@Prop({
		type: mongoose.Schema.Types.Decimal128,
	})
	price: number;

	@Prop()
	background: string;

	@Prop({ default: 1 })
	status: number;
}

export const PaqueteBidSchema = SchemaFactory.createForClass(PaqueteBid).set('toJSON', {
	transform: (doc, ret) => {
		ret.price = parseFloat(ret.price.toString());
		return ret;
	},
});
