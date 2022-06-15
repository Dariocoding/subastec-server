import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types/tokens.type';
//@ts-ignore
import { JwtService } from '@nestjs/jwt';
import { AuthDto, FacebookAuthDto, GoogleAuthDto } from './dto';
import { User } from '../users/entities';
import { RUSER } from 'src/utils';

@Injectable()
export class AuthService {
	constructor(private userService: UsersService, private jwtService: JwtService) {}

	async signupLocal(data: { dto: UserDto; isInvitation: boolean }) {
		const user = data.isInvitation
			? await this.userService.createUserByInvitacion(data.dto)
			: await this.userService.createUser(data.dto);
		const tokens = await this.getTokens(user);
		await this.updateRtHash(user.iduser, tokens.refresh_token);
		return tokens;
	}

	async signInLocal(dto: AuthDto) {
		let user: User;
		user = await this.userService.findByEmail(dto.username);
		if (!user) {
			user = await this.userService.findByUsername(dto.username);
			if (!user) throw new ForbiddenException('Usuario no encontrado');
		}
		const passwordMatches = await bcrypt.compare(dto.password, user.password);
		if (!passwordMatches) throw new ForbiddenException('Contraseña incorrecta');

		const tokens = await this.getTokens(user);
		await this.updateRtHash(user.iduser, tokens.refresh_token);
		return {
			...tokens,
			user: {
				nombres: user.nombres,
				apellidos: user.apellidos,
				email_user: user.email_user,
				image_profile: user.image_profile,
			},
		};
	}

	async signInGoogle(GoogleAuthDto: GoogleAuthDto) {
		const googleID = GoogleAuthDto.googleId;
		const googleMail = GoogleAuthDto.email;
		const nombres = GoogleAuthDto.givenName;
		const apellidos = GoogleAuthDto.familyName;
		const image_profile = GoogleAuthDto.imageUrl;
		let user = await this.userService.findByGoogleID(googleID);
		if (user) {
			const tokens = await this.getTokens(user);
			await this.updateRtHash(user.iduser, tokens.refresh_token);
			return tokens;
		}
		user = await this.userService.findByEmail(googleMail);
		if (user) {
			const tokens = await this.getTokens(user);
			await this.updateRtHash(user.iduser, tokens.refresh_token);
			await this.userService.updateGoogleID(user.iduser, googleID);
			return tokens;
		}

		user = await this.userService.createUser({
			nombres,
			apellidos,
			email_user: googleMail,
			googleID,
			image_profile,
			rolid: RUSER,
		});

		const tokens = await this.getTokens(user);
		await this.updateRtHash(user.iduser, tokens.refresh_token);
		return tokens;
	}

	async signInFacebook(FacebookAuthDto: FacebookAuthDto) {
		const nombres = FacebookAuthDto.name;
		const facebookID = FacebookAuthDto.userID;
		let user = await this.userService.findByFacebookID(facebookID);
		if (user) {
			const tokens = await this.getTokens(user);
			await this.updateRtHash(user.iduser, tokens.refresh_token);
			return tokens;
		}
		user = await this.userService.createUser({
			nombres,
			facebookID,
			rolid: RUSER,
		});
		const tokens = await this.getTokens(user);
		await this.updateRtHash(user.iduser, tokens.refresh_token);
		return tokens;
	}

	async logout(userId: number) {
		await this.userService.updateRtHash(userId, null);
	}

	async refreshToken(iduser: number, rt: string) {
		const user = await this.userService.findById(iduser);

		if (!user || !user.hashedRt) throw new ForbiddenException('Usuario no encontrado');
		const rtMatches = await bcrypt.compare(rt, user.hashedRt);
		if (!rtMatches) throw new ForbiddenException('Access Denied');
		const tokens = await this.getTokens(user);
		delete user.hashedRt;
		await this.updateRtHash(user.iduser, tokens.refresh_token);
		return { ...tokens, user };
	}

	async getTokens(user: User) {
		console.log(user);
		const [at, rt] = await Promise.all([
			this.jwtService.signAsync(
				{ iduser: user.iduser, rolid: user.rolid },
				{
					expiresIn: '1h',
					secret: process.env.ACCESS_TOKEN_SECRET,
				}
			),
			this.jwtService.signAsync(
				{ iduser: user.iduser, rolid: user.rolid },
				{
					expiresIn: '7d',
					secret: process.env.REFRESH_TOKEN_SECRET,
				}
			),
		]);

		return { access_token: at, refresh_token: rt };
	}

	async updateRtHash(iduser: number, rt: string) {
		const hash = await this.userService.hashData(rt);
		await this.userService.updateRtHash(iduser, hash);
	}
}
