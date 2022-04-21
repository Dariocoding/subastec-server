import { Controller, Get, Put, Body } from '@nestjs/common';
import { GetCurrentUserId, Public } from '../../auth/common/decorators';
import { UsersService } from '../../users/users.service';
import { SettingsDto } from './dto';
import { Settings } from './interfaces';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
	constructor(private settingsService: SettingsService, private usersService: UsersService) {}

	@Public()
	@Get('/')
	async getConfiguracion(): Promise<Settings> {
		return await this.settingsService.getConfiguracion();
	}

	@Put('/')
	async setConfiguracion(
		@GetCurrentUserId() userId: string,
		@Body() body: SettingsDto
	): Promise<object> {
		await this.usersService.verifyAdmin(userId);
		await this.settingsService.setConfiguracion(body);
		return { msg: 'Configuración actualizada correctamente.' };
	}
}
