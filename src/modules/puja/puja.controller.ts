import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PujaService } from './puja.service';
import { PujaDto } from './dto/puja.dto';
import { Public } from '../auth/common/decorators';
import { FindOptionsWhere } from 'typeorm';
import { Puja } from './entities/puja.entity';

@Controller('puja')
export class PujaController {
	constructor(private readonly pujaService: PujaService) {}

	@Post(':userid')
	@Public()
	async create(@Body() createPujaDto: PujaDto, @Param('userid') userid: string) {
		const data = await this.pujaService.create(+userid, createPujaDto);
		return { msg: 'Has pujado exitosamente!', ...data };
	}

	@Get()
	@Public()
	findPujas(
		@Query('userid') userid: string,
		@Query('subastaid') subastaid: string,
		@Query('take') take: number
	) {
		const where: FindOptionsWhere<Puja> = {};
		if (userid) where.userid = +userid;
		if (subastaid) where.subastaid = +subastaid;
		return this.pujaService.findAll({ where, take });
	}

	@Get('findSubastasGroup')
	findSubastasGroup(
		@Query('userid') userid: string,
		@Query('winnerUserId') winnerUserId: string
	) {
		const where: FindOptionsWhere<Puja> = {};
		if (userid) where.userid = +userid;
		if (winnerUserId) {
			where.subasta = {
				winnerUserId: +winnerUserId,
			};
		}

		return this.pujaService.findPujasGroupBySubastas(where);
	}
}
