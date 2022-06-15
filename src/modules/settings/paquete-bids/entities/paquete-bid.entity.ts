import { Pago } from 'src/modules/pagos/entities/pago.entity';
import { Subasta } from 'src/modules/subastas/entities';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('paquete_bids')
export class PaqueteBid {
	@PrimaryGeneratedColumn('increment')
	idpaquete?: number;

	@Column('int')
	bonus: number;

	@Column('int')
	cantidadBids: number;

	@Column('float')
	price: number;

	@Column()
	background: string;

	@Column('int')
	status: number;

	@OneToMany(() => Subasta, subasta => subasta.paqueteBid)
	subastas: Subasta[];

	@OneToMany(() => Pago, pago => pago.paqueteBid)
	pagos: Pago[];
}
