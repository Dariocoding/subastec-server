import {
	Controller,
	Get,
	Param,
	Post,
	Put,
	Delete,
	UseInterceptors,
	UploadedFiles,
	Body,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GetCurrentUserId, Public } from '../auth/common/decorators';
import { UsersService } from '../users/users.service';
import { Productos } from './interfaces';
import { ProductosService } from './productos.service';
import { storageImage } from 'src/helpers';
import { productoDto } from './dto';

const maxFiles: number = 10;

@Controller('productos')
export class ProductosController {
	constructor(
		private usersService: UsersService,
		private productosService: ProductosService
	) {}

	@Public()
	@Get()
	async getProductos(): Promise<Productos[]> {
		return await this.productosService.find();
	}

	@Public()
	@Get('selectProductosIdName')
	async selectProductosIdName() {
		return await this.productosService.findIdName();
	}

	@Public()
	@Get('/getProductoById/:productoId')
	async getProductosById(@Param('productoId') productoId: string): Promise<Productos> {
		const producto = await this.productosService.findById(productoId);
		producto.imagenes = await this.productosService.getImagesProducto(productoId);
		return producto;
	}

	@Public()
	@Get('/getByCategoria/:categoriaId')
	async getByCategoria(@Param('categoriaId') categoriaId: string): Promise<Productos[]> {
		return await this.productosService.findByCategoria(categoriaId);
	}

	@Public()
	@Get('/getProductoByRuta/:rutaProducto')
	async getProductoByRuta(@Param('rutaProducto') rutaProducto: string) {}

	@Post()
	@UseInterceptors(
		FilesInterceptor('files', maxFiles, {
			storage: storageImage(),
		})
	)
	async crearProducto(
		@GetCurrentUserId() currentUserId: string,
		@UploadedFiles() files: Array<Express.Multer.File>,
		@Body() producto: productoDto
	): Promise<{ msg: string; producto: Productos }> {
		await this.usersService.verifyAdmin(currentUserId);
		const createdProducto = await this.productosService.crearProducto(producto, files);
		return { msg: 'Producto creado correctamente.', producto: createdProducto };
	}

	@Put('/uploadImages')
	@UseInterceptors(
		FilesInterceptor('files', maxFiles, {
			storage: storageImage(),
		})
	)
	async editarImagenesProducto(
		@GetCurrentUserId() currentUserId: string,
		@UploadedFiles() files: Array<Express.Multer.File>,
		@Body() { productoId }: { productoId: string }
	): Promise<Object> {
		await this.usersService.verifyAdmin(currentUserId);
		const imgs = await this.productosService.insertFilesProducto(productoId, files);
		return { msg: 'Imagenes subidas correctamente.', imgs };
	}

	@Put('/')
	async editarProducto(
		@GetCurrentUserId() currentUserId: string,
		@Body() producto: productoDto
	): Promise<{ msg: string; producto: Productos }> {
		await this.usersService.verifyAdmin(currentUserId);
		const updatedProducto = await this.productosService.editarProducto(
			producto.productoId,
			producto
		);
		return { msg: 'Producto actualizado correctamente.', producto: updatedProducto };
	}

	@Delete(':productoId')
	async eliminarProducto(
		@GetCurrentUserId() currentUserId: string,
		@Param('productoId') productoId: string
	): Promise<Object> {
		await this.usersService.verifyAdmin(currentUserId);
		await this.productosService.deleteProducto(productoId);
		return { msg: 'Producto eliminado correctamente.' };
	}

	@Delete('deleteImagen/:idImagen')
	async deleteImagen(
		@GetCurrentUserId() currentUserId: string,
		@Param('idImagen') idImagen: string
	): Promise<Object> {
		await this.usersService.verifyAdmin(currentUserId);
		await this.productosService.deleteImagen(idImagen);
		return { msg: 'Producto eliminado correctamente.' };
	}
}
