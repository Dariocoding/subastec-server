import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SettingsDocument = Settings & Document;

@Schema()
export class Settings {
	@Prop({ required: true })
	nombre: string;

	@Prop()
	correo: string;

	@Prop()
	telefono: string;

	@Prop()
	direccion: string;

	@Prop()
	web: string;

	@Prop()
	cantidad_subastas_inicio: number;

	@Prop()
	orden_categoria: 'ASC' | 'DESC' | 'RAND' | 'ALPHABET';
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
