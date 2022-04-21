import { Document } from 'mongoose';

export interface User extends Document {
	hashedRt?: string | null;
	username: string;
	nombres: string;
	apellidos: string;
	email_user: string;
	telefono: string;
	password?: string;
	token?: string;
	fotoperfil?: string;
	rolid?: string;
	status?: number;
	datecreated: Date;

	facebookID?: string;

	googleID?: string;

	bids?: number;
}
