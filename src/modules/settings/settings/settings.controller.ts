import { Controller, Get, Put, Body } from '@nestjs/common';
import { GetCurrentRolId, Public } from '../../auth/common/decorators';
import { UsersService } from '../../users/users.service';
import { SettingsDto } from './dto';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
	constructor(private settingsService: SettingsService, private usersService: UsersService) {}

	@Public()
	@Get('/')
	async getConfiguracion() {
		return await this.settingsService.getConfiguracion();
	}

	@Put('/')
	async setConfiguracion(@GetCurrentRolId() userRolId: number, @Body() body: SettingsDto) {
		this.usersService.verifyAdminByRolId(userRolId);
		await this.settingsService.setConfiguracion(body);
		return { msg: 'Configuración actualizada correctamente.' };
	}
}
