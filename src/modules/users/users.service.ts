import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.interface';
import { UserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { hexTestMongoObjId } from '../../helpers';
import { NotFoundException } from '@nestjs/common';
import { deleteFile } from '../../helpers';
@Injectable()
export class UsersService {
	constructor(@InjectModel('User') private userModel: Model<User>) {}

	async verifyAdmin(userId: string, throwError: boolean = true): Promise<User> {
		const user = await this.findById(userId);
		const isAdmin = user.rolid.toString() === process.env.RADMIN;
		if (!isAdmin && throwError) throw new ForbiddenException('Acceso denegado');
		return user;
	}

	async findById(id: string, selectMore: Object = {}): Promise<User> {
		const usuario = await this.userModel.aggregate([
			{
				$match: {
					_id: hexTestMongoObjId(id),
					status: { $ne: 0 },
				},
			},
			...this.getUnwindRol(selectMore),
			{ $limit: 1 },
		]);
		if (!usuario.length) throw new NotFoundException('Este usuario no existe');
		return usuario[0];
	}

	// RECUPERAR CONTRASEÑA VALIDACIÓN
	async findByCorreoAndToken(
		email_user: string,
		token: string,
		userId?: string
	): Promise<User> {
		const validarPorUserId = userId ? { _id: hexTestMongoObjId(userId) } : {};
		const usuario = await this.userModel.aggregate([
			{
				$match: {
					email_user,
					token,
					status: { $ne: 0 },
					...validarPorUserId,
				},
			},
			...this.getUnwindRol(),
			{ $limit: 1 },
		]);

		if (!usuario.length) throw new NotFoundException('Este usuario no existe');
		return usuario[0];
	}

	async findByUsername(username: string): Promise<User> {
		return await this.userModel.findOne({
			username,
			status: { $ne: 0 },
		});
	}

	async findByEmail(email_user: string): Promise<User> {
		return await this.userModel.findOne({
			email_user,
			status: { $ne: 0 },
		});
	}

	async findByGoogleID(googleID: string): Promise<User> {
		return await this.userModel.findOne({
			googleID,
			status: { $ne: 0 },
		});
	}

	async findByFacebookID(facebookID: string): Promise<User> {
		return await this.userModel.findOne({
			facebookID,
			status: { $ne: 0 },
		});
	}

	async createUser(user: UserDto): Promise<User> {
		const userUsername = await this.findByUsername(user.username);
		if (userUsername) throw new BadRequestException('Este nombre de usuario ya existe');

		const userCorreo = await this.findByEmail(user.email_user);
		if (userCorreo) throw new BadRequestException('Este correo ya existe');

		if (user.password) user.password = await this.hashData(user.password);

		const newUser = new this.userModel(user);
		await newUser.save();
		return newUser;
	}

	async updateRtHash(_id: string, hashedRt: string | null) {
		return await this.userModel.updateOne({ _id }, { $set: { hashedRt } });
	}

	async updateUser(userId: string, user: UserDto): Promise<User> {
		if (user.username) {
			const userUsername = await this.userModel.findOne({
				_id: { $ne: userId },
				username: user.username,
				status: { $ne: 0 },
			});

			if (userUsername)
				throw new BadRequestException('Este nombre de usuario ya existe');
		}

		const userCorreo = await this.userModel.findOne({
			_id: { $ne: userId },
			email_user: user.email_user,
			status: { $ne: 0 },
		});

		if (userCorreo) throw new BadRequestException('Este correo ya existe');
		await this.userModel.updateOne({ _id: userId }, user);
		return await this.findById(userId);
	}

	async updatePassword(_id: string, password: string) {
		const newPassword = await this.hashData(password);
		return await this.userModel.updateOne({ _id }, { $set: { password: newPassword } });
	}

	async updateTokenUser(_id: string, token: string) {
		return await this.userModel.updateOne({ _id }, { $set: { token } });
	}

	async updateBidsUser(_id: string, bids: number) {
		return await this.userModel.updateOne({ _id }, { $set: { bids } });
	}

	async updateGoogleID(_id: string, googleID: string) {
		return await this.userModel.updateOne({ _id }, { $set: { googleID } });
	}

	async updateFacebookID(_id: string, facebookID: string) {
		return await this.userModel.updateOne({ _id }, { $set: { facebookID } });
	}

	async changeFotoPerfil(_id: string, filename: string) {
		return await this.userModel.updateOne({ _id }, { $set: { fotoperfil: filename } });
	}

	async eliminarUsuario(_id: string) {
		return await this.userModel.updateOne({ _id }, { $set: { status: 0 } });
	}

	async revisarYEliminarFotoPerfil(_id: string) {
		const user = await this.findById(_id);
		if (user.fotoperfil && user.fotoperfil !== '') deleteFile(user.fotoperfil);
	}

	async hashData(data: string): Promise<string> {
		const salt = await bcrypt.genSaltSync(10);
		return await bcrypt.hash(data, salt);
	}

	async compareFotoPerfilUser(fotoperfil: string) {
		return await this.userModel.findOne({ fotoperfil });
	}

	getUnwindRol(selectMore: Object = {}) {
		return [
			{
				$lookup: {
					from: 'roles',
					localField: 'rolid',
					foreignField: '_id',
					as: 'roles',
				},
			},
			{
				$unwind: {
					path: '$roles',
					preserveNullAndEmptyArrays: true,
				},
			},

			{
				$project: {
					rolid: 1,
					nombres: 1,
					email_user: 1,
					apellidos: 1,
					username: 1,
					telefono: 1,
					nombrerol: '$roles.nombrerol',
					fotoperfil: 1,
					status: 1,
					bids: 1,
					facebookID: 1,
					googleID: 1,
					datecreated: {
						$dateToString: {
							format: '%d-%m-%Y',
							date: '$datecreated',
						},
					},
					...selectMore,
				},
			},
		];
	}
}
