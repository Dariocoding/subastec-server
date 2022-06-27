import { Injectable } from '@nestjs/common';
import { Subasta } from './entities';
import { CreateSubastasDto, UpdateSubastaDto } from './dto';
import { contarMultiplos, convertToFloat } from 'src/utils';
import { SettingsService } from '../settings/settings/settings.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository, IsNull, MoreThan, FindOptionsWhere } from 'typeorm';
import { Producto } from '../productos/entities';
import { PaqueteBid } from '../settings/paquete-bids/entities/paquete-bid.entity';
import * as moment from 'moment-timezone';
import { ProductosService } from '../productos/productos.service';
import { PaqueteBidsService } from '../settings/paquete-bids/paquete-bids.service';
import { CronService } from 'src/cron/cron.service';
import { Puja } from '../puja/entities/puja.entity';
import { MailService } from 'src/mail/mail.service';
import { UsersService } from '../users/users.service';
import { AdministradoresService } from '../users/modules/administradores/administradores.service';

@Injectable()
export class SubastasService {
	constructor(
		@InjectRepository(Subasta) private subastaRepository: Repository<Subasta>,
		@InjectRepository(Producto) private productoRepository: Repository<Producto>,
		@InjectRepository(PaqueteBid) private paqueteBidRepository: Repository<PaqueteBid>,
		@InjectRepository(Puja) private pujaRepository: Repository<Puja>,
		private settingsService: SettingsService,
		private productosService: ProductosService,
		private paqueteBidService: PaqueteBidsService,
		private cronService: CronService,
		private mailService: MailService,
		private adminService: AdministradoresService,
		private usersService: UsersService
	) {}

	repository = this.subastaRepository;

	async countTotalSubastas() {
		const date = new Date();

		const req: { total: number } = await this.subastaRepository.query(`
			SELECT count(*) AS total
			FROM subastas 
			WHERE MONTH(date_created) = '${date.getMonth() + 1}'
		`);
		return req[0].total;
	}

	async getSubasta(idsubasta: number) {
		const subasta = await this.subastaRepository.findOne({
			where: { idsubasta, status: Not(0) },
		});
		if (subasta.productoid) {
			subasta.producto = await this.productosService.findById(subasta.productoid);
			if (!subasta.titulo) subasta.titulo = subasta.producto.nombre;
		}

		if (subasta.paqueteBidId) {
			subasta.paqueteBid = await this.paqueteBidService.findOne(
				subasta.paqueteBidId
			);
			if (!subasta.titulo) {
				subasta.titulo = `Paquete de bids de: ${subasta.paqueteBid.cantidadBids}`;
			}
		}

		if (subasta.winnerUserId) {
			subasta.winnerUser = await this.usersService.findById(subasta.winnerUserId);
		}

		return subasta;
	}

