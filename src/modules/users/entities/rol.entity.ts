import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('roles')
export class Rol {
	@PrimaryGeneratedColumn('increment')
	idrol: number;

	@Column()
	nombrerol: string;

	@OneToMany(() => User, user => user.rol)
	users?: User[];
}
