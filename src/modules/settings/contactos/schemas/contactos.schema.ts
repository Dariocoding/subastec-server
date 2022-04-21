import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContactosDocument = Contactos & Document;

@Schema()
export class Contactos {
	@Prop({ required: true })
	nombre: string;

	@Prop({ required: true })
	telefono: string;

	@Prop({ required: true })
	email: string;

	@Prop({ required: true })
	mensaje: string;

	@Prop()
	ip: string;

	@Prop()
	dispositivo: string;

	@Prop({ type: Object })
	useragent: Object;

	@Prop({ default: Date.now, required: true })
	datecreated: Date;
}

export const ContactosSchema = SchemaFactory.createForClass(Contactos);
