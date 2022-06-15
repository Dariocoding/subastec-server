import { Favorito } from 'src/modules/favoritos/entities';
import { Producto } from 'src/modules/productos/entities';
import { Puja } from 'src/modules/puja/entities/puja.entity';
import { PaqueteBid } from 'src/modules/settings/paquete-bids/entities/paquete-bid.entity';
import { SubastaDestacada } from 'src/modules/subastas-destacadas/entities/subastas-destacada.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('subastas')
export class Subasta {
	@PrimaryGeneratedColumn('increment')
	idsubasta: number;

	@Column()
	titulo: string;

	@Column({ nullable: true, name: 'foto_subasta' })
	fotoSubasta?: string;

	@ManyToOne(() => Producto, producto => producto.subastas)
	@JoinColumn({ name: 'productoid' })
	producto?: Producto;

	@Column({ type: 'int', nullable: true })
	productoid: number;

	@ManyToOne(() => PaqueteBid, paqueteBid => paqueteBid.subastas)
	@JoinColumn({ name: 'paquete_bid_id' })
	paqueteBid?: PaqueteBid;

	@Column({ type: 'int', nullable: true })
	paqueteBidId: number;

	@CreateDateColumn({ type: 'timestamp', name: 'fecha_inicio' })
	fechaInicio: Date;

	@CreateDateColumn({ type: 'timestamp' })
	fechaFinalizacion: Date;

	@Column({ type: 'int' })
	costopuja: number;

	@Column({ type: 'float' })
	preciominimo: number;

	@Column({ type: 'float', nullable: true })
	preciosubasta: number;

	@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	date_created: Date;

	@Column({ type: 'int', default: 1 })
	status: number;

	@OneToMany(() => Favorito, favorito => favorito.subasta)
	favoritos?: Favorito[];

	@OneToMany(() => Puja, puja => puja.subasta)
	pujas: Puja[];

	@OneToMany(() => SubastaDestacada, subastaDestacada => subastaDestacada.subasta)
	subastasDestacadas: SubastaDestacada[];

	totalPujas: number;
}
