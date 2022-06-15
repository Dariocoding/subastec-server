import { Global, Module } from '@nestjs/common';
import { PaqueteBidsService } from './paquete-bids.service';
import { PaqueteBidsController } from './paquete-bids.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaqueteBid } from './entities/paquete-bid.entity';

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([PaqueteBid])],
	controllers: [PaqueteBidsController],
	providers: [PaqueteBidsService],
	exports: [PaqueteBidsService],
})
export class PaqueteBidsModule {}
