import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities';
import { AdministradoresController } from './administradores.controller';
import { AdministradoresService } from './administradores.service';

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([User])],
	controllers: [AdministradoresController],
	providers: [AdministradoresService],
	exports: [AdministradoresService],
})
export class AdministradoresModule {}
