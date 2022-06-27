import { Module } from '@nestjs/common';
import { SubastasReclamosService } from './subastas-reclamos.service';
import { SubastasReclamosController } from './subastas-reclamos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubastasReclamos } from './entities/subastas-reclamo.entity';
import { Subasta } from '../subastas/entities';

@Module({
	imports: [TypeOrmModule.forFeature([SubastasReclamos, Subasta])],
	controllers: [SubastasReclamosController],
	providers: [SubastasReclamosService],
})
export class SubastasReclamosModule {}
