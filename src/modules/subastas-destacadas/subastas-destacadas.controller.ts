import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { SubastasDestacadasService } from './subastas-destacadas.service';
import { SubastasDestacadaDto } from './dto/subastas-destacada.dto';

@Controller('subastas-destacadas')
export class SubastasDestacadasController {
	constructor(private readonly subastasDestacadasService: SubastasDestacadasService) {}

	@Post()
	create(@Body() dto: SubastasDestacadaDto) {
		return this.subastasDestacadasService.create(dto);
	}

	@Get()
	findAll() {
		return this.subastasDestacadasService.findAll();
	}

	@Get('getTenSubastasDestacadas')
	getTenSubastasDestacadas() {
		return this.subastasDestacadasService.getTenSubastasDestacadas();
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.subastasDestacadasService.remove(+id);
	}
}
