import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Contacto } from 'src/modules/settings/contactos/entities';
import { User } from 'src/modules/users/entities';
import { SettingsService } from 'src/modules/settings/settings/settings.service';
import { ForgetPassword } from './interfaces';
import { Producto } from 'src/modules/productos/entities';

@Injectable()
export class MailService {
	constructor(
		private mailerService: MailerService,
		private settingsService: SettingsService
	) {}

	async sendMensajeContacto(contacto: Contacto) {
		const config = await this.settingsService.getConfiguracion();

		await this.mailerService.sendMail({
			to: process.env.EMAIL_APP_USER,
			from: `"${config.nombre}" <${process.env.EMAIL_APP_USER}>`,
			subject: 'Una persona ha tratado de contactarlo!',

			template: __dirname + '/templates/enviarMensajeContacto',
			context: {
				nombre: contacto.nombre,
				email: contacto.email,
				mensaje: contacto.mensaje,
			},
		});
	}

	async forgetPassword(user: User) {
		const config = await this.settingsService.getConfiguracion();
		const urlRecovery =
			process.env.APPWEB + `/recuperar-usuario/${user.email_user}/${user.token}`;

		await this.mailerService.sendMail({
			to: user.email_user,
			from: `"${config.nombre}" <${process.env.EMAIL_APP_USER}>`,
			subject: `Has olvidado tu contraseña en ${config.nombre}`,
			template: __dirname + '/templates/forgetPassword',
			context: {
				nombre_empresa: config.nombre,
				urlRecovery,
				nombres: user.nombres,
				apellidos: user.apellidos,
				email_user: user.email_user,
			},
		});
	}

	async enviarCorreoCodigoTarjetaSubasta(
		producto: Producto,
		user: User,
		fotoTarjeta: string
	) {
		if (!producto.codigoTarjeta) return;
		if (!user.email_user) return;

		const config = await this.settingsService.getConfiguracion();
		await this.mailerService.sendMail({
			to: user.email_user,
			from: `"${config.nombre}" <${process.env.EMAIL_APP_USER}>`,
			subject: `Has ganado la subasta en ${config.nombre}`,
			template: __dirname + `/templates/enviarTarjetaProducto`,
			context: {
				codigoTarjeta: producto.codigoTarjeta,
				titulo: producto.nombre,
				fotoTarjeta: process.env.BACKENDURL + fotoTarjeta,
			},
		});
	}
}
