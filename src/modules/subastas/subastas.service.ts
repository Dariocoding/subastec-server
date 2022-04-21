import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subasta } from './interface';
import { SubastaDto } from './dto';
@Injectable()
export class SubastasService {
	constructor(@InjectModel('Subasta') private subastaModel: Model<Subasta>) {}

	async getSubasta(_id: string): Promise<Subasta> {
		return await this.subastaModel.findOne({ _id, status: { $ne: 0 } });
	}

	async getSubastas(): Promise<Subasta[]> {
		return await this.subastaModel.find({ status: { $ne: 0 } }).sort({ _id: -1 });
	}

	async agregarSubasta(subasta: SubastaDto): Promise<Subasta> {
		const newSubasta = new this.subastaModel(subasta);
		return await newSubasta.save();
	}

	async editarSubasta(subasta: SubastaDto): Promise<Subasta> {
		return await this.subastaModel.findByIdAndUpdate(subasta._id, subasta, {
			new: true,
		});
	}

	async eliminarSubasta(subastaID: string): Promise<void> {
		await this.subastaModel.findByIdAndUpdate(subastaID, { $set: { status: 0 } });
	}
}
