import { PaqueteBid } from 'src/modules/settings/paquete-bids/entities/paquete-bid.entity';
import { User } from 'src/modules/users/entities';
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('pagos')
export class Pago {
	@PrimaryGeneratedColumn('increment')
	idpago: number;

	@ManyToOne(() => User, user => user.pagos)
	@JoinColumn({ name: 'userid' })
	user?: User;

	@Column('int')
	userid: number;

	@ManyToOne(() => PaqueteBid, paquetebid => paquetebid.pagos)
	@JoinColumn({ name: 'paquete_bid_id' })
	paqueteBid?: PaqueteBid;

	@Column({ type: 'int', name: 'paquete_bid_id' })
	paqueteBidId: number;

	@Column({ type: 'float' })
	amount: number;

	@Column({ type: 'int', name: 'cantidad_bids_total' })
	cantidadBidsTotal: number;

	@Column()
	reference: string;

	@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	date_created: Date;

	@Column()
	transactionStatus: string;

	@Column()
	transactionId: string;
}
