import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePaqueteBidDto } from './dto/create-paquete-bid.dto';
import { UpdatePaqueteBidDto } from './dto/update-paquete-bid.dto';
import { PaqueteBid } from './entities/paquete-bid.entity';
import { convertToFloat } from 'src/helpers';

@Injectable()
export class PaqueteBidsService {
	constructor(@InjectModel('PaqueteBid') private paqueteBidModel: Model<PaqueteBid>) {}

	async create(paqueteBid: CreatePaqueteBidDto): Promise<PaqueteBid> {
		paqueteBid.price = convertToFloat(paqueteBid.price);
		const createdPaqueteBid = new this.paqueteBidModel(paqueteBid);
		return await createdPaqueteBid.save();
	}

	async findAll(): Promise<PaqueteBid[]> {
		return await this.paqueteBidModel.find({ status: { $ne: 0 } }).sort({ _id: -1 });
	}

	async findOne(_id: string): Promise<PaqueteBid> {
		return await this.paqueteBidModel.findOne({ _id, status: { $ne: 0 } });
	}

	async update(id: string, paqueteBid: UpdatePaqueteBidDto): Promise<PaqueteBid> {
		paqueteBid.price = convertToFloat(paqueteBid.price);
		return await this.paqueteBidModel.findByIdAndUpdate(
			id,
			{ $set: paqueteBid },
			{ new: true }
		);
	}

	async remove(id: string): Promise<void> {
		return await this.paqueteBidModel.findByIdAndUpdate(id, { $set: { status: 0 } });
	}
}
