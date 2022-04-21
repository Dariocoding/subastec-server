import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Productos } from './interfaces';
import { Model } from 'mongoose';
import { productoDto } from './dto';
import { crearURLAmigable, editFileName, moveFile, deleteFile, convertToFloat } from 'src/helpers';
import { Images } from './interfaces';
import { hexTestMongoObjId } from 'src/helpers';
@Injectable()
export class ProductosService {
	constructor(
		@InjectModel('Productos') private productosModel: Model<Productos>,
		@InjectModel('Images') private imagesModel: Model<Images>
	) {}

	async find(): Promise<Productos[]> {
		return this.setPrecioProductos(
			await this.productosModel
				.aggregate([
					{ $match: { status: { $ne: 0 } } },
					...this.unwindCategoria(),
				])
				.sort({ _id: -1 })
		);
	}

	async findIdName(): Promise<Productos[]> {
		return await this.productosModel.find({ status: { $ne: 0 } }, { nombre: 1 });
	}

	async findById(productoId: string): Promise<Productos> {
		const producto = await this.productosModel.aggregate([
			{ $match: { _id: hexTestMongoObjId(productoId), status: { $ne: 0 } } },
			...this.unwindCategoria(),
		]);

		if (!producto[0]) throw new NotFoundException('Este producto no existe.');
		return this.setPrecioProductos(producto)[0];
	}

	async findByCategoria(categoraId: string): Promise<Productos[]> {
		const productos = await this.productosModel
			.aggregate([
				{
					$match: {
						categoriaid: hexTestMongoObjId(categoraId),
						status: { $ne: 0 },
					},
				},
				...this.unwindCategoria(),
			])
			.sort({ _id: -1 });
		return this.setPrecioProductos(productos);
	}

	async countByCategoria(categoriaId: string): Promise<number> {
		return await this.productosModel
			.find({
				categoriaid: categoriaId,
				status: { $ne: 0 },
			})
			.count();
	}

	async crearProducto(producto: productoDto, files: Array<Express.Multer.File>) {
		producto.ruta = crearURLAmigable(producto.nombre);
		const reqP = await this.findByRuta(producto.ruta);
		if (reqP) throw new BadRequestException('Este nombre de producto ya existe');
		producto.precio = convertToFloat(producto.precio);
		const newProducto = new this.productosModel(producto);
		await newProducto.save();
		await this.insertFilesProducto(newProducto._id, files);
		return await this.findById(newProducto._id);
	}

	async insertFilesProducto(
		productoid: string,
		files: Array<Express.Multer.File>
	): Promise<Images[]> {
		const arrFiles: Promise<Images[]> = new Promise(async resolve => {
			let images: Images[] = [];
			let processedImages: number = 0;
			let numImagesToProcess: number = files.length;

			for (let i = 0; i < numImagesToProcess; i++) {
				const file = files[i];
				images.push(await this.uploadFile('productos/', file, productoid));
				processedImages += 1;
			}

			if (processedImages === numImagesToProcess) {
				resolve(images);
			}
		});

		return await arrFiles;
	}

	private async uploadFile(prefix: string, file, productoid: string): Promise<Images> {
		const searchImageProducto = async string =>
			await this.imagesModel.findOne({ filename: string });
		const filename = await editFileName(prefix, file, searchImageProducto);
		await moveFile(file.filename, filename);
		const imagen = await new this.imagesModel({
			productoid,
			filename,
		}).save();
		return imagen;
	}

	async editarProducto(productoId, producto: productoDto): Promise<Productos> {
		producto.ruta = crearURLAmigable(producto.nombre);
		producto.precio = convertToFloat(producto.precio);
		const verificar = await this.productosModel.findOne({
			_id: { $ne: hexTestMongoObjId(productoId) },
			$or: [{ nombre: producto.nombre }, { ruta: producto.ruta }],
			status: { $ne: 0 },
		});
		if (verificar) throw new BadRequestException('Este nombre de producto ya existe');
		await this.productosModel.updateOne({ _id: productoId }, producto);
		return await this.findById(productoId);
	}

	async findByRuta(ruta: string): Promise<Productos> {
		return await this.productosModel.findOne({ ruta, status: { $ne: 0 } });
	}

	async getImagesProducto(productoId: string): Promise<Images[]> {
		return await this.imagesModel.find(
			{ productoid: productoId },
			{ productoid: 0, __v: 0 }
		);
	}

	async deleteImagen(_id: string) {
		const imagen: Images = await this.imagesModel.findOneAndDelete({ _id });
		deleteFile(imagen.filename);
	}

	async deleteProducto(_id: string) {
		await this.productosModel.updateOne({ _id }, { $set: { status: 0 } });
	}

	private setPrecioProductos(productos: Productos[]) {
		return productos.map(p => this.setPrecioProducto(p));
	}

	private setPrecioProducto(producto: Productos): Productos {
		producto.precio = parseFloat(producto.precio.toString());

		return producto;
	}

	private unwindCategoria(): Array<any> {
		return [
			{
				$lookup: {
					from: 'categorias',
					localField: 'categoriaid',
					foreignField: '_id',
					as: 'categoria',
				},
			},
			{
				$unwind: {
					path: '$categorias',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$project: {
					nombre: 1,
					codigo: 1,
					precio: 1,
					descripcion: 1,
					ruta: 1,
					categoriaid: 1,
					marca: 1,
					codigoTarjeta: 1,
					datecreated: {
						$dateToString: {
							format: '%d-%m-%Y',
							date: '$datecreated',
						},
					},
					nombrecategoria: '$categoria.nombre',
				},
			},
		];
	}
}
