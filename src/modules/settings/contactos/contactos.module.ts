import { Module } from '@nestjs/common';
import { ContactosService } from './contactos.service';
import { ContactosController } from './contactos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contacto } from './entities';

@Module({
	imports: [TypeOrmModule.forFeature([Contacto])],
	providers: [ContactosService],
	controllers: [ContactosController],
})
export class ContactosModule {}
