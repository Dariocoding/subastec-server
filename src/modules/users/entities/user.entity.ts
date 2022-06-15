import { Favorito } from 'src/modules/favoritos/entities';
import { Pago } from 'src/modules/pagos/entities/pago.entity';
import { Puja } from 'src/modules/puja/entities/puja.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Invitacion } from './invitaciones.entity';
import { Rol } from './rol.entity';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('increment')
	iduser?: number;

	@Column({ nullable: true })
	username?: string;

	@Column({ nullable: true })
	nombres: string;

	@Column({ nullable: true })
	apellidos: string;

	@Column({ nullable: true })
	hashedRt?: string;

	@Column({ nullable: true })
	email_user?: string;

	@Column({ nullable: true })
	telefono?: string;

	@Column({ nullable: true, select: false })
	password?: string;

	@Column({ nullable: true })
	token?: string;

	@Column({ nullable: true })
	image_profile?: string;

	@Column({ type: 'int', default: 1 })
	status?: number;

	@CreateDateColumn({
		name: 'date_created',
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
	})
	date_created: Date;

	@Column({ nullable: true })
	facebookID?: string;

	@Column({ nullable: true })
	googleID?: string;

	@Column({ type: 'int', default: 0, nullable: true })
	bids?: number;

	@Column({ type: 'int' })
	rolid?: number;

	@ManyToOne(() => Rol, rol => rol.users)
	@JoinColumn({ name: 'rolid' })
	rol?: Rol;

	@OneToMany(() => Pago, pago => pago.user)
	pagos?: Pago[];

	@OneToMany(() => Favorito, favorito => favorito.user)
	favoritos?: Favorito[];

	@OneToMany(() => Puja, puja => puja.user)
	pujas: Puja[];

	@OneToMany(() => Invitacion, invitacion => invitacion.userReferenced)
	referencedUsers: Invitacion[];

	@OneToOne(() => Invitacion, invitacion => invitacion.userInvited)
	invitedUser: Invitacion;
}
