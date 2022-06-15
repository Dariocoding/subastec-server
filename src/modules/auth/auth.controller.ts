import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
	Put,
	BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from '../users/dto';
import { AuthDto, FacebookAuthDto, GoogleAuthDto } from './dto';
import { AtGuard, RtGuard } from './common/guards';
import { GetCurrentUser, GetCurrentUserId, Public } from './common/decorators';
import { UsersService } from '../users/users.service';
import { RUSER } from 'src/utils';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService, private usersService: UsersService) {}

	@Public()
	@Post('local/signup')
	@HttpCode(HttpStatus.CREATED)
	signupLocal(@Body() dto: UserDto) {
		dto.rolid = RUSER;
		return this.authService.signupLocal({ dto, isInvitation: false });
	}

	@Public()
	@Post('local/singup/invitado')
	@HttpCode(HttpStatus.CREATED)
	signUpInvitado(@Body() dto: UserDto) {
		dto.rolid = RUSER;
		return this.authService.signupLocal({ dto, isInvitation: true });
	}

	@Public()
	@Post('local/signin')
	@HttpCode(HttpStatus.OK)
	signInLocal(@Body() dto: AuthDto) {
		return this.authService.signInLocal(dto);
	}

	@Public()
	@Post('google/signin')
	@HttpCode(HttpStatus.OK)
	googleSignIn(@Body() GoogleAuthDto: GoogleAuthDto) {
		return this.authService.signInGoogle(GoogleAuthDto);
	}

	@Public()
	@Post('facebook/signin')
	@HttpCode(HttpStatus.OK)
	facebookSignIn(@Body() FacebookAuthDto: FacebookAuthDto) {
		return this.authService.signInFacebook(FacebookAuthDto);
	}

	@Delete('google/desvincular')
	@HttpCode(HttpStatus.OK)
	async googleDesvincular(@GetCurrentUserId() iduser: string) {
		await this.usersService.updateGoogleID(+iduser, null);
		return { msg: 'Has desvinculado exitosamente a Google en tu cuenta.' };
	}

	@Delete('facebook/desvincular')
	@HttpCode(HttpStatus.OK)
	async facebookDesvincular(@GetCurrentUserId() iduser: string) {
		await this.usersService.updateFacebookID(+iduser, null);
		return { msg: 'Has desvinculado exitosamente a Facebook en tu cuenta.' };
	}

	@Put('google/vincular')
	@HttpCode(HttpStatus.OK)
	async googleVincular(
		@GetCurrentUserId() iduser: string,
		@Body() GoogleAuthDto: GoogleAuthDto
	) {
		const user = await this.usersService.findByGoogleID(GoogleAuthDto.googleId);
		if (user)
			throw new BadRequestException(
				'Ya hay una cuenta vinculada con este Google'
			);
		await this.usersService.updateGoogleID(+iduser, GoogleAuthDto.googleId);
		return { msg: 'Has vinculado exitosamente a Google en tu cuenta.' };
	}

	@Put('facebook/vincular')
	@HttpCode(HttpStatus.OK)
	async facebookVincular(
		@GetCurrentUserId() iduser: string,
		@Body() FacebookAuthDto: FacebookAuthDto
	) {
		const user = await this.usersService.findByFacebookID(FacebookAuthDto.userID);
		if (user)
			throw new BadRequestException(
				'Ya hay una cuenta vinculada con este Facebook'
			);
		await this.usersService.updateFacebookID(+iduser, FacebookAuthDto.userID);
		return { msg: 'Has vinculado exitosamente a Facebook en tu cuenta.' };
	}

	@UseGuards(AtGuard)
	@Post('logout')
	@HttpCode(HttpStatus.OK)
	async logout(@GetCurrentUserId() iduser: string) {
		return this.authService.logout(+iduser);
	}

	@Public()
	@UseGuards(RtGuard)
	@Get('refresh')
	@HttpCode(HttpStatus.OK)
	async refreshToken(
		@GetCurrentUserId() iduser: number,
		@GetCurrentUser('refreshToken') refreshToken: string
	) {
		return await this.authService.refreshToken(+iduser, refreshToken);
	}
}
