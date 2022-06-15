import { Injectable } from '@nestjs/common';
import { Contacto } from './entities';
import { MailService } from 'src/mail/mail.service';
import { CreateContactoDto } from './dto/contactos.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class ContactosService {
	constructor(
		@InjectRepository(Contacto) private contactoRepository: Repository<Contacto>,
		private mailService: MailService
	) {}

	getContactos() {
		return this.contactoRepository.find({
			select: ['id', 'telefono', 'email', 'nombre', 'date_created'],
		});
	}

	getContacto(id: number) {
		return this.contactoRepository.findOne({ where: { id } });
	}

	async newContacto(data: CreateContactoDto) {
		await this.contactoRepository.save(data);
		await this.mailService.sendMensajeContacto(data);
	}
}
