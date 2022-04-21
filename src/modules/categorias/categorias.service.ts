import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Categorias } from './interfaces';
import { CreateCategoriaDto } from './dto';
import { crearURLAmigable, editFileName, hexTestMongoObjId, moveFile } from '../../helpers';
import { NotFoundException } from '@nestjs/common';
import { deleteFile } from '../../helpers';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException } from '@nestjs/common';
import { ProductosService } from '../productos/productos.service';
import { SettingsService } from '../settings/settings/settings.service';
import { shuffleArr } from 'src/helpers/helpersArrays';
@Injectable()
export class CategoriasService {
	constructor(
		@InjectModel('Categorias') private categoriasModel: Model<Categorias>,
		private productosService: ProductosService,
		private settingsService: SettingsService
	) {}

	async find(): Promise<Categorias[]> {
		const configuracion = await this.settingsService.getConfiguracion();
		const OrdenCategoria = configuracion.orden_categoria;
		let ctgrias;
		if (OrdenCategoria === 'ASC' || OrdenCategoria === 'DESC') {
			ctgrias = await this.categoriasModel
				.find({ status: { $ne: 0 } })
				.sort({ _id: OrdenCategoria === 'ASC' ? 1 : -1 });
		} else if (OrdenCategoria === 'ALPHABET') {
			ctgrias = await this.categoriasModel
				.find({ status: { $ne: 0 } })
				.sort({ nombre: 1 })
				.collation({ locale: 'es', caseLevel: true });
		} else if (OrdenCategoria === 'RAND') {
			ctgrias = shuffleArr(
				await this.categoriasModel.find({ status: { $ne: 0 } })
			);
		}

		const newCategorias = await this.setTotalProductosCategorias(ctgrias);

		return newCategorias;
	}

	private async setTotalProductosCategorias(ctgrias: Categorias[]): Promise<Categorias[]> {
		let arr = [];
		for (let i = 0; i < ctgrias.length; i++) {
			arr[i] = ctgrias[i].toJSON();
			arr[i].totalproductos = await this.productosService.countByCategoria(
				ctgrias[i]._id
			);
		}
		return arr;
	}

	async findById(categoriaId: string): Promise<Categorias> {
		const categoria = await this.categoriasModel.findOne({
			_id: categoriaId,
			status: { $ne: 0 },
		});
		if (!categoria) throw new NotFoundException('Categoria no encontrada');
		return categoria;
	}

	async findByRuta(ruta: string): Promise<Categorias> {
		return await this.categoriasModel.findOne({ ruta, status: { $ne: 0 } });
	}

	async revisarYEliminarPortada(categoraId: string) {
		const categoria = await this.findById(categoraId);
		if (categoria.portada && categoria.portada !== '') deleteFile(categoria.portada);
	}

	async createCategoria(categoria: CreateCategoriaDto, file): Promise<Categorias> {
		categoria.ruta = crearURLAmigable(categoria.nombre);
		const categoriaEncontrada = await this.categoriasModel.findOne({
			nombre: categoria.nombre,
			ruta: categoria.ruta,
			status: { $ne: 0 },
		});
		if (categoriaEncontrada)
			throw new BadRequestException('Este nombre de categoria o ruta ya existe');
		const newCategoria = new this.categoriasModel(categoria);
		await newCategoria.save();
		await this.insertPortadaCategoria(newCategoria._id, file);
		return await this.findById(newCategoria._id);
	}

	private async insertPortadaCategoria(_id: string, file) {
		if (file) {
			const fntSearchPortada = async string =>
				await this.categoriasModel.findOne({ portada: string });
			const portada = await editFileName('categorias/', file, fntSearchPortada);
			await this.categoriasModel.updateOne({ _id }, { $set: { portada } });
			await moveFile(file.filename, portada);
		}
	}

	async updateCategoria(
		categoriaId: string,
		categoria: CreateCategoriaDto,
		file
	): Promise<Categorias> {
		const verificar = await this.categoriasModel.findOne({
			_id: { $ne: hexTestMongoObjId(categoriaId) },
			$or: [{ nombre: categoria.nombre }, { ruta: categoria.ruta }],
			status: { $ne: 0 },
		});
		if (verificar) throw new BadRequestException('Este nombre de categoria ya existe');
		categoria.ruta = crearURLAmigable(categoria.nombre);
		const borrarImagen = categoria.borrarImagen === 'true';
		if (borrarImagen && !file) categoria.portada = '';
		const reqCategoria = await this.categoriasModel.findById(categoriaId, {
			portada: 1,
		});
		const primeraValidacion =
			reqCategoria.portada && reqCategoria.portada !== '' && file;
		const segundaValidacion =
			reqCategoria.portada && reqCategoria.portada !== '' && borrarImagen;

		if (primeraValidacion || segundaValidacion) deleteFile(reqCategoria.portada);

		await this.insertPortadaCategoria(categoriaId, file);
		return await this.categoriasModel.findByIdAndUpdate(categoriaId, categoria, {
			new: true,
		});
	}

	async eliminarCategoria(categoriaId: string) {
		const productos = await this.productosService.findByCategoria(categoriaId);

		if (productos.length)
			throw new BadRequestException(
				'No se pueden eliminar productos con categorias relacionadas'
			);
		return await this.categoriasModel.updateOne(
			{ _id: categoriaId },
			{ $set: { status: 0 } }
		);
	}
}
