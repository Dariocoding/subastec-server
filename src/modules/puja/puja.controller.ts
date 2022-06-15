import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PujaService } from './puja.service';
import { PujaDto } from './dto/puja.dto';
import { GetCurrentUserId, Public } from '../auth/common/decorators';

@Controller('puja')
export class PujaController {
	constructor(private readonly pujaService: PujaService) {}

	@Post()
	async create(@Body() createPujaDto: PujaDto, @GetCurrentUserId() currentUserId: number) {
		const bidsRestantes = await this.pujaService.create(currentUserId, createPujaDto);
		return { msg: 'Has pujado exitosamente!', bidsRestantes };
	}

	@Get('findBySubastaId/:subastaid')
	@Public()
	findBySubastaId(@Param('subastaid') subastaid: string) {
		return this.pujaService.findAll({ where: { subastaid: +subastaid }, take: 10 });
	}

	@Get('findAllBySubastaId/:subastaid')
	@Public()
	findAllBySubastaId(@Param('subastaid') subastaid: string) {
		return this.pujaService.findAll({ where: { subastaid: +subastaid } });
	}

	@Get('findByUser')
	findByUserId(@GetCurrentUserId() userid: number) {
		return this.pujaService.findAll({ where: { userid } });
	}
}
