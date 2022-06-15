import { Global, Module } from '@nestjs/common';
import { SubastasDestacadasService } from './subastas-destacadas.service';
import { SubastasDestacadasController } from './subastas-destacadas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubastaDestacada } from './entities/subastas-destacada.entity';

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([SubastaDestacada])],
	controllers: [SubastasDestacadasController],
	providers: [SubastasDestacadasService],
	exports: [SubastasDestacadasService],
})
export class SubastasDestacadasModule {}
