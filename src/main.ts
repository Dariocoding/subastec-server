import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as compression from 'compression';
import * as useragent from 'express-useragent';
import * as moment from 'moment-timezone';
moment.tz.setDefault('America/guayaquil');

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		bodyParser: true,
	});

	app.use(compression());
	app.useGlobalPipes(new ValidationPipe());
	app.useStaticAssets(join(__dirname, '..', 'public'), {
		index: false,
	});
	app.use(useragent.express());

	app.use(middleWareUserAgent);
	app.enableCors();
	await app.listen(process.env.PORT || 4000);
}
bootstrap();

function middleWareUserAgent(req, res, next) {
	if (!req.session?.useragent) {
		req.session = {};
		req.session.useragent_browser = req.useragent.browser ? req.useragent.browser : '';

		req.session.useragent_version = req.useragent.version ? req.useragent.version : '';

		req.session.useragent_os =
			req.useragent.os !== 'unknown' ? req.useragent.os : 'Desconocido';

		req.session.useragent_platform =
			req.useragent.plauseragent_platform !== 'unknown'
				? req.useragent.plauseragent_platform
				: 'Desconocido';
		req.session.useragent_source = req.useragent.source ? req.useragent.source : '';

		req.dispositivo = 'PC';
		if (req.useragent.isDesktop) {
			req.dispositivo = 'PC';
		} else if (req.useragent.isMobile) {
			req.dispositivo = 'SmartPhone';
		} else if (req.useragent.isTablet) {
			req.dispositivo = 'Tablet';
		} else if (req.useragent.isiPad) {
			req.dispositivo = 'iPad';
		}
	}
	return next();
}
