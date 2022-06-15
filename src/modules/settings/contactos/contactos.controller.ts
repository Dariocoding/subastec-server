import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ContactosService } from './contactos.service';
import { UsersService } from 'src/modules/users/users.service';
import { GetCurrentRolId, Public } from 'src/modules/auth/common/decorators';
import { Contacto } from './entities';
import { RealIp } from 'nestjs-real-ip';
import { CreateContactoDto } from './dto/contactos.dto';
@Controller('contactos')
export class ContactosController {
	constructor(
		private contactosService: ContactosService,
		private usersService: UsersService
	) {}

	@Public()
	@Get()
	getContactos() {
		return this.contactosService.getContactos();
	}

	@Get(':id')
	async getContacto(@Param('id') id: string, @GetCurrentRolId() userRolId: number) {
		this.usersService.verifyAdminByRolId(userRolId);
		return this.contactosService.getContacto(+id);
	}

	@Public()
	@Post()
	async newContacto(@Body() contacto: CreateContactoDto, @RealIp() ip: string, @Req() req) {
		contacto.useragent_browser = req.session.useragent_browser;
		contacto.useragent_version = req.session.useragent_version;
		contacto.useragent_os = req.session.useragent_os;
		contacto.useragent_platform = req.session.useragent_platform;
		contacto.useragent_source = req.session.useragent_source;
		contacto.dispositivo = req.dispositivo;
		contacto.ip = ip;
		await this.contactosService.newContacto(contacto);
		return { msg: 'Has enviado el mensaje correctamente.' };
	}
}
