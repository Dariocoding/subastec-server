import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { SettingsDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Settings } from './interfaces';

@Injectable()
export class SettingsService {
	constructor(@InjectModel('Settings') private settingsModel: Model<Settings>) {}

	async getConfiguracion(): Promise<Settings> {
		const settings = await this.settingsModel.find();
		return settings[0];
	}

	async setConfiguracion(settings: SettingsDto): Promise<void> {
		const settingsActual = await this.getConfiguracion();
		await this.settingsModel.updateOne({ _id: settingsActual._id }, settings);
	}
}
