import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosModule } from '../productos/productos.module';
import { Subasta } from '../subastas/entities';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { Categoria } from './entities';
@Module({
	imports: [ProductosModule, TypeOrmModule.forFeature([Categoria, Subasta])],
	controllers: [CategoriasController],
	providers: [CategoriasService],
})
export class CategoriasModule {}
