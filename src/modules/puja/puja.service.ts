import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { Favorito } from '../favoritos/entities';
import { Subasta } from '../subastas/entities';
import { SubastasService } from '../subastas/subastas.service';
import { User } from '../users/entities';
import { AdministradoresService } from '../users/modules/administradores/administradores.service';
import { UsersService } from '../users/users.service';
import { PujaDto } from './dto/puja.dto';
import { Puja } from './entities/puja.entity';
import * as moment from 'moment-timezone';

@Injectable()
export class PujaService {
	constructor(
		@InjectRepository(Puja) private pujaRepository: Repository<Puja>,
		@InjectRepository(Subasta) private subastaRepository: Repository<Subasta>,
		@InjectRepository(Favorito) private favoritoRepository: Repository<Favorito>,
		@InjectRepository(User) private userRepository: Repository<User>,
		private usersService: UsersService,
		private administradoresService: AdministradoresService,
		private subastaService: SubastasService
	) {}

	async create(userid: number, dto: PujaDto) {
		const usuario = await this.usersService.findById(userid);

		if (usuario.bids < dto.cantidadBids)
			throw new BadRequestException('Usuario sin bids');

		const subasta = await this.subastaRepository.findOne({
			where: { idsubasta: dto.subastaid },
		});

		// Verificamos si la subasta ya acabo

		console.log(
			moment().isAfter(subasta.fechaFinalizacion),
			moment().toDate(),
			subasta.fechaFinalizacion
		);
		if (moment().isAfter(subasta.fechaFinalizacion)) {
			throw new BadRequestException('Subasta finalizada');
		}

		const favorito = await this.favoritoRepository.findOne({
			where: { userid, subastaid: dto.subastaid },
		});

		if (!favorito) {
			await this.favoritoRepository.insert({ userid, subastaid: dto.subastaid });
		}
		const formula = (dto.costopuja / 100) * dto.cantidadBids;
		const preciosubasta =
			(subasta.preciosubasta ? subasta.preciosubasta : 0.01) + formula;

		await this.subastaRepository.update(dto.subastaid, { preciosubasta });
		await this.administradoresService.removeBidsUser({
			iduser: userid,
			bids: dto.cantidadBids,
		});
		const cantidadBids = usuario.bids - dto.cantidadBids;
		const puja = await this.pujaRepository.save({ userid, ...dto });
		return {
			cantidadBids,
			puja: {
				...puja,
				user: { nombres: usuario.nombres, apellidos: usuario.apellidos },
			},
			preciosubasta,
		};
	}

	findAll(opts: FindManyOptions<Puja>) {
		let query = this.pujaRepository
			.createQueryBuilder('puja')
			.innerJoinAndSelect('puja.user', 'user')
			.select([
				'puja.idpuja',
				'user.nombres',
				'user.apellidos',
				'puja.modalidad',
				'puja.costopuja',
				'puja.cantidadBids',
				'puja.subastaid',
				'puja.userid',
			])
			.where(opts.where)
			.orderBy('puja.idpuja', 'DESC');

		if (opts.take) query = query.take(opts.take);

		return query.getMany();
	}

	async findPujasGroupBySubastas(where: FindOptionsWhere<Puja>) {
		const pujas = await this.pujaRepository
			.createQueryBuilder('puja')
			.innerJoinAndSelect('puja.subasta', 'subasta')
			.groupBy('puja.subastaid')
			.where(where)
			.getMany();
		const subastas = pujas.map(p => p.subasta);
		return Promise.all(
			subastas.map(async s => this.subastaService.setTituloSubasta(s))
		);
	}
}
