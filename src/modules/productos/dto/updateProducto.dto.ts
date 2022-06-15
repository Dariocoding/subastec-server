import { CreateProductoDto } from './createProducto.dto';

export interface UpdateProductoDto extends CreateProductoDto {
	idproducto: number;
}
