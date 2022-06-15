import { Global, Module } from '@nestjs/common';
import { PujaService } from './puja.service';
import { PujaController } from './puja.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Puja } from './entities/puja.entity';
import { Subasta } from '../subastas/entities';
import { Favorito } from '../favoritos/entities';
import { User } from '../users/entities';

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([Puja, Subasta, Favorito, User])],
	controllers: [PujaController],
	providers: [PujaService],
	exports: [PujaService],
})
export class PujaModule {}
