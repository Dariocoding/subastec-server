import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Producto } from './productos.entity';

@Entity('imagenes')
export class Imagenes {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column()
	filename: string;

	@OneToMany(() => Producto, producto => producto.imagenes)
	@JoinColumn({ name: 'productoid' })
	producto?: Producto;

	@Column('int')
	productoid?: number;
}
