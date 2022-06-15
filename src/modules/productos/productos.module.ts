import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Imagenes, Producto } from './entities';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([Producto, Imagenes])],
	controllers: [ProductosController],
	providers: [ProductosService],
	exports: [ProductosService],
})
export class ProductosModule {}
