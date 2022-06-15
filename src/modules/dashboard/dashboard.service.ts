import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getDaysInMonth, MESES } from 'src/utils';
import { Connection, Repository } from 'typeorm';
import { Puja } from '../puja/entities/puja.entity';
import { Subasta } from '../subastas/entities';
import { SubastasService } from '../subastas/subastas.service';
const moment = require('moment-timezone');
@Injectable()
export class DashboardService {
	constructor(
		@InjectRepository(Subasta) private subastaRepository: Repository<Subasta>,
		@InjectRepository(Puja) private pujaRepository: Repository<Puja>,
		private subastaService: SubastasService,
		private connection: Connection
	) {}

	async findPaquetesBidPagoMes(month: number, year: number) {
		const meses = MESES();
		const pagos = await this.connection.query(`SELECT pqb.idpaquete, 
					pqb.cantidad_bids AS cantidad_bids ,COUNT(pqb.idpaquete) AS cantidad,
					SUM(p.amount) AS total FROM pagos p 
				INNER JOIN paquete_bids pqb
				ON p.paquete_bid_id  = pqb.idpaquete
				WHERE MONTH(p.date_created) = ${month}
				AND YEAR(p.date_created) = ${year} 
				GROUP BY p.paquete_bid_id`);
		return { year, mes: meses[month - 1], paquetespago: pagos };
	}

	async findTopTenSubastasMasPujadas() {
		const pujas = await this.pujaRepository
			.createQueryBuilder('puja')
			.innerJoinAndSelect('puja.subasta', 'subasta')
			.select([
				'puja.idpuja',
				'subasta.titulo',
				'subasta.idsubasta',
				'subasta.productoid',
				'subasta.paqueteBidId',
				'subasta.fechaInicio',
				'subasta.fechaFinalizacion',
				'subasta.preciosubasta',
			])
			.loadRelationCountAndMap('subasta.totalPujas', 'subasta.pujas')
			.groupBy('puja.subastaid')
			.limit(10)
			.orderBy('COUNT(puja.idpuja)', 'DESC')
			.getMany();

		const subastas = await Promise.all(
			pujas.map(async p => this.subastaService.setTituloSubasta(p.subasta))
		);

		return subastas;
	}

	async findVentasMes(month: number, year: number) {
		const dias = getDaysInMonth(year, month);
		let totalVentasMes = 0;
		let n_dia = 1;
		let arrVentasMes = [];

		for (let i = 0; i < dias; i++) {
			const date = new Date(year, month - 1, n_dia);
			const fechaVenta = moment(date).format('YYYY-MM-DD');
			const pagoDia = await this.connection.query(`
                SELECT count(idpago) AS cantidad, 
                SUM(amount / 100) AS total
                FROM pagos 
                WHERE DATE(date_created) = '${fechaVenta}'
            `);

			pagoDia[0].dia = n_dia;
			pagoDia[0].total = !pagoDia[0].total ? 0 : pagoDia[0].total;
			totalVentasMes += pagoDia[0].total;
			arrVentasMes.push(pagoDia[0]);
			n_dia++;
		}
		const meses = MESES();

		return {
			year,
			mes: meses[month - 1],
			total: totalVentasMes.toFixed(2),
			ventas: arrVentasMes,
		};
	}

	async findVentasYear(year: number) {
		let arrMVentas = [];
		for (let i = 1; i <= 12; i++) {
			const arrData = { no_mes: i, venta: 0 };
			const request = await this.connection.query(`
                    SELECT SUM(amount / 100) AS venta
                FROM pagos
                WHERE MONTH(date_created) = ${i} AND YEAR(date_created) = ${year} 
                GROUP BY MONTH(date_created)
            `);
			if (request[0]) arrData.venta = request[0].venta;
			arrMVentas.push(arrData);
		}

		return { year, ventas: arrMVentas };
	}
}
