import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as compression from 'compression';
import * as useragent from 'express-useragent';
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
    req.dispositivo = 'PC';
    req.session.useragent = {
      browser: req.useragent.browser ? req.useragent.browser : '',
      version: req.useragent.version ? req.useragent.version : '',
      os:
        req.useragent.os === 'unknown' || req.useragent.os
          ? 'Desconocido'
          : req.useragent.os,
      platform:
        req.useragent.platform === 'unknown' || !req.useragent.platform
          ? 'Desconocido'
          : req.useragent.platform,
      source: req.useragent.source ? req.useragent.source : '',
    };
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
