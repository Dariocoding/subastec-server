import { IsString, IsNotEmpty } from 'class-validator';

export class PasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  passwordConfirm: string;
}