	async getSubastas(where: FindOptionsWhere<Subasta> = {}, take?: number) {
		let query = this.subastaRepository
			.createQueryBuilder('subasta')
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
			])
			.where({ status: Not(0), ...where })
			.orderBy('subasta.idsubasta', 'DESC');
		if (take) query = query.take(take);
		const subastas = await query.getMany();

		return Promise.all(subastas.map(async s => this.setTituloSubasta(s)));
	}

	async setTituloSubasta(s: Subasta) {
		if (s.titulo) return s;
		if (s.productoid) {
			const producto = await this.productoRepository.findOne({
				where: { idproducto: s.productoid },
				select: [
					'categoriaid',
					'nombre',
					'date_created',
					'marca',
					'precio',
					'ruta',
					'status',
				],
			});
			s.titulo = producto.nombre;
			s.producto = producto;
			return s;
		}
		if (s.paqueteBidId) {
			const paqueteBid = await this.paqueteBidRepository.findOne({
				where: { idpaquete: s.paqueteBidId },
				select: ['cantidadBids', 'bonus', 'background'],
			});
			s.titulo = 'Paquete Bids de: ' + paqueteBid.cantidadBids;
			s.paqueteBid = paqueteBid;
			return s;
		}
	}

	async getLastFourtSubastas() {
		/* 		
			const subastasDestacadas = await this.subastasDestacadasService.findAll();
		if (subastasDestacadas.length) {
			const idsubastas = subastasDestacadas.map(s => s.subastaid);
			subastas = await this.subastaRepository.findByIds(idsubastas, {
				select: ['titulo', 'idsubasta', 'fotoSubasta', 'productoid'],
				order: { idsubasta: 'DESC' },
			});
		} else {

		} */

		const subastas = await this.subastaRepository.find({
			where: {
				status: Not(0),
				paqueteBidId: IsNull(),
			},
			select: ['titulo', 'idsubasta', 'fotoSubasta', 'productoid'],
			order: { idsubasta: 'DESC' },
			take: 4,
		});

		return Promise.all(subastas.map(async s => this.setTituloSubasta(s)));
	}

	async getSubastasHome(page: number, limit: number) {
		const date = moment().toDate();
		const [take, skip] = await this.#getPagination(page, limit);
		const [subastas, totalSubastas] = await this.subastaRepository.findAndCount({
			where: {
				status: Not(0),
				fechaFinalizacion: MoreThan(date),
			},
			order: { fechaInicio: 'ASC' },
			take,
			skip,
		});

		const subastasMap = await Promise.all(
			subastas.map(async s => {
				if (s.productoid) {
					s.producto = await this.productoRepository.findOne({
						where: { idproducto: s.productoid },
						select: ['nombre', 'marca', 'date_created', 'ruta'],
					});
					s.titulo = s.titulo ? s.titulo : s.producto.nombre;
				}
				if (s.paqueteBidId) {
					s.paqueteBid = await this.paqueteBidRepository.findOne({
						where: { idpaquete: s.paqueteBidId },
					});
					s.titulo = s.titulo
						? s.titulo
						: 'Paquete Bids de: ' + s.paqueteBid.cantidadBids;
				}
				return s;
			})
		);

		return { totalSubastas, subastas: subastasMap };
	}

	async getSubastasByCategoriaId(categoriaid: number, page: number, limit: number) {
		const date = moment().toDate();
		const [take, skip] = await this.#getPagination(page, limit);
		const [subastas, totalSubastas] = await this.subastaRepository.findAndCount({
			where: {
				status: Not(0),
				producto: { categoriaid },
				fechaFinalizacion: MoreThan(date),
			},
			order: { fechaInicio: 'ASC' },
			relations: ['producto'],
			take,
			skip,
		});
		return {
			totalSubastas,
			subastas: await Promise.all(
				subastas.map(async s => this.setTituloSubasta(s))
			),
		};
	}

	async getSubastasByPaqueteBids(page: number, limit: number) {
		const date = moment().toDate();
		const [take, skip] = await this.#getPagination(page, limit);
		const [subastas, totalSubastas] = await this.subastaRepository.findAndCount({
			where: {
				status: Not(0),
				productoid: IsNull(),
				paqueteBidId: Not(IsNull()),
				fechaFinalizacion: MoreThan(date),
			},
			order: { fechaInicio: 'ASC' },
			relations: ['paqueteBid'],
			take,
			skip,
		});
		return {
			subastas: await Promise.all(
				subastas.map(async s => this.setTituloSubasta(s))
			),
			totalSubastas,
		};
	}

	async #getPagination(page: number, limit: number) {
		const config = await this.settingsService.getConfiguracion();
		let take = limit;
		let skip: number;
		if (page === 1) {
			take = config.cantidad_subastas_inicio;
			skip = 0;
		} else skip = config.cantidad_subastas_inicio + (page - 1) * take - take;
		return [take, skip];
	}

	async agregarSubasta(data: CreateSubastasDto) {
		data = this.updateData(data);
		const subasta = await this.subastaRepository.save(data);
		this.startCronSubasta(subasta);
		return this.getSubasta(subasta.idsubasta);
	}

	async editarSubasta(idsubasta: number, data: UpdateSubastaDto) {
		data = this.updateData(data);
		const subasta = await this.subastaRepository.save({ idsubasta, ...data });

		this.cronService.stopCronJob(`subasta - ${subasta.idsubasta}`);
		this.startCronSubasta(subasta);
		return this.getSubasta(subasta.idsubasta);
	}

	private updateData(data: CreateSubastasDto) {
		data.preciominimo = convertToFloat(data.preciominimo);
		data.costopuja = +data.costopuja;
		data.productoid = +data.productoid;
		data.paqueteBidId = +data.paqueteBidId;
		if (data.paqueteBidId) data.productoid = null;
		if (data.productoid) data.paqueteBidId = null;
		return data;
	}

	async eliminarSubasta(idsubasta: number) {
		await this.subastaRepository.update({ idsubasta }, { status: 0 });
	}

	startCronSubasta(subasta: Subasta) {
		this.cronService.startCronJob({
			date: subasta.fechaFinalizacion,
			fn: () => this.#onFinishCronJobSubasta(subasta),
			name: `subasta - ${subasta.idsubasta}`,
		});
	}

	async #onFinishCronJobSubasta(subasta: Subasta) {
		subasta = await this.getSubasta(subasta.idsubasta);
		type PujaSelect = Array<{ puja_userid: number; sumaBids: string }>;
		const pujas: PujaSelect = await this.pujaRepository
			.createQueryBuilder('puja')
			.select(['puja.userid'])
			.addSelect('SUM(puja.cantidadBids) sumaBids')
			.groupBy('puja.userid')
			.orderBy('SUM(puja.cantidadBids)', 'DESC')
			.where({ subastaid: subasta.idsubasta })
			.getRawMany();

		const devolverBidsUsuarios = async (users: PujaSelect) => {
			for (let i = 0; i < users.length; i++) {
				const { puja_userid, sumaBids } = users[i];
				const bidsParaSumar = contarMultiplos({
					multiplo: 10,
					cantidad: parseInt(sumaBids),
				});
				const bids = parseInt(sumaBids) + bidsParaSumar;
				await this.adminService.addBidsUser({ iduser: puja_userid, bids });
			}
		};

		if (!pujas.length) return;
		if (subasta.preciominimo <= subasta.preciosubasta) {
			const usuarioGanador = pujas[0];
			await this.subastaRepository.update(subasta.idsubasta, {
				winnerUserId: usuarioGanador.puja_userid,
			});
			const usuariosPerdedores = pujas.filter(
				p => p.puja_userid !== usuarioGanador.puja_userid
			);

			await devolverBidsUsuarios(usuariosPerdedores);

			if (subasta?.producto?.codigoTarjeta) {
				const user = await this.usersService.findById(
					usuarioGanador.puja_userid
				);
				await this.mailService.enviarCorreoCodigoTarjetaSubasta(
					subasta.producto,
					user,
					subasta.fotoSubasta
				);
			}

			if (subasta.paqueteBid) {
				let bids = subasta.paqueteBid.cantidadBids;
				if (subasta.paqueteBid.bonus) bids += subasta.paqueteBid.bonus;
				await this.adminService.addBidsUser({
					iduser: usuarioGanador.puja_userid,
					statusAddRemoveBids: 'add',
					bids,
				});
			}
		} else await devolverBidsUsuarios(pujas);
	}
}
