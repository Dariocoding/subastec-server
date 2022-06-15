import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { PaqueteBidsService } from './paquete-bids.service';
import { CreatePaqueteBidDto } from './dto/create-paquete-bid.dto';
import { UpdatePaqueteBidDto } from './dto/update-paquete-bid.dto';
import { UsersService } from 'src/modules/users/users.service';
import { GetCurrentRolId } from 'src/modules/auth/common/decorators';

@Controller('paquete-bids')
export class PaqueteBidsController {
	constructor(
		private readonly paqueteBidsService: PaqueteBidsService,
		private readonly usersService: UsersService
	) {}

	@Post()
	async create(
		@GetCurrentRolId() userRolId: number,
		@Body() createPaqueteBidDto: CreatePaqueteBidDto
	) {
		this.usersService.verifyAdminByRolId(userRolId);
		const paqueteBid = await this.paqueteBidsService.create(createPaqueteBidDto);
		return { msg: 'Haz creado un paquete de bid exitosamente', paqueteBid };
	}

	@Get()
	async findAll() {
		return this.paqueteBidsService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return this.paqueteBidsService.findOne(+id);
	}

	@Put(':id')
	async update(
		@GetCurrentRolId() userRolId: number,
		@Param('id') id: string,
		@Body() data: UpdatePaqueteBidDto
	) {
		this.usersService.verifyAdminByRolId(userRolId);
		const paqueteBid = await this.paqueteBidsService.update(+id, data);
		return { msg: 'Haz actualizado correctamente este paquete.', paqueteBid };
	}

	@Delete(':id')
	async remove(@GetCurrentRolId() userRolId: number, @Param('id') id: string) {
		this.usersService.verifyAdminByRolId(userRolId);
		await this.paqueteBidsService.remove(+id);
		return { msg: 'Haz eliminado este paquete exitosamente.' };
	}
}
