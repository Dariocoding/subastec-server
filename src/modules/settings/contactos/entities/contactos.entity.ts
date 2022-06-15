import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('contacto')
export class Contacto {
	@PrimaryGeneratedColumn('increment')
	id?: number;

	@Column()
	nombre: string;

	@Column()
	telefono: string;

	@Column()
	email: string;

	@Column()
	mensaje?: string;

	@Column({ nullable: true })
	ip?: string;

	@Column({ nullable: true })
	dispositivo?: string;

	@Column({ nullable: true })
	useragent_browser?: string;

	@Column({ nullable: true })
	useragent_version?: string;

	@Column({ nullable: true })
	useragent_os?: string;

	@Column({ nullable: true })
	useragent_platform?: string;

	@Column({ nullable: true })
	useragent_source?: string;

	@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	date_created?: Date;
}
