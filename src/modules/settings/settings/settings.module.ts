import { Global, Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingsSchema, Settings } from './schemas';
import { UsersModule } from '../../users/users.module';
@Global()
@Module({
	imports: [
		UsersModule,
		MongooseModule.forFeature([{ name: Settings.name, schema: SettingsSchema }]),
	],
	controllers: [SettingsController],
	providers: [SettingsService],
	exports: [SettingsService],
})
export class SettingsModule {}
