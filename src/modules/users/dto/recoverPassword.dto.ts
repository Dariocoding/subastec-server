import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { PasswordDto } from './password.dto';
export class recoverPasswordDto extends PasswordDto {
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email_user: string;

	@IsString()
	@IsNotEmpty()
	token: string;

	@IsString()
	@IsNotEmpty()
	iduser: string;
}
