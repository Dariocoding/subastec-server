import { Module } from '@nestjs/common';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductosSchema, Productos, ImagesSchema, Images } from './schemas';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Productos.name, schema: ProductosSchema },
			{ name: Images.name, schema: ImagesSchema },
		]),
	],
	controllers: [ProductosController],
	providers: [ProductosService],
	exports: [ProductosService],
})
export class ProductosModule {}
