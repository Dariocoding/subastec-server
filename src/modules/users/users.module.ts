import { Global, Module } from '@nestjs/common';
import { MongooseModulesUser } from './schemas';
import { UsersService } from './users.service';
import { AdministradoresModule } from './modules/administradores/administradores.module';
import { PerfilModule } from './modules/perfil/perfil.module';
import { UsersController } from './users.controller';

@Global()
@Module({
	imports: [MongooseModulesUser, AdministradoresModule, PerfilModule],
	providers: [UsersService],
	exports: [UsersService],
	controllers: [UsersController],
})
export class UsersModule {}
