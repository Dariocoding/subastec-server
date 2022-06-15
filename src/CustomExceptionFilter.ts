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
		console.log(exception);
		logger.log({ level: 'error', message: exception.message });

		const { httpAdapter } = this.httpAdapterHost;

		const ctx = host.switchToHttp();

		const httpStatus =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR;

		const responseBody = {
			statusCode: httpStatus,
			message: exception.message,
			error: exception.name,
		};

		httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
	}
}
