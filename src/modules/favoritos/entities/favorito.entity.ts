import { Subasta } from 'src/modules/subastas/entities';
import { User } from 'src/modules/users/entities';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('favoritos')
export class Favorito {
	@PrimaryGeneratedColumn('increment')
	idfavorito: number;

	@ManyToOne(() => User, user => user.favoritos)
	@JoinColumn({ name: 'userid' })
	user?: User;

	@Column('int')
	userid: number;

	@ManyToOne(() => Subasta, subasta => subasta.favoritos)
	@JoinColumn({ name: 'subastaid' })
	subasta: Subasta;

	@Column('int')
	subastaid: number;
}
