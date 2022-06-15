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
import { User } from './entities';
import { recoverPasswordDto } from './dto';
import { Token } from 'src/utils';

@Public()
@Controller('usuarios')
export class UsersController {
	constructor(private usersService: UsersService, private mailService: MailService) {}

	@Get('/:id')
	getUsuario(@Param('id') idUser: string) {
		return this.usersService.findById(+idUser);
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
	async recuperarContrasenia(@Body() dto: { username: string }) {
		let user = await this.usersService.findByEmail(dto.username);
		if (!user) {
			user = await this.usersService.findByUsername(dto.username);
			if (!user) throw new NotFoundException('Usuario no encontrador');
		}
		const { email_user } = user;
		const { APPWEB } = process.env;
		const token = Token();
		await this.usersService.updateTokenUser(user.iduser, token);
		const urlRecovery = APPWEB + `/recuperar-usuario/${email_user}/${token}`;

		await this.mailService.forgetPassword({ urlRecovery, user });

		return {
			msg: `Se le ha enviado un correo a su usuario, 
			por favor revíselo para poder recuperar su contraseña`,
		};
	}

	@Put('/recoverPass')
	async recoverPass(@Body() body: recoverPasswordDto) {
		const { password, passwordConfirm, email_user, token, iduser } = body;
		if (password !== passwordConfirm)
			throw new BadRequestException('Las contraseñas no coinciden');

		const user = await this.usersService.findByCorreoAndToken(
			email_user,
			token,
			+iduser
		);

		if (!user)
			throw new NotFoundException(
				'Este usuario no existe o no coinciden los tokens'
			);

		await this.usersService.updatePassword(user.iduser, password);

		return {
			msg: `Contraseña cambiada correctamente`,
		};
	}
}
