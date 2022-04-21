import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ContactosService } from './contactos.service';
import { UsersService } from 'src/modules/users/users.service';
import { GetCurrentUserId, Public } from 'src/modules/auth/common/decorators';
import { Contactos } from './interfaces';
import { RealIp } from 'nestjs-real-ip';
@Controller('contactos')
export class ContactosController {
	constructor(
		private contactosService: ContactosService,
		private usersService: UsersService
	) {}

	@Public()
	@Get()
	async getContactos(): Promise<Contactos[]> {
		return await this.contactosService.getContactos();
	}

	@Get(':id')
	async getContacto(
		@Param('id') contactoId: string,
		@GetCurrentUserId() userId: string
	): Promise<Contactos> {
		await this.usersService.verifyAdmin(userId);
		return this.contactosService.getContacto(contactoId);
	}

	@Public()
	@Post()
	async newContacto(@Body() contacto: Contactos, @RealIp() ip, @Req() req): Promise<object> {
		contacto.useragent = req.session.useragent;
		contacto.dispositivo = req.dispositivo;
		contacto.ip = ip;
		await this.contactosService.newContacto(contacto);
		return { msg: 'Has enviado el mensaje correctamente.' };
	}
}
