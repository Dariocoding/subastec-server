import { Global, Module } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pago } from './entities/pago.entity';
import { Invitacion } from '../users/entities';

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([Pago, Invitacion])],
	controllers: [PagosController],
	providers: [PagosService],
	exports: [PagosService],
})
export class PagosModule {}
