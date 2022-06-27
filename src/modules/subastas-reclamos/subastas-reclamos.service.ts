import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Subasta } from '../subastas/entities';
import { SubastasService } from '../subastas/subastas.service';
import { CreateSubastasReclamoDto } from './dto/create-subastas-reclamo.dto';
import { UpdateSubastasReclamoDto } from './dto/update-subastas-reclamo.dto';
import { SubastasReclamos } from './entities/subastas-reclamo.entity';

@Injectable()
export class SubastasReclamosService {
	constructor(
		@InjectRepository(SubastasReclamos)
		private subastaReclamosRepository: Repository<SubastasReclamos>,
		@InjectRepository(Subasta)
		private subastaRepository: Repository<Subasta>,
		private subastaService: SubastasService
	) {}

	create(createSubastasReclamoDto: CreateSubastasReclamoDto) {
		return this.subastaReclamosRepository.save(createSubastasReclamoDto);
	}

	async findAll() {
		const reclamos = await this.subastaReclamosRepository.find();
		const idsubastas = reclamos.map(r => r.subastaid);
		return this.subastaRepository.find({ where: { idsubasta: In(idsubastas) } });
	}

	async findOne(id: number) {
		const reclamo = await this.subastaReclamosRepository.findOne({
			where: { subastaid: id },
		});
		if (reclamo) {
			reclamo.subasta = await this.subastaService.getSubasta(reclamo.subastaid);
		}

		return reclamo;
	}

	update(id: number, updateSubastasReclamoDto: UpdateSubastasReclamoDto) {
		return this.subastaReclamosRepository.update(id, updateSubastasReclamoDto);
	}
}
