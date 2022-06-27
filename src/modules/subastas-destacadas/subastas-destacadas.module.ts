import { Global, Module } from '@nestjs/common';
import { SubastasDestacadasService } from './subastas-destacadas.service';
import { SubastasDestacadasController } from './subastas-destacadas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubastaDestacada } from './entities/subastas-destacada.entity';
import { Subasta } from '../subastas/entities';
import { SubastasService } from '../subastas/subastas.service';
import { Producto } from '../productos/entities';

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([SubastaDestacada, Producto])],
	controllers: [SubastasDestacadasController],
	providers: [SubastasDestacadasService],
	exports: [SubastasDestacadasService],
})
export class SubastasDestacadasModule {}
