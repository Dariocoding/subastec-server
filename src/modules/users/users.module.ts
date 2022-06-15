import { Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { AdministradoresModule } from './modules/administradores/administradores.module';
import { PerfilModule } from './modules/perfil/perfil.module';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invitacion, Rol, User } from './entities';

@Global()
@Module({
	imports: [
		AdministradoresModule,
		PerfilModule,
		TypeOrmModule.forFeature([User, Rol, Invitacion]),
	],
	providers: [UsersService],
	exports: [UsersService],
	controllers: [UsersController],
})
export class UsersModule {}
