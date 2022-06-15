import { Subasta } from 'src/modules/subastas/entities';
import { User } from 'src/modules/users/entities';
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	CreateDateColumn,
} from 'typeorm';

@Entity('pujas')
export class Puja {
	@PrimaryGeneratedColumn('increment')
	idpuja: number;

	@Column({ type: 'varchar', length: 50 })
	modalidad: 'M' | 'A';

	@Column('int')
	costopuja: number;

	@Column({ type: 'int', name: 'cantidad_bids' })
	cantidadBids: number;

	@ManyToOne(() => User, user => user.pujas)
	@JoinColumn({ name: 'userid' })
	user: User;

	@Column('int')
	userid: number;

	@ManyToOne(() => Subasta, subasta => subasta.pujas)
	@JoinColumn({ name: 'subastaid' })
	subasta: Subasta;

	@Column('int')
	subastaid: number;

	@CreateDateColumn({
		name: 'date_created',
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
	})
	date_created: Date;
}
