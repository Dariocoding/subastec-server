import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { GetCurrentUserId, Public } from '../auth/common/decorators';
import { UsersService } from '../users/users.service';
import { CategoriasService } from './categorias.service';
import { Categorias } from './interfaces';
import { CreateCategoriaDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter, storageImage } from 'src/helpers';

@Controller('categorias')
export class CategoriasController {
	constructor(
		private usersService: UsersService,
		private categoriasService: CategoriasService
	) {}

	@Public()
	@Get()
	async getCategorias(): Promise<Categorias[]> {
		return await this.categoriasService.find();
	}

	@Public()
	@Get('/getCategoriaById/:categoriaId')
	async getCategoriaById(@Param('categoriaId') categoriaId: string): Promise<Categorias> {
		return await this.categoriasService.findById(categoriaId);
	}

	@Public()
	@Get('/getCategoriaByRuta/:rutaCategoria')
	async getCategoriaByRuta(
		@Param('rutaCategoria') rutaCategoria: string
	): Promise<Categorias> {
		return await this.categoriasService.findByRuta(rutaCategoria);
	}

	@Post()
	@UseInterceptors(
		FileInterceptor('file', {
			storage: storageImage(),
			fileFilter: imageFileFilter,
		})
	)
	async crearCategoria(
		@UploadedFile() file,
		@GetCurrentUserId() currentUserId: string,
		@Body() categoria: CreateCategoriaDto
	): Promise<{ msg: string; categoria: Categorias }> {
		await this.usersService.verifyAdmin(currentUserId);
		const newCategoria = await this.categoriasService.createCategoria(categoria, file);
		return { msg: 'Categoria creada correctamente', categoria: newCategoria };
	}

	@Put(':categoriaId')
	@UseInterceptors(
		FileInterceptor('file', {
			storage: storageImage(),
			fileFilter: imageFileFilter,
		})
	)
	async editarCategoria(
		@GetCurrentUserId() currentUserId: string,
		@Param('categoriaId') categoriaId: string,
		@Body() categoria: CreateCategoriaDto,
		@UploadedFile() file
	): Promise<{ msg: string; categoria: Categorias }> {
		await this.usersService.verifyAdmin(currentUserId);
		const updatedCategoria = await this.categoriasService.updateCategoria(
			categoriaId,
			categoria,
			file
		);
		return { msg: 'Categoria actualizada correctamente.', categoria: updatedCategoria };
	}

	@Delete(':categoriaId')
	async eliminarCategoria(
		@Param('categoriaId') categoriaId: string,
		@GetCurrentUserId() currentUserId: string
	): Promise<object> {
		await this.usersService.verifyAdmin(currentUserId);
		await this.categoriasService.eliminarCategoria(categoriaId);
		return { msg: 'Categoria eliminada correctamente.' };
	}
}
