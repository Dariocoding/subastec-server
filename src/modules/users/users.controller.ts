import {
	BadRequestException,
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	Put,
} from '@nestjs/common';
import { Public } from '../auth/common/decorators';
import { UsersService } from './users.service';
import { MailService } from 'src/mail/mail.service';
import { User } from './user.interface';
import { recoverPasswordDto } from './dto';
import { Token } from 'src/helpers';

@Public()
@Controller('usuarios')
export class UsersController {
	constructor(private usersService: UsersService, private mailService: MailService) {}

	@Get('/:id')
	async getUsuario(@Param('id') idUser: string): Promise<User> {
		return await this.usersService.findById(idUser);
	}

	@Get('/verificarUsuarioCorreoAndToken/:correo/:token')
	async verificarUsuarioCorreoAndToken(
		@Param('correo') correo: string,
		@Param('token') token: string
	) {
		return {
			usuario: await this.usersService.findByCorreoAndToken(correo, token),
		};
	}

	@Put('/forgetPass')
	async recuperarContrasenia(@Body() { username }: { username: string }): Promise<Object> {
		let user = await this.usersService.findByEmail(username);
		if (!user) {
			user = await this.usersService.findByUsername(username);
			if (!user) throw new NotFoundException('Usuario no encontrador');
		}
		const { email_user } = user;
		const { APPWEB } = process.env;
		const token = Token();
		await this.usersService.updateTokenUser(user._id, token);
		const urlRecovery = APPWEB + `/recuperar-usuario/${email_user}/${token}`;

		await this.mailService.forgetPassword({ urlRecovery, user });

		return {
			msg: `Se le ha enviado un correo a su usuario, 
			por favor revíselo para poder recuperar su contraseña`,
		};
	}

	@Put('/recoverPass')
	async recoverPass(
		@Body()
		{ password, passwordConfirm, email_user, token, userId }: recoverPasswordDto
	): Promise<Object> {
		if (password !== passwordConfirm)
			throw new BadRequestException('Las contraseñas no coinciden');

		const user = await this.usersService.findByCorreoAndToken(
			email_user,
			token,
			userId
		);

		if (!user)
			throw new NotFoundException(
				'Este usuario no existe o no coinciden los tokens'
			);

		await this.usersService.updatePassword(user._id, password);

		return {
			msg: `Contraseña cambiada correctamente`,
		};
	}
}
