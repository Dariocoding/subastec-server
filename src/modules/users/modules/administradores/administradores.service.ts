import { Injectable } from '@nestjs/common';
import { User } from '../../entities';
import { UsersService } from '../../users.service';
import { BidsUserDto } from '../../dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
@Injectable()
export class AdministradoresService {
	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
		private usersService: UsersService
	) {}

	getUsuariosByRol(rolid: number) {
		return this.userRepository.find({
			where: { status: Not(0), rolid },
			order: { iduser: 'DESC' },
			relations: ['rol'],
		});
	}

	getUsuarioByRolAndId(iduser: number, rolid: number) {
		return this.userRepository.findOne({
			where: { iduser, rolid, status: Not(0) },
			relations: ['rol'],
		});
	}

	async removeBidsUser({ iduser, bids }: BidsUserDto) {
		const user = await this.usersService.findById(+iduser);
		let newBids: number;
		const operacion = user.bids - bids;
		operacion <= 0 ? (newBids = 0) : (newBids = operacion);
		await this.usersService.updateBidsUser(+iduser, newBids);
		return newBids;
	}

	async addBidsUser({ iduser, bids }: BidsUserDto) {
		const user = await this.usersService.findById(+iduser);
		const newBids = user.bids + bids;
		await this.usersService.updateBidsUser(+iduser, newBids);
		return newBids;
	}
}
