import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settings } from './entities';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
@Global()
@Module({
	imports: [TypeOrmModule.forFeature([Settings])],
	controllers: [SettingsController],
	providers: [SettingsService],
	exports: [SettingsService],
})
export class SettingsModule {}
