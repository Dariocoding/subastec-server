import { Injectable } from '@nestjs/common';
import { Categoria } from './entities';
import { CreateCategoriaDto, UpdateCategoriaDto } from './dto';
import { crearURLAmigable, editFileName, moveFile, deleteFile, shuffledArr } from '../../utils';
import { BadRequestException } from '@nestjs/common';
import { ProductosService } from '../productos/productos.service';
import { SettingsService } from '../settings/settings/settings.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
@Injectable()
export class CategoriasService {
	constructor(
		@InjectRepository(Categoria)
		private categoriaRepository: Repository<Categoria>,
		private productosService: ProductosService,
		private settingsService: SettingsService
	) {}

	async find() {
		const ctgrias = await this.categoriaRepository.find({
			where: { status: Not(0) },
			order: { idcategoria: 'DESC' },
		});
		await this.setTotalProductosCategorias(ctgrias);
		return ctgrias;
	}

	async selectCategorias() {
		const configuracion = await this.settingsService.getConfiguracion();
		const { orden_categoria } = configuracion;

		let ctgrias: Categoria[];

		if (orden_categoria === 'ASC' || orden_categoria === 'DESC') {
			ctgrias = await this.categoriaRepository.find({
				where: { status: Not(0) },
				select: ['nombre', 'idcategoria', 'status'],
				order: { idcategoria: orden_categoria },
			});
		} else if (orden_categoria === 'alphabet') {
			ctgrias = await this.categoriaRepository.find({
				where: { status: Not(0) },
				select: ['nombre', 'idcategoria', 'status'],
				order: { nombre: 'ASC' },
			});
		} else if (orden_categoria === 'RAND') {
			ctgrias = await this.categoriaRepository.find({
				where: { status: Not(0) },
				select: ['nombre', 'idcategoria', 'status'],
			});
			ctgrias = shuffledArr(ctgrias);
		}

		ctgrias = [...ctgrias, { nombre: 'Paquete de Bids', idcategoria: -1, status: 1 }];

		return ctgrias;
	}

	async setTotalProductosCategorias(ctgrias: Categoria[]) {
		for (let i = 0; i < ctgrias.length; i++) {
			const { idcategoria } = ctgrias[i];
			ctgrias[i].totalproductos = await this.productosService.countByCategoria(
				idcategoria
			);
		}
	}

	findById(idcategoria: number) {
		return this.categoriaRepository.findOne({ where: { idcategoria, status: Not(0) } });
	}

	findByRuta(ruta: string) {
		return this.categoriaRepository.findOne({ where: { ruta, status: Not(0) } });
	}

	async revisarYEliminarPortada(idcategoria: number) {
		const categoria = await this.findById(idcategoria);
		if (categoria.portada) deleteFile(categoria.portada);
	}

	async createCategoria(data: CreateCategoriaDto, file: Express.Multer.File) {
		data.ruta = crearURLAmigable(data.nombre);
		data.status = +data.status;
		const categoriaEncontrada = await this.categoriaRepository.findOne({
			where: { nombre: data.nombre, ruta: data.ruta, status: Not(0) },
		});
		if (categoriaEncontrada)
			throw new BadRequestException('Este nombre de categoria o ruta ya existe');
		const categoria = await this.categoriaRepository.save(data);
		return this.insertPortadaCategoria(categoria.idcategoria, file);
	}

	private async insertPortadaCategoria(idcategoria: number, file: Express.Multer.File) {
		if (file) {
			const fntSearchPortada = async portada =>
				await this.categoriaRepository.findOne({ where: { portada } });
			const portada = await editFileName('categorias/', file, fntSearchPortada);
			await moveFile(file.filename, portada);
			await this.categoriaRepository.update({ idcategoria }, { portada });
			return this.findById(idcategoria);
		}
	}

	async updateCategoria(
		idcategoria: number,
		data: UpdateCategoriaDto,
		file: Express.Multer.File
	) {
		data.ruta = crearURLAmigable(data.nombre);
		data.status = +data.status;
		const is = await this.categoriaRepository.findOne({
			where: {
				idcategoria: Not(idcategoria),
				status: Not(0),
				nombre: data.nombre,
				ruta: data.ruta,
			},
		});
		if (is) throw new BadRequestException('Este nombre de categoria ya existe');
		const borrarImagen = data.borrarImagen === 'true';
		if (borrarImagen && !file) data.portada = '';
		const reqCategoria = await this.categoriaRepository.findOne({
			where: { idcategoria },
		});
		const primeraValidacion = reqCategoria.portada && file;
		const segundaValidacion = reqCategoria.portada && borrarImagen;

		if (primeraValidacion || segundaValidacion) deleteFile(reqCategoria.portada);

		await this.insertPortadaCategoria(idcategoria, file);
		delete data.borrarImagen;
		await this.categoriaRepository.save({ idcategoria, ...data });
		return this.findById(idcategoria);
	}

	async eliminarCategoria(idcategoria: number) {
		const productos = await this.productosService.findByCategoria(idcategoria);

		if (productos.length)
			throw new BadRequestException(
				'No se pueden eliminar productos con categorias relacionadas'
			);
		await this.categoriaRepository.update({ idcategoria }, { status: 0 });
	}
}
