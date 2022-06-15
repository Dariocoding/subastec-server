import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('invitaciones')
export class Invitacion {
	@PrimaryGeneratedColumn('increment')
	idinvitacion: number;

	@ManyToOne(() => User, user => user.referencedUsers)
	@JoinColumn({ name: 'user_referenced_id' })
	userReferenced: string;

	@Column({ type: 'int', name: 'user_referenced_id' })
	userReferencedId: number;

	@OneToOne(() => User, user => user.referencedUsers)
	@JoinColumn({ name: 'user_invited_id' })
	userInvited: string;

	@Column('int')
	@Column({ name: 'user_invited_id' })
	userInvitedId: number;

	@CreateDateColumn({
		name: 'date_created',
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
	})
	date_created: Date;
}
