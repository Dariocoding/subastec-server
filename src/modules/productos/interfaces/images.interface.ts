import { Document } from 'mongoose';

export interface Images extends Document {
	filename: string;

	productoid: string;
}
