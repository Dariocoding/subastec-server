import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Roles } from './roles.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
	@Prop({ trim: true })
	username: string;

	@Prop({ required: true, trim: true })
	nombres: string;

	@Prop({ trim: true })
	apellidos: string;

	@Prop({ lowercase: true, trim: true })
	email_user: string;

	@Prop()
	telefono: string;

	@Prop({ default: null })
	password: string;

	@Prop()
	token: string;

	@Prop()
	fotoperfil: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Roles' })
	rolid: Roles;

	@Prop({ default: 1 })
	status: number;

	@Prop({ default: Date.now, required: true })
	datecreated: Date;

	@Prop({ default: null })
	hashedRt: string;

	@Prop({ default: null })
	facebookID: string;

	@Prop({ default: null })
	googleID: string;

	@Prop({ default: 0 })
	bids: number;
}
export const UserSchema = SchemaFactory.createForClass(User);
