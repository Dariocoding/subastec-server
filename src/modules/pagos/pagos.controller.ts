import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { GetCurrentUserId } from '../auth/common/decorators';
import { UsersService } from '../users/users.service';
import { CreatePagoDto } from './dto/create-pago.dto';

@Controller('pagos')
export class PagosController {
	constructor(
		private readonly pagosService: PagosService,
		private usersService: UsersService
	) {}

	@Post()
	async create(@Body() data: CreatePagoDto, @GetCurrentUserId() currentUserId: number) {
		await this.pagosService.create(currentUserId, data);
		return {
			msg: '¡Su pago se ha creado con éxito muchas gracias! <br/> Y se han acreditado a su cuenta los bids de una vez',
		};
	}

	@Get()
	async findAll(@GetCurrentUserId() currentUserId: number) {
		const { user, isAdmin } = await this.usersService.verifyAdmin(currentUserId, false);
		const userid = isAdmin ? null : user.iduser;
		return this.pagosService.findAll(userid);
	}

	@Get(':id')
	async findOne(@Param('id') id: string, @GetCurrentUserId() currentUserId: number) {
		const { user, isAdmin } = await this.usersService.verifyAdmin(currentUserId);
		const userid = isAdmin ? null : user.iduser;
		return this.pagosService.findOne(currentUserId, +id);
	}
}
