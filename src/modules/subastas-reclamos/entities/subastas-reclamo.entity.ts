import { Subasta } from 'src/modules/subastas/entities';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('subastas-reclamos')
export class SubastasReclamos {
	@PrimaryGeneratedColumn('increment')
	idreclamo?: number;

	@Column()
	direccion: string;

	@OneToOne(() => Subasta, subasta => subasta)
	@JoinColumn({ name: 'subastaid' })
	subasta?: Subasta;

	@Column('int')
	subastaid: number;
}
