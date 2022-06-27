import { createLogger, transports } from 'winston';

import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

const logger = createLogger({
	level: 'info',
	transports: [
		new transports.File({ filename: 'error.log', dirname: __dirname + './../log/' }),
	],
});

@Catch()
export class CustomExceptionsFilter implements ExceptionFilter {
	constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

	catch(exception: HttpException, host: ArgumentsHost) {
		const statusCode =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR;

		if (statusCode !== HttpStatus.FORBIDDEN && statusCode !== HttpStatus.UNAUTHORIZED) {
			if (process.env.NODE_ENV === 'development') {
				console.log(exception);
			}

			logger.log({
				level: 'error',
				message: exception.stack,
			});
		}

		const { httpAdapter } = this.httpAdapterHost;

		const ctx = host.switchToHttp();

		const responseBody = {
			statusCode,
			message: exception.message,
			error: exception.name,
		};

		httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
	}
}
