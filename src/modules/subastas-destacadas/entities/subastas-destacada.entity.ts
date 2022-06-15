import { Subasta } from 'src/modules/subastas/entities';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('subastas-destacadas')
export class SubastaDestacada {
	@PrimaryGeneratedColumn('increment')
	iddestacado: number;

	@ManyToOne(() => Subasta, subasta => subasta)
	@JoinColumn({ name: 'subastaid' })
	subasta: Subasta;

	@Column('int')
	subastaid: number;
}
