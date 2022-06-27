import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, IsNull, Not, Repository } from 'typeorm';
import { Producto } from '../productos/entities';
import { Subasta } from '../subastas/entities';
import { SubastasService } from '../subastas/subastas.service';
import { UsersService } from '../users/users.service';
import { SubastasDestacadaDto } from './dto/subastas-destacada.dto';
import { SubastaDestacada } from './entities/subastas-destacada.entity';

@Injectable()
export class SubastasDestacadasService {
	constructor(
		@InjectRepository(SubastaDestacada)
		private subastasDestacadasRepository: Repository<SubastaDestacada>,
		@InjectRepository(Producto)
		private productoRepository: Repository<Producto>,
		private subastasService: SubastasService,
		private usersService: UsersService
	) {}

	subastasRepository = this.subastasService.repository;

	create(dto: SubastasDestacadaDto) {
		return this.subastasDestacadasRepository.save(dto);
	}

	findAll() {
		return this.subastasDestacadasRepository.find();
	}

	async getTenSubastasDestacadas() {
		const SubastasDestacadas = await this.findAll();
		let where: FindOptionsWhere<Subasta>;
		let query = this.subastasRepository
			.createQueryBuilder('subasta')
			.leftJoinAndSelect('subasta.winnerUser', 'winnerUser')
			.select([
				'subasta.idsubasta',
				'subasta.titulo',
				'subasta.fechaInicio',
				'subasta.fechaFinalizacion',
				'subasta.costopuja',
				'subasta.preciominimo',
				'subasta.date_created',
				'subasta.productoid',
				'subasta.paqueteBidId',
				'subasta.fotoSubasta',
				'subasta.preciosubasta',
				'subasta.winnerUserId',
				'winnerUser.nombres',
			])
			.orderBy('subasta.idsubasta', 'DESC');
		if (SubastasDestacadas.length) {
			const idSubastas = SubastasDestacadas.map(s => s.subastaid);
			where = { status: Not(0), idsubasta: In(idSubastas) };
		} else {
			where = {
				status: Not(0),
				winnerUserId: Not(IsNull()),
				paqueteBidId: IsNull(),
			};
			query = query.take(10);
		}

		const subastas = await query.where(where).getMany();
		return Promise.all(
			subastas.map(async s => {
				s.winnerUser = {};
				s.winnerUser.nombres = (
					await this.usersService.findById(s.winnerUserId)
				).nombres;
				if (!s.titulo)
					s.titulo = (
						await this.productoRepository.findOne({
							where: { idproducto: s.productoid },
							select: ['nombre'],
						})
					).nombre;
				return s;
			})
		);
	}

	remove(subastaid: number) {
		return this.subastasDestacadasRepository.delete({ subastaid });
	}
}
