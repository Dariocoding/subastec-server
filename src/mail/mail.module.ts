import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
	imports: [
		MailerModule.forRootAsync({
			useFactory: (config: ConfigService) => ({
				transport: {
					host: config.get('EMAIL_APP_HOST'),
					port: parseInt(config.get('EMAIL_APP_PORT')),
					secure: true, // true for 465, false for other ports
					auth: {
						user: config.get('EMAIL_APP_USER'), // generated ethereal user
						pass: config.get('EMAIL_APP_PASS'), // generated ethereal password
					},
				},
				template: {
					dir: __dirname + '/templates/',
					adapter: new HandlebarsAdapter(),
					options: {
						strict: true,
					},
				},
			}),
			inject: [ConfigService],
		}),
	],
	providers: [MailService],
	exports: [MailService],
})
export class MailModule {}
