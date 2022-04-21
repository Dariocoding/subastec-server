import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { SettingsModule } from './modules/settings/settings/settings.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductosModule } from './modules/productos/productos.module';
import { CategoriasModule } from './modules/categorias/categorias.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './modules/auth/common/guards';
import { MulterModule } from '@nestjs/platform-express';
import { ContactosModule } from './modules/settings/contactos/contactos.module';
import { MailModule } from './mail/mail.module';
import { SubastasModule } from './modules/subastas/subastas.module';
import { PaqueteBidsModule } from './modules/settings/paquete-bids/paquete-bids.module';
@Module({
	imports: [
		AuthModule,
		UsersModule,
		ProductosModule,
		CategoriasModule,
		MulterModule.register({
			dest: './public',
		}),
		ConfigModule.forRoot({ isGlobal: true }),
		SettingsModule,
		ContactosModule,
		MailModule,
		MongooseModule.forRoot(
			'mongodb+srv://holasoydark2:fA96NYzykm9AZDwQ@cluster0.xoguh.mongodb.net/subastec'
		),
		SubastasModule,
		PaqueteBidsModule,
	],
	/* mongodb://localhost/subastec */
	/* mongodb+srv://holasoydark2:fA96NYzykm9AZDwQ@cluster0.xoguh.mongodb.net/subastec */

	providers: [{ provide: APP_GUARD, useClass: AtGuard }],
})
export class AppModule {}
