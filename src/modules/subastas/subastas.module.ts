import { Module } from '@nestjs/common';
import { SubastasService } from './subastas.service';
import { SubastasController } from './subastas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubastaSchema, Subasta } from './schemas';
@Module({
	imports: [MongooseModule.forFeature([{ name: Subasta.name, schema: SubastaSchema }])],
	providers: [SubastasService],
	controllers: [SubastasController],
})
export class SubastasModule {}
