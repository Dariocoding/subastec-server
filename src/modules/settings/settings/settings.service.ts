import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SettingsDto } from './dto';
import { Settings } from './entities';

@Injectable()
export class SettingsService {
	constructor(@InjectRepository(Settings) private settingsRepository: Repository<Settings>) {}

	getConfiguracion() {
		return this.settingsRepository.findOne({ where: { id: 1 } });
	}

	async setConfiguracion(data: SettingsDto) {
		await this.settingsRepository.update({ id: 1 }, data);
	}
}
