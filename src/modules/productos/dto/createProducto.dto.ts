export class CreateProductoDto {
	nombre: string;

	marca: string;

	ruta?: string;

	codigo: string;

	codigoTarjeta: string;

	categoriaid: number;

	descripcion: string;

	precio: number;

	status?: number;
}
