import { Module } from '@nestjs/common';
import { PaqueteBidsService } from './paquete-bids.service';
import { PaqueteBidsController } from './paquete-bids.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PaqueteBid, PaqueteBidSchema } from './schemas/paqueteBids.schema';

@Module({
	imports: [MongooseModule.forFeature([{ name: PaqueteBid.name, schema: PaqueteBidSchema }])],
	controllers: [PaqueteBidsController],
	providers: [PaqueteBidsService],
})
export class PaqueteBidsModule {}
