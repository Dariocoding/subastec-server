import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { SubastasReclamosService } from './subastas-reclamos.service';
import { CreateSubastasReclamoDto } from './dto/create-subastas-reclamo.dto';
import { UpdateSubastasReclamoDto } from './dto/update-subastas-reclamo.dto';

@Controller('subastas-reclamos')
export class SubastasReclamosController {
	constructor(private readonly subastasReclamosService: SubastasReclamosService) {}

	@Post()
	create(@Body() createSubastasReclamoDto: CreateSubastasReclamoDto) {
		return this.subastasReclamosService.create(createSubastasReclamoDto);
	}

	@Get()
	findAll() {
		return this.subastasReclamosService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.subastasReclamosService.findOne(+id);
	}

	@Put(':id')
	update(
		@Param('id') id: string,
		@Body() updateSubastasReclamoDto: UpdateSubastasReclamoDto
	) {
		return this.subastasReclamosService.update(+id, updateSubastasReclamoDto);
	}
}
