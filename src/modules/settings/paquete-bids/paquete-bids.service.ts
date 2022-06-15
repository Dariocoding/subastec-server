import { Injectable } from '@nestjs/common';
import { CreatePaqueteBidDto } from './dto/create-paquete-bid.dto';
import { UpdatePaqueteBidDto } from './dto/update-paquete-bid.dto';
import { PaqueteBid } from './entities/paquete-bid.entity';
import { convertToFloat } from 'src/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

@Injectable()
export class PaqueteBidsService {
	constructor(
		@InjectRepository(PaqueteBid) private paqueteBidRepository: Repository<PaqueteBid>
	) {}

	create(data: CreatePaqueteBidDto) {
		data.price = convertToFloat(data.price);
		data.bonus = +data.bonus;
		data.cantidadBids = +data.cantidadBids;
		return this.paqueteBidRepository.save(data);
	}

	findAll(): Promise<PaqueteBid[]> {
		return this.paqueteBidRepository.find({
			where: { status: Not(0) },
			order: { idpaquete: 'DESC' },
		});
	}

	findOne(idpaquete: number) {
		return this.paqueteBidRepository.findOne({ where: { idpaquete, status: Not(0) } });
	}

	update(idpaquete: number, data: UpdatePaqueteBidDto) {
		data.price = convertToFloat(data.price);
		data.bonus = +data.bonus;
		data.cantidadBids = +data.cantidadBids;
		return this.paqueteBidRepository.save({ idpaquete, ...data });
	}

	async remove(idpaquete: number) {
		await this.paqueteBidRepository.update({ idpaquete }, { status: 0 });
	}
}
