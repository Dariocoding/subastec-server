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
import { GetCurrentRolId } from 'src/modules/auth/common/decorators';
import { UserDto } from '../../dto';
import { User } from '../../entities';
import { AdministradoresService } from './administradores.service';
import { PasswordDto, BidsUserDto } from '../../dto/';
import { RADMIN, RUSER } from 'src/utils';
@Controller('administradores')
export class AdministradoresController {
	constructor(
		private usersService: UsersService,
		private administradoresService: AdministradoresService
	) {}

	@Get('getAdministradores')
	getAdministradores(@GetCurrentRolId() currentUserRolId: number): Promise<User[]> {
		this.usersService.verifyAdminByRolId(currentUserRolId);
		return this.administradoresService.getUsuariosByRol(RADMIN);
	}

	@Get('getUsuarios')
	getUsuarios(@GetCurrentRolId() currentUserRolId: number): Promise<User[]> {
		this.usersService.verifyAdminByRolId(currentUserRolId);
		return this.administradoresService.getUsuariosByRol(RUSER);
	}

	@Get('getUsuarioByRolAndId/:idUser/:rolid')
	getUsuarioByRolAndId(
		@Param('idUser') idUser: string,
		@Param('rolid') rolid: string,
		@GetCurrentRolId() currentUserRolId: number
	) {
		this.usersService.verifyAdminByRolId(+currentUserRolId);
		return this.administradoresService.getUsuarioByRolAndId(+idUser, +rolid);
	}

	@Post('/')
	async crearUsuario(@Body() user: UserDto, @GetCurrentRolId() currentUserRolId: number) {
		this.usersService.verifyAdminByRolId(currentUserRolId);
		const userCreated = await this.usersService.createUser(user);
		return { msg: 'Usuario creado correctamente.', user: userCreated };
	}

	@Put('putUsuario/:userId')
	async putUsuario(
		@Body() user: UserDto,
		@Param('userId') userId: string,
		@GetCurrentRolId() currentUserRolId: number
	) {
		this.usersService.verifyAdminByRolId(currentUserRolId);
		const updatedUser = await this.usersService.updateUser(+userId, user);
		return { msg: 'Usuario actualizado correctamente.', user: updatedUser };
	}

	@Put('/changePasswordUser/:userId')
	async changePasswordUser(
		@Body() { password, passwordConfirm }: PasswordDto,
		@Param('userId') userId: string,
		@GetCurrentRolId() currentUserRolId: number
	) {
		this.usersService.verifyAdminByRolId(+currentUserRolId);
		if (password.trim() !== passwordConfirm.trim())
			throw new BadRequestException('Las contraseñas no coinciden');

		await this.usersService.updatePassword(+userId, password);
		return {
			msg: 'Contraseña actualizada correctamente.',
		};
	}

	@Put('add-remove-bids')
	async addRemoveBids(
		@Body() data: BidsUserDto,
		@GetCurrentRolId() currentUserRolId: number
	) {
		this.usersService.verifyAdminByRolId(+currentUserRolId);
		let newBids;
		if (data.statusAddRemoveBids === 'add') {
			newBids = await this.administradoresService.addBidsUser(data);
		}

		if (data.statusAddRemoveBids === 'remove') {
			newBids = await this.administradoresService.removeBidsUser(data);
		}

		return {
			msg: 'Bids actualizados correctamentes.',
			bids: newBids,
		};
	}

	@Delete('/:iduser')
	async deleteUsuario(
		@Param('iduser') iduser: string,
		@GetCurrentRolId() currentUserRolId: number
	) {
		this.usersService.verifyAdminByRolId(+currentUserRolId);
		await this.usersService.eliminarUsuario(+iduser);
		return { msg: 'Usuario eliminado correctamente.' };
	}
}
