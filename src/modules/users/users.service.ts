import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { Invitacion, User } from './entities';
import { UserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { deleteFile } from '../../utils';
import { RADMIN } from 'src/utils/conts';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
		@InjectRepository(Invitacion) private invitacionRepository: Repository<Invitacion>
	) {}

	countByRol(rolid: number) {
		return this.userRepository.count({ where: { rolid, status: Not(0) } });
	}

	async verifyAdmin(iduser: number, throwError: boolean = true) {
		const user = await this.findById(iduser);
		const isAdmin = user.rol.idrol === RADMIN;
		if (!isAdmin && throwError) throw new ForbiddenException('Acceso denegado');
		return { user, isAdmin };
	}

	verifyAdminByRolId(rolid: number) {
		if (rolid !== RADMIN) throw new ForbiddenException('Acceso denegado');
	}

	findById(iduser: number, password = false) {
		if (password) {
			return this.userRepository
				.createQueryBuilder('user')
				.where(`user.iduser = ${iduser}`)
				.andWhere(`user.status != 0`)
				.addSelect('user.password')
				.innerJoinAndSelect('user.rol', 'rolid')
				.getOne();
		}
		return this.userRepository.findOne({
			where: { iduser, status: Not(0) },
			relations: ['rol'],
		});
	}

	// RECUPERAR CONTRASEÑA VALIDACIÓN
	findByCorreoAndToken(email_user: string, token: string, iduser?: number) {
		email_user = email_user.toLowerCase().trim();
		return this.userRepository.findOne({
			where: { iduser, status: Not(0), email_user, token },
		});
	}

	findByUsername(username: string) {
		return this.userRepository.findOne({ where: { username, status: Not(0) } });
	}

	findByEmail(email_user: string) {
		email_user = email_user.toLowerCase().trim();
		return this.userRepository
			.createQueryBuilder('user')
			.where(`user.email_user = '${email_user}'`)
			.andWhere(`user.status != 0`)
			.addSelect('user.password')
			.innerJoinAndSelect('user.rol', 'rol')
			.getOne();
	}

	findByGoogleID(googleID: string) {
		return this.userRepository.findOne({ where: { googleID, status: Not(0) } });
	}

	findByFacebookID(facebookID: string) {
		return this.userRepository.findOne({ where: { facebookID, status: Not(0) } });
	}

	async createUser(data: UserDto) {
		const userUsername = await this.findByUsername(data.username);
		if (userUsername) throw new BadRequestException('Este nombre de usuario ya existe');

		const userCorreo = await this.findByEmail(data.email_user);
		if (userCorreo) throw new BadRequestException('Este correo ya existe');

		if (data.password) data.password = await this.hashData(data.password);
		data = await this.userRepository.save(data);
		return this.findById(data.iduser);
	}

	async createUserByInvitacion(data: UserDto) {
		const newUser = await this.createUser(data);
		await this.invitacionRepository.save({
			userReferencedId: data.useridReferenced,
			userInvitedId: newUser.iduser,
		});
		return newUser;
	}

	updateRtHash(iduser: number, hashedRt: string | null) {
		return this.userRepository.save({ iduser, hashedRt });
	}

	async updateUser(iduser: number, user: UserDto) {
		if (user.username) {
			const userUsername = await this.userRepository.findOne({
				where: {
					iduser: Not(iduser),
					username: user.username,
					status: Not(0),
				},
			});

			if (userUsername)
				throw new BadRequestException('Este nombre de usuario ya existe');
		}
		const userCorreo = await this.userRepository.findOne({
			where: {
				iduser: Not(iduser),
				email_user: user.email_user.toLowerCase().trim(),
				status: Not(0),
			},
		});

		if (userCorreo) throw new BadRequestException('Este correo ya existe');
		await this.userRepository.save({ iduser, ...user });
		return this.findById(iduser);
	}

	async updatePassword(iduser: number, password: string) {
		password = await this.hashData(password);
		await this.userRepository.update({ iduser }, { password });
	}

	async updateTokenUser(iduser: number, token: string) {
		await this.userRepository.update({ iduser }, { token });
	}

	async updateBidsUser(iduser: number, bids: number) {
		await this.userRepository.update({ iduser }, { bids });
	}

	async updateGoogleID(iduser: number, googleID: string) {
		await this.userRepository.update({ iduser }, { googleID });
	}

	async updateFacebookID(iduser: number, facebookID: string) {
		await this.userRepository.update({ iduser }, { facebookID });
	}

	async changeFotoPerfil(iduser: number, image_profile: string) {
		await this.userRepository.update({ iduser }, { image_profile });
	}

	async eliminarUsuario(iduser: number) {
		await this.userRepository.update({ iduser }, { status: 0 });
	}

	async revisarYEliminarFotoPerfil(iduser: number) {
		const user = await this.findById(iduser);
		if (user.image_profile) deleteFile(user.image_profile);
	}

	async hashData(data: string) {
		const salt = bcrypt.genSaltSync(10);
		return await bcrypt.hash(data, salt);
	}

	compareFotoPerfilUser(image_profile: string) {
		return this.userRepository.findOne({ where: { image_profile } });
	}
}
