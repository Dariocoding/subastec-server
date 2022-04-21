import { Module } from '@nestjs/common';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Categorias, CategoriasSchema } from './schemas';
import { ProductosModule } from '../productos/productos.module';
@Module({
	imports: [
		MongooseModule.forFeature([{ name: Categorias.name, schema: CategoriasSchema }]),
		ProductosModule,
	],
	controllers: [CategoriasController],
	providers: [CategoriasService],
})
export class CategoriasModule {}
