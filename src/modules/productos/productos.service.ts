import { BadRequestException, Injectable } from '@nestjs/common';
import { Producto, Imagenes } from './entities';
import { CreateProductoDto, UpdateProductoDto } from './dto';
import { crearURLAmigable, editFileName, moveFile, deleteFile, convertToFloat } from 'src/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
@Injectable()
export class ProductosService {
	constructor(
		@InjectRepository(Producto) private productoRepository: Repository<Producto>,
		@InjectRepository(Imagenes) private imagenesRepository: Repository<Imagenes>
	) {}

	countTotalProductos() {
		return this.productoRepository.count({ where: { status: Not(0) } });
	}

	findAll() {
		return this.productoRepository.find({
			where: { status: Not(0) },
			order: { idproducto: 'DESC' },
			relations: ['categoria'],
		});
	}

	findAllIdName() {
		return this.productoRepository.find({ where: { status: Not(0) } });
	}

	async findById(idproducto: number) {
		const producto = await this.productoRepository.findOne({
			where: { idproducto, status: Not(0) },
			relations: ['categoria'],
		});
		producto.imagenes = await this.imagenesRepository.find({
			where: { productoid: idproducto },
		});
		return producto;
	}

	findByCategoria(categoriaid: number) {
		return this.productoRepository.find({ where: { categoriaid, status: Not(0) } });
	}

	countByCategoria(categoriaid: number) {
		return this.productoRepository.count({ where: { categoriaid, status: Not(0) } });
	}

	async crearProducto(data: CreateProductoDto, files: Array<Express.Multer.File>) {
		data.ruta = crearURLAmigable(data.nombre);
		data.status = +data.status;
		data.categoriaid = +data.categoriaid;
		const reqP = await this.findByRuta(data.ruta);
		if (reqP) throw new BadRequestException('Este nombre de producto ya existe');
		data.precio = convertToFloat(data.precio);
		const newProducto = await this.productoRepository.save(data);
		await this.insertFilesProducto(newProducto.idproducto, files);
		return this.findById(newProducto.idproducto);
	}

	async insertFilesProducto(idproducto: number, files: Array<Express.Multer.File>) {
		const arrFiles = new Promise(async resolve => {
			let images: Imagenes[] = [];
			let processedImages: number = 0;
			let numImagesToProcess: number = files.length;

			for (let i = 0; i < numImagesToProcess; i++) {
				const file = files[i];
				images.push(await this.uploadFile('productos/', file, idproducto));
				processedImages += 1;
			}

			if (processedImages === numImagesToProcess) {
				resolve(images);
			}
		});

		return arrFiles;
	}

	private async uploadFile(prefix: string, file, productoid: number): Promise<Imagenes> {
		const searchImageProducto = async filename =>
			await this.imagenesRepository.findOne({ where: { filename } });
		const filename = await editFileName(prefix, file, searchImageProducto);
		await moveFile(file.filename, filename);
		return this.imagenesRepository.save({ productoid, filename });
	}

	async editarProducto(idproducto: number, data: UpdateProductoDto) {
		data.ruta = crearURLAmigable(data.nombre);
		data.precio = convertToFloat(data.precio);
		data.status = +data.status;
		data.categoriaid = +data.categoriaid;
		const verificar = await this.productoRepository.findOne({
			where: {
				status: Not(0),
				idproducto: Not(idproducto),
				nombre: data.nombre,
				ruta: data.ruta,
			},
		});
		if (verificar) throw new BadRequestException('Este nombre de producto ya existe');
		await this.productoRepository.save({ idproducto, ...data });
		return this.findById(idproducto);
	}

	async findByRuta(ruta: string) {
		return this.productoRepository.findOne({ where: { ruta, status: Not(0) } });
	}

	async getImagesProducto(productoid: number) {
		return this.imagenesRepository.find({ where: { productoid } });
	}

	async deleteImagen(id: number) {
		const imagen = await this.imagenesRepository.findOne({ where: { id } });
		if (!imagen) return;
		await this.imagenesRepository.delete({ id });
		deleteFile(imagen.filename);
	}

	async deleteProducto(idproducto: number) {
		await this.productoRepository.save({ idproducto, status: 0 });
	}
}
