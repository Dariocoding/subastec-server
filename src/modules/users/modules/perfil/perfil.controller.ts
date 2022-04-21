import { Body, Controller, Delete, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GetCurrentUserId } from 'src/modules/auth/common/decorators';
import { UserDto, PasswordDto } from '../../dto';
import { UsersService } from '../../users.service';
import { BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter, storageImage, moveFile } from 'src/helpers';

@Controller('perfil')
export class PerfilController {
	constructor(private usersService: UsersService) {}

	@Put('/putPerfil')
	async putPerfil(
		@Body() user: UserDto,
		@GetCurrentUserId() userId: string
	): Promise<Object> {
		await this.usersService.updateUser(userId, user);
		return { msg: 'Perfil Actualizado correctamente.' };
	}

	@Put('/changePasswordPerfil')
	async changePasswordPerfil(
		@Body() { password, passwordConfirm }: PasswordDto,
		@GetCurrentUserId() userId: string
	): Promise<Object> {
		if (password.trim() !== passwordConfirm.trim())
			throw new BadRequestException('Las contraseñas no coinciden');

		await this.usersService.updatePassword(userId, password);
		return { msg: 'Contraseña cambiada exitosamente' };
	}

	@Put('/changeFotoPerfil')
	@UseInterceptors(
		FileInterceptor('file', {
			storage: storageImage(),
			fileFilter: imageFileFilter,
		})
	)
	async changeFotoPerfil(@GetCurrentUserId() userId: string, @UploadedFile() file) {
		const fntGenerarStringFoto = async filename =>
			await this.usersService.compareFotoPerfilUser(filename);
		const filename = await editFileName('profile/', file, fntGenerarStringFoto);
		await this.usersService.revisarYEliminarFotoPerfil(userId);
		await this.usersService.changeFotoPerfil(userId, filename);
		await moveFile(file.filename, filename);
		return { fotoperfil: filename, msg: 'Foto de perfil cambiada exitosamente.' };
	}

	@Delete('/BorrarFotoPerfil')
	async BorrarFotoPerfil(@GetCurrentUserId() userId: string) {
		await this.usersService.revisarYEliminarFotoPerfil(userId);
		await this.usersService.changeFotoPerfil(userId, '');
		return { msg: 'Foto de perfil eliminada exitosamente.' };
	}

	@Delete('/eliminarCuenta')
	async eliminarCuenta(@GetCurrentUserId() userId: string) {
		await this.usersService.eliminarUsuario(userId);
		return { msg: 'Usuario eliminado correctamente.' };
	}
}
