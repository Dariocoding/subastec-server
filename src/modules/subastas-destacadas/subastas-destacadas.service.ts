import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubastasDestacadaDto } from './dto/subastas-destacada.dto';
import { SubastaDestacada } from './entities/subastas-destacada.entity';

@Injectable()
export class SubastasDestacadasService {
	constructor(
		@InjectRepository(SubastaDestacada)
		private subastasDestacadasRepository: Repository<SubastaDestacada>
	) {}

	create(dto: SubastasDestacadaDto) {
		return this.subastasDestacadasRepository.save(dto);
	}

	findAll() {
		return this.subastasDestacadasRepository.find();
	}

	remove(subastaid: number) {
		return this.subastasDestacadasRepository.delete({ subastaid });
	}
}
