import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types/tokens.type';
import { JwtService } from '@nestjs/jwt';
import { AuthDto, FacebookAuthDto, GoogleAuthDto } from './dto';
import { User } from '../users/user.interface';

@Injectable()
export class AuthService {
	constructor(private userService: UsersService, private jwtService: JwtService) {}

	async signupLocal(dto: UserDto): Promise<Tokens> {
		const user = await this.userService.createUser(dto);
		const tokens = await this.getTokens(user._id);
		await this.updateRtHash(user._id, tokens.refresh_token);
		return tokens;
	}

	async signInLocal(dto: AuthDto): Promise<Tokens> {
		let user: User;
		user = await this.userService.findByEmail(dto.username);
		if (!user) {
			user = await this.userService.findByUsername(dto.username);
			if (!user) throw new ForbiddenException('Usuario no encontrado');
		}
		const passwordMatches = await bcrypt.compare(dto.password, user.password);
		if (!passwordMatches) throw new ForbiddenException('Contraseña incorrecta');

		const tokens = await this.getTokens(user._id);
		await this.updateRtHash(user._id, tokens.refresh_token);
		return {
			...tokens,
			user: {
				nombres: user.nombres,
				apellidos: user.apellidos,
				email_user: user.email_user,
				fotoperfil: user.fotoperfil,
			},
		};
	}

	async signInGoogle(GoogleAuthDto: GoogleAuthDto): Promise<Tokens> {
		const googleID = GoogleAuthDto.googleId;
		const googleMail = GoogleAuthDto.email;
		const nombres = GoogleAuthDto.givenName;
		const apellidos = GoogleAuthDto.familyName;
		const fotoperfil = GoogleAuthDto.imageUrl;
		let user = await this.userService.findByGoogleID(googleID);
		if (user) {
			const tokens = await this.getTokens(user._id);
			await this.updateRtHash(user._id, tokens.refresh_token);
			return tokens;
		}
		user = await this.userService.findByEmail(googleMail);
		if (user) {
			const tokens = await this.getTokens(user._id);
			await this.updateRtHash(user._id, tokens.refresh_token);
			await this.userService.updateGoogleID(user._id, googleID);
			return tokens;
		}

		user = await this.userService.createUser({
			nombres,
			apellidos,
			email_user: googleMail,
			googleID,
			fotoperfil,
			rolid: process.env.RUSUARIO,
		});

		const tokens = await this.getTokens(user._id);
		await this.updateRtHash(user._id, tokens.refresh_token);
		return tokens;
	}

	async signInFacebook(FacebookAuthDto: FacebookAuthDto): Promise<Tokens> {
		const nombres = FacebookAuthDto.name;
		const facebookID = FacebookAuthDto.userID;
		let user = await this.userService.findByFacebookID(facebookID);
		if (user) {
			const tokens = await this.getTokens(user._id);
			await this.updateRtHash(user._id, tokens.refresh_token);
			return tokens;
		}
		user = await this.userService.createUser({
			nombres,
			facebookID,
			rolid: process.env.RUSUARIO,
		});
		const tokens = await this.getTokens(user._id);
		await this.updateRtHash(user._id, tokens.refresh_token);
		return tokens;
	}

	async logout(userId: string) {
		await this.userService.updateRtHash(userId, null);
	}

	async refreshToken(userId: string, rt: string) {
		const user = await this.userService.findById(userId, {
			hashedRt: 1,
		});

		if (!user || !user.hashedRt) throw new ForbiddenException('Usuario no encontrado');
		const rtMatches = await bcrypt.compare(rt, user.hashedRt);
		if (!rtMatches) throw new ForbiddenException('Access Denied');
		const tokens = await this.getTokens(user._id);
		delete user.hashedRt;
		await this.updateRtHash(user._id, tokens.refresh_token);
		return { ...tokens, user };
	}

	async getTokens(userId: string): Promise<Tokens> {
		const [at, rt] = await Promise.all([
			this.jwtService.signAsync(
				{ userId },
				{
					expiresIn: '1d',
					secret: process.env.ACCESS_TOKEN_SECRET,
				}
			),
			this.jwtService.signAsync(
				{ userId },
				{
					expiresIn: '7d',
					secret: process.env.REFRESH_TOKEN_SECRET,
				}
			),
		]);

		return { access_token: at, refresh_token: rt };
	}

	async updateRtHash(userId: string, rt: string) {
		const hash = await this.userService.hashData(rt);
		await this.userService.updateRtHash(userId, hash);
	}
}
