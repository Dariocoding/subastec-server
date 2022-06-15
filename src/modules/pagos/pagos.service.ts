import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PaqueteBidsService } from '../settings/paquete-bids/paquete-bids.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Pago } from './entities/pago.entity';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { CreatePagoDto } from './dto/create-pago.dto';
import { Invitacion } from '../users/entities';

@Injectable()
export class PagosService {
	constructor(
		@InjectRepository(Pago)
		private pagoRepository: Repository<Pago>,
		@InjectRepository(Invitacion) private invitacionRepository: Repository<Invitacion>,
		private usersService: UsersService,
		private paqueteBidsService: PaqueteBidsService
	) {}

	async countTotalPagos() {
		const date = new Date();

		const req: { total: number } = await this.pagoRepository.query(`
			SELECT count(*) AS total
			FROM pagos 
			WHERE MONTH(date_created) = '${date.getMonth() + 1}'
		`);
		return req[0].total;
	}

	async create(userid: number, data: CreatePagoDto) {
		const paqueteBid = await this.paqueteBidsService.findOne(data.paqueteBidId);
		const cantidadBidsTotal = paqueteBid.bonus + paqueteBid.cantidadBids;
		await this.usersService.updateBidsUser(userid, cantidadBidsTotal);
		await this.pagoRepository.save({
			paqueteBidId: data.paqueteBidId,
			amount: data.amount,
			reference: data.reference,
			transactionId: data.transactionId,
			transactionStatus: data.transactionStatus,
			cantidadBidsTotal,
			userid,
		});
	}

	findAll(userid?: number) {
		const where = userid ? { userid } : {};
		return this.pagoRepository.find({
			where,
			relations: ['user'],
			order: { idpago: 'DESC' },
		});
	}

	findOne(userid?: number, idpago?: number) {
		const where: FindOptionsWhere<Pago> = { idpago, userid };
		return this.pagoRepository.findOne({ where, relations: ['user'] });
	}
}
