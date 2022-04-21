import { Module } from '@nestjs/common';
import { ContactosService } from './contactos.service';
import { ContactosController } from './contactos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactosSchema, Contactos } from './schemas';

@Module({
	imports: [MongooseModule.forFeature([{ name: Contactos.name, schema: ContactosSchema }])],
	providers: [ContactosService],
	controllers: [ContactosController],
})
export class ContactosModule {}
