import {
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
import { GetCurrentRolId, Public } from '../auth/common/decorators';
import { UsersService } from '../users/users.service';
import { CategoriasService } from './categorias.service';
import { Categoria } from './entities';
import { CreateCategoriaDto, UpdateCategoriaDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter, storageImage } from 'src/utils';

@Controller('categorias')
export class CategoriasController {
	constructor(
		private usersService: UsersService,
		private categoriasService: CategoriasService
	) {}

	@Get()
	getCategorias() {
		return this.categoriasService.find();
	}

	@Get('selectCategorias')
	@Public()
	selectCategorias() {
		return this.categoriasService.selectCategorias();
	}

	@Public()
	@Get('/getCategoriaById/:categoriaId')
	getCategoriaById(@Param('categoriaId') categoriaId: string) {
		return this.categoriasService.findById(+categoriaId);
	}

	@Public()
	@Get('/getCategoriaByRuta/:rutaCategoria')
	async getCategoriaByRuta(
		@Param('rutaCategoria') rutaCategoria: string
	): Promise<Categoria> {
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
		@GetCurrentRolId() currentUserRolId: number,
		@Body() categoria: CreateCategoriaDto
	) {
		this.usersService.verifyAdminByRolId(currentUserRolId);
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
		@GetCurrentRolId() currentUserRolId: number,
		@Param('categoriaId') idcategoria: string,
		@Body() categoria: UpdateCategoriaDto,
		@UploadedFile() file
	) {
		this.usersService.verifyAdminByRolId(currentUserRolId);
		const updatedCategoria = await this.categoriasService.updateCategoria(
			+idcategoria,
			categoria,
			file
		);
		return { msg: 'Categoria actualizada correctamente.', categoria: updatedCategoria };
	}

	@Delete(':categoriaId')
	async eliminarCategoria(
		@Param('categoriaId') categoriaId: string,
		@GetCurrentRolId() currentUserRolId: number
	) {
		this.usersService.verifyAdminByRolId(currentUserRolId);
		await this.categoriasService.eliminarCategoria(+categoriaId);
		return { msg: 'Categoria eliminada correctamente.' };
	}
}
