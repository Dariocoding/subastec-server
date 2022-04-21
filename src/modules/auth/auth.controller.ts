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
import { Tokens } from './types/tokens.type';
import { AuthDto, FacebookAuthDto, GoogleAuthDto } from './dto';
import { AtGuard, RtGuard } from './common/guards';
import { GetCurrentUser, GetCurrentUserId, Public } from './common/decorators';
import { ApiBody, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService, private usersService: UsersService) {}

	@Public()
	@Post('local/signup')
	@HttpCode(HttpStatus.CREATED)
	@ApiBody({ type: UserDto })
	async signupLocal(@Body() dto: UserDto): Promise<Tokens> {
		dto.rolid = process.env.RUSUARIO;
		return await this.authService.signupLocal(dto);
	}

	@Public()
	@Post('local/signin')
	@HttpCode(HttpStatus.OK)
	async signInLocal(@Body() dto: AuthDto): Promise<Tokens> {
		return this.authService.signInLocal(dto);
	}

	@Public()
	@Post('google/signin')
	@HttpCode(HttpStatus.OK)
	async googleSignIn(@Body() GoogleAuthDto: GoogleAuthDto): Promise<Tokens> {
		return this.authService.signInGoogle(GoogleAuthDto);
	}

	@Public()
	@Post('facebook/signin')
	@HttpCode(HttpStatus.OK)
	async facebookSignIn(@Body() FacebookAuthDto: FacebookAuthDto): Promise<Tokens> {
		return this.authService.signInFacebook(FacebookAuthDto);
	}

	@Delete('google/desvincular')
	@HttpCode(HttpStatus.OK)
	async googleDesvincular(@GetCurrentUserId() userId: string): Promise<{ msg: string }> {
		await this.usersService.updateGoogleID(userId, null);
		return { msg: 'Has desvinculado exitosamente a Google en tu cuenta.' };
	}

	@Delete('facebook/desvincular')
	@HttpCode(HttpStatus.OK)
	async facebookDesvincular(@GetCurrentUserId() userId: string): Promise<{ msg: string }> {
		await this.usersService.updateFacebookID(userId, null);
		return { msg: 'Has desvinculado exitosamente a Facebook en tu cuenta.' };
	}

	@Put('google/vincular')
	@HttpCode(HttpStatus.OK)
	async googleVincular(
		@GetCurrentUserId() userId: string,
		@Body() GoogleAuthDto: GoogleAuthDto
	): Promise<{ msg: string }> {
		const user = await this.usersService.findByGoogleID(GoogleAuthDto.googleId);
		if (user)
			throw new BadRequestException(
				'Ya hay una cuenta vinculada con este Google'
			);
		await this.usersService.updateGoogleID(userId, GoogleAuthDto.googleId);
		return { msg: 'Has vinculado exitosamente a Google en tu cuenta.' };
	}

	@Put('facebook/vincular')
	@HttpCode(HttpStatus.OK)
	async facebookVincular(
		@GetCurrentUserId() userId: string,
		@Body() FacebookAuthDto: FacebookAuthDto
	): Promise<{ msg: string }> {
		const user = await this.usersService.findByFacebookID(FacebookAuthDto.userID);
		if (user)
			throw new BadRequestException(
				'Ya hay una cuenta vinculada con este Facebook'
			);
		await this.usersService.updateFacebookID(userId, FacebookAuthDto.userID);
		return { msg: 'Has vinculado exitosamente a Facebook en tu cuenta.' };
	}

	@UseGuards(AtGuard)
	@Post('logout')
	@HttpCode(HttpStatus.OK)
	async logout(@GetCurrentUserId() userId: string) {
		return this.authService.logout(userId);
	}

	@Public()
	@ApiBearerAuth()
	@UseGuards(RtGuard)
	@Get('refresh')
	@HttpCode(HttpStatus.OK)
	async refreshToken(
		@GetCurrentUserId() userId: string,
		@GetCurrentUser('refreshToken') refreshToken: string
	) {
		return await this.authService.refreshToken(userId, refreshToken);
	}
}
