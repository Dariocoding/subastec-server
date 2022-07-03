import { Producto } from 'src/modules/productos/entities';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categorias')
export class Categoria {
	@PrimaryGeneratedColumn('increment')
	idcategoria?: number;

	@Column()
	nombre: string;

	@Column()
	ruta?: string;

	@Column()
	descripcion?: string;

	@Column('int')
	status?: number;

	@Column({ nullable: true })
	portada?: string;

	totalproductos?: number;

	@OneToMany(() => Producto, producto => producto.categoria)
	productos?: Producto[];
}
