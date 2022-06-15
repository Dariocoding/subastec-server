import { Global, Module } from '@nestjs/common';
import { SubastasService } from './subastas.service';
import { SubastasController } from './subastas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subasta } from './entities';
import { Producto } from '../productos/entities';
import { PaqueteBid } from '../settings/paquete-bids/entities/paquete-bid.entity';
import { Puja } from '../puja/entities/puja.entity';

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([Subasta, Producto, PaqueteBid, Puja])],
	providers: [SubastasService],
	controllers: [SubastasController],
	exports: [SubastasService],
})
export class SubastasModule {}
