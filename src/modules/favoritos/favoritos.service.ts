import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { FavoritoDto } from './dto/favorito.dto';
import { Favorito } from './entities';

@Injectable()
export class FavoritosService {
	constructor(@InjectRepository(Favorito) private favoritoRepository: Repository<Favorito>) {}

	async create(userid: number, dto: FavoritoDto) {
		await this.favoritoRepository.save({ userid, subastaid: dto.subastaid });
	}

	findByUserId(userid: number) {
		return this.favoritoRepository.find({
			where: { userid, subasta: { idsubasta: Not(0) } },
		});
	}

	async remove(userid: number, subastaid: number) {
		await this.favoritoRepository.delete({ subastaid });
	}
}
