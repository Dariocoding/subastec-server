import { Document } from 'mongoose';
export class PaqueteBid extends Document {
	bonus: number;
	cantidadBids: number;
	price: number;
	background: string;
	status: number;
}
