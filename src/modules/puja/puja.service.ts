import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Favorito } from '../favoritos/entities';
import { Subasta } from '../subastas/entities';
import { User } from '../users/entities';
import { AdministradoresService } from '../users/modules/administradores/administradores.service';
import { UsersService } from '../users/users.service';
import { PujaDto } from './dto/puja.dto';
import { Puja } from './entities/puja.entity';

@Injectable()
export class PujaService {
	constructor(
		@InjectRepository(Puja) private pujaRepository: Repository<Puja>,
		@InjectRepository(Subasta) private subastaRepository: Repository<Subasta>,
		@InjectRepository(Favorito) private favoritoRepository: Repository<Favorito>,
		@InjectRepository(User) private userRepository: Repository<User>,
		private usersService: UsersService,
		private administradoresService: AdministradoresService
	) {}

	async create(userid: number, dto: PujaDto) {
		await this.pujaRepository.save({ userid, ...dto });
		const subasta = await this.subastaRepository.findOne({
			where: { idsubasta: dto.subastaid },
		});
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
		const { bids } = await this.usersService.findById(userid);
		return bids;
	}

	async findAll(opts: FindManyOptions<Puja>) {
		const pujas = await this.pujaRepository.find({
			...opts,
			order: { idpuja: 'DESC' },
		});

		return Promise.all(
			pujas.map(async p => {
				p.user = await this.userRepository.findOne({
					where: { iduser: p.userid },
					select: ['username'],
				});
				return p;
			})
		);
	}
}
