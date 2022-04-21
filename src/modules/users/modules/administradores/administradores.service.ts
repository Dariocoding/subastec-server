import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../user.interface';
import { Model } from 'mongoose';
import { hexTestMongoObjId } from 'src/helpers';
import { UsersService } from '../../users.service';
import { BidsUserDto } from '../../dto';
@Injectable()
export class AdministradoresService {
	constructor(
		@InjectModel('User') private userModel: Model<User>,
		private usersService: UsersService
	) {}

	async getUsuariosByRol(rolid: string): Promise<User[]> {
		return await this.userModel
			.aggregate([
				{ $match: { rolid: hexTestMongoObjId(rolid), status: { $ne: 0 } } },
				...this.usersService.getUnwindRol(),
			])
			.sort({ _id: -1 });
	}

	async getUsuarioByRolAndId(userId: string, rolid: string) {
		const usuario = await this.userModel.aggregate([
			{
				$match: {
					_id: hexTestMongoObjId(userId),
					rolid: hexTestMongoObjId(rolid),
					status: { $ne: 0 },
				},
			},
			...this.usersService.getUnwindRol(),
			{ $limit: 1 },
		]);
		if (!usuario.length) throw new NotFoundException('Este usuario no existe');
		return usuario[0];
	}

	async removeBidsUser({ _id: userId, bids }: BidsUserDto): Promise<number> {
		const user = await this.usersService.findById(userId);
		let newBids: number;
		const operacion = user.bids - bids;
		operacion <= 0 ? (newBids = 0) : (newBids = operacion);
		await this.usersService.updateBidsUser(userId, newBids);
		return newBids;
	}

	async addBidsUser({ _id: userId, bids }: BidsUserDto): Promise<number> {
		const user = await this.usersService.findById(userId);
		const newBids = user.bids + bids;
		await this.usersService.updateBidsUser(userId, newBids);
		return newBids;
	}
}
