import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
} from '@nestjs/common';
import { UsersService } from '../../users.service';
import { GetCurrentUserId } from 'src/modules/auth/common/decorators';
import { UserDto } from '../../dto';
import { User } from '../../user.interface';
import { AdministradoresService } from './administradores.service';
import { PasswordDto, BidsUserDto } from '../../dto/';
@Controller('administradores')
export class AdministradoresController {
	constructor(
		private usersService: UsersService,
		private administradoresService: AdministradoresService
	) {}

	@Get('getAdministradores')
	async getAdministradores(@GetCurrentUserId() currentUserId: string): Promise<User[]> {
		await this.usersService.verifyAdmin(currentUserId);
		return await this.administradoresService.getUsuariosByRol(process.env.RADMIN);
	}

	@Get('getUsuarios')
	async getUsuarios(@GetCurrentUserId() currentUserId: string): Promise<User[]> {
		await this.usersService.verifyAdmin(currentUserId);
		return await this.administradoresService.getUsuariosByRol(process.env.RUSUARIO);
	}

	@Get('getUsuarioByRolAndId/:idUser/:rolid')
	async getUsuarioByRolAndId(
		@Param('idUser') idUser: string,
		@Param('rolid') rolid: string,
		@GetCurrentUserId() currentUserId: string
	): Promise<User> {
		await this.usersService.verifyAdmin(currentUserId);
		return await this.administradoresService.getUsuarioByRolAndId(idUser, rolid);
	}

	@Post('/')
	async crearUsuario(
		@Body() user: UserDto,
		@GetCurrentUserId() currentUserId: string
	): Promise<{ msg: string; user: User }> {
		await this.usersService.verifyAdmin(currentUserId);
		const userCreated = await this.usersService.createUser(user);
		return { msg: 'Usuario creado correctamente.', user: userCreated };
	}

	@Put('putUsuario/:userId')
	async putUsuario(
		@Body() user: UserDto,
		@Param('userId') userId: string,
		@GetCurrentUserId() currentUserId: string
	): Promise<{ msg: string; user: User }> {
		await this.usersService.verifyAdmin(currentUserId);
		const updatedUser = await this.usersService.updateUser(userId, user);
		return { msg: 'Usuario actualizado correctamente.', user: updatedUser };
	}

	@Put('/changePasswordUser/:userId')
	async changePasswordUser(
		@Body() { password, passwordConfirm }: PasswordDto,
		@Param('userId') userId: string,
		@GetCurrentUserId() currentUserId: string
	): Promise<Object> {
		await this.usersService.verifyAdmin(currentUserId);
		if (password.trim() !== passwordConfirm.trim())
			throw new BadRequestException('Las contraseñas no coinciden');

		await this.usersService.updatePassword(userId, password);
		return {
			msg: 'Contraseña actualizada correctamente.',
		};
	}

	@Put('add-remove-bids')
	async addRemoveBids(
		@Body() { bids, _id: userId, statusAddRemoveBids }: BidsUserDto,
		@GetCurrentUserId() currentUserId: string
	): Promise<Object> {
		await this.usersService.verifyAdmin(currentUserId);
		let newBids;
		if (statusAddRemoveBids === 'add') {
			newBids = await this.administradoresService.addBidsUser({
				_id: userId,
				bids,
			});
		}

		if (statusAddRemoveBids === 'remove') {
			newBids = await this.administradoresService.removeBidsUser({
				_id: userId,
				bids,
			});
		}

		return {
			msg: 'Bids actualizados correctamentes.',
			bids: newBids,
		};
	}

	@Delete('/:idUsuarioDelete')
	async deleteUsuario(
		@Param('idUsuarioDelete') idUsuarioDelete: string,
		@GetCurrentUserId() currentUserId: string
	): Promise<Object> {
		await this.usersService.verifyAdmin(currentUserId);
		await this.usersService.eliminarUsuario(idUsuarioDelete);
		return { msg: 'Usuario eliminado correctamente.' };
	}
}
