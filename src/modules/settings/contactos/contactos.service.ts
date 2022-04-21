import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Contactos } from './interfaces';
import { Model } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
import { hexTestMongoObjId } from 'src/helpers';
@Injectable()
export class ContactosService {
	constructor(
		@InjectModel('Contactos') private contactosModel: Model<Contactos>,
		private mailService: MailService
	) {}

	private projectContacto: Object = {
		nombre: 1,
		email: 1,
		telefono: 1,
		datecreated: {
			$dateToString: {
				format: '%d-%m-%Y',
				date: '$datecreated',
			},
		},
	};

	async getContactos(): Promise<Contactos[]> {
		return await this.contactosModel.aggregate([
			{
				$project: {
					...this.projectContacto,
				},
			},
		]);
	}

	async getContacto(contactoId: string): Promise<Contactos> {
		const contacto = await this.contactosModel.aggregate([
			{ $match: { _id: hexTestMongoObjId(contactoId) } },
			{
				$project: {
					ip: 1,
					dispositivo: 1,
					useragent: 1,
					mensaje: 1,
					...this.projectContacto,
				},
			},
			{ $limit: 1 },
		]);
		if (!contacto[0]) throw new NotFoundException('Contacto no encontrado');
		return contacto[0];
	}

	async newContacto(contacto: Contactos) {
		const newContacto = new this.contactosModel(contacto);
		await this.mailService.sendMensajeContacto(contacto);
		return await newContacto.save();
	}
}
