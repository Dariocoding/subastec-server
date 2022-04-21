import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Contactos } from 'src/modules/settings/contactos/interfaces';
import { User } from 'src/modules/users/user.interface';
import { SettingsService } from 'src/modules/settings/settings/settings.service';
import { ForgetPassword } from './interfaces';

@Injectable()
export class MailService {
	constructor(
		private mailerService: MailerService,
		private settingsService: SettingsService
	) {}

	async sendMensajeContacto(contacto: Contactos) {
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

	async forgetPassword({ user, urlRecovery }: ForgetPassword) {
		const config = await this.settingsService.getConfiguracion();
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
}
