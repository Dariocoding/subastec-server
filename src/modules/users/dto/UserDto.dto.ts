import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
	username?: string;

	@IsNotEmpty()
	@IsString()
	nombres: string;

	apellidos?: string;

	telefono?: string;

	@IsEmail()
	email_user?: string;

	password?: string;

	rolid?: string;

	facebookID?: string;

	googleID?: string;

	fotoperfil?: string;
}
