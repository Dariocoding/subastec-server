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
import { GetCurrentRolId, Public } from '../auth/common/decorators';
import { UsersService } from '../users/users.service';
import { Producto } from './entities';
import { ProductosService } from './productos.service';
import { storageImage } from 'src/utils';
import { UpdateProductoDto, CreateProductoDto } from './dto';

const maxFiles: number = 10;

@Controller('productos')
export class ProductosController {
	constructor(
		private usersService: UsersService,
		private productosService: ProductosService
	) {}

	@Public()
	@Get()
	async getProductos(): Promise<Producto[]> {
		return await this.productosService.findAll();
	}

	@Public()
	@Get('selectProductosIdName')
	async selectProductosIdName(): Promise<Producto[]> {
		return await this.productosService.findAllIdName();
	}

	@Public()
	@Get('/getProductoById/:idproducto')
	async getProductosById(@Param('idproducto') idproducto: string): Promise<Producto> {
		const producto = await this.productosService.findById(+idproducto);
		producto.imagenes = await this.productosService.getImagesProducto(+idproducto);
		return producto;
	}

	@Public()
	@Get('/getByCategoria/:categoriaId')
	async getByCategoria(@Param('categoriaId') categoriaId: string): Promise<Producto[]> {
		return await this.productosService.findByCategoria(+categoriaId);
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
		@GetCurrentRolId() currentUserRolId: number,
		@UploadedFiles() files: Array<Express.Multer.File>,
		@Body() data: CreateProductoDto
	) {
		this.usersService.verifyAdminByRolId(currentUserRolId);
		const producto = await this.productosService.crearProducto(data, files);
		return { msg: 'Producto creado correctamente.', producto };
	}

	@Put('/uploadImages/:idproducto')
	@UseInterceptors(
		FilesInterceptor('files', maxFiles, {
			storage: storageImage(),
		})
	)
	async editarImagenesProducto(
		@GetCurrentRolId() currentUserRolId: number,
		@UploadedFiles() files: Array<Express.Multer.File>,
		@Param('idproducto') idproducto: string
	) {
		this.usersService.verifyAdminByRolId(currentUserRolId);
		console.log(idproducto, files);
		const imgs = await this.productosService.insertFilesProducto(+idproducto, files);
		return { msg: 'Imagenes subidas correctamente.', imgs };
	}

	@Put('/')
	async editarProducto(
		@GetCurrentRolId() currentUserRolId: number,
		@Body() data: UpdateProductoDto
	) {
		this.usersService.verifyAdminByRolId(currentUserRolId);
		const producto = await this.productosService.editarProducto(data.idproducto, data);
		return { msg: 'Producto actualizado correctamente.', producto };
	}

	@Delete(':idproducto')
	async eliminarProducto(
		@GetCurrentRolId() currentUserRolId: number,
		@Param('idproducto') idproducto: string
	) {
		this.usersService.verifyAdminByRolId(currentUserRolId);
		await this.productosService.deleteProducto(+idproducto);
		return { msg: 'Producto eliminado correctamente.' };
	}

	@Delete('deleteImagen/:idImagen')
	async deleteImagen(
		@GetCurrentRolId() currentUserRolId: number,
		@Param('idImagen') idImagen: string
	) {
		this.usersService.verifyAdminByRolId(currentUserRolId);
		await this.productosService.deleteImagen(+idImagen);
		return { msg: 'Imagen eliminada correctamente.' };
	}
}
