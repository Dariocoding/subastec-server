import { CreateCategoriaDto } from './createCategoria.dto';

export interface UpdateCategoriaDto extends CreateCategoriaDto {
	idcategoria: number;
}
