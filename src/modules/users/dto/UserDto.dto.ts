import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
	iduser?: number;
	username?: string;

	@IsNotEmpty()
	@IsString()
	nombres: string;

	apellidos?: string;

	telefono?: string;

	@IsEmail()
	email_user?: string;

	password?: string;

	rolid?: number;

	facebookID?: string;

	googleID?: string;

	image_profile?: string;

	useridReferenced?: number;
}
