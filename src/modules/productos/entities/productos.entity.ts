import { Categoria } from 'src/modules/categorias/entities';
import { Subasta } from 'src/modules/subastas/entities';
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Imagenes } from './images.entity';

@Entity('productos')
export class Producto {
	@PrimaryGeneratedColumn('increment')
	idproducto?: number;

	@Column()
	nombre?: string;

	@Column('text')
	descripcion?: string;

	@Column('float')
	precio?: number;

	@Column()
	marca?: string;

	@Column()
	ruta?: string;

	@Column()
	codigo?: string;

	@Column()
	codigoTarjeta?: string;

	@Column('int')
	categoriaid?: number;

	@ManyToOne(() => Categoria, categoria => categoria.productos)
	@JoinColumn({ name: 'categoriaid' })
	categoria?: Categoria;

	@Column({ type: 'int', default: 1 })
	status?: number;

	@CreateDateColumn({
		type: 'timestamp',
		name: 'date_created',
		default: () => 'CURRENT_TIMESTAMP',
	})
	date_created?: Date;

	@OneToMany(() => Imagenes, imagenes => imagenes.producto)
	imagenes?: Imagenes[];

	@OneToMany(() => Subasta, subasta => subasta.producto)
	subastas?: Subasta[];
}
