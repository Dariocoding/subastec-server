import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('settings')
export class Settings {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column()
	nombre: string;

	@Column()
	correo: string;

	@Column()
	telefono: string;

	@Column()
	direccion: string;

	@Column()
	web: string;

	@Column('int')
	cantidad_subastas_inicio: number;

	@Column('varchar')
	orden_categoria: 'asc' | 'desc' | 'rand' | 'alphabet' | string;

	@Column({ type: 'int', name: 'bids_afiliados' })
	bidsAfiliados: number;
}
