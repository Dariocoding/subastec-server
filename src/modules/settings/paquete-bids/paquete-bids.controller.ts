import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { PaqueteBidsService } from './paquete-bids.service';
import { CreatePaqueteBidDto } from './dto/create-paquete-bid.dto';
import { UpdatePaqueteBidDto } from './dto/update-paquete-bid.dto';
import { UsersService } from 'src/modules/users/users.service';
import { GetCurrentUserId } from 'src/modules/auth/common/decorators';
import { PaqueteBidControllerReturn } from './entities/paquete-bid-controller-return';
import { PaqueteBid } from './entities/paquete-bid.entity';
@Controller('paquete-bids')
export class PaqueteBidsController {
	constructor(
		private readonly paqueteBidsService: PaqueteBidsService,
		private readonly usersService: UsersService
	) {}

	@Post()
	async create(
		@GetCurrentUserId() userId: string,
		@Body() createPaqueteBidDto: CreatePaqueteBidDto
	): Promise<PaqueteBidControllerReturn> {
		await this.usersService.verifyAdmin(userId);
		const paqueteBid = await this.paqueteBidsService.create(createPaqueteBidDto);
		return { msg: 'Haz creado un paquete de bid exitosamente', paqueteBid };
	}

	@Get()
	async findAll(): Promise<PaqueteBid[]> {
		return this.paqueteBidsService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<PaqueteBid> {
		return this.paqueteBidsService.findOne(id);
	}

	@Put(':id')
	async update(
		@GetCurrentUserId() userId: string,
		@Param('id') id: string,
		@Body() updatePaqueteBidDto: UpdatePaqueteBidDto
	): Promise<PaqueteBidControllerReturn> {
		await this.usersService.verifyAdmin(userId);
		const paqueteBid = await this.paqueteBidsService.update(id, updatePaqueteBidDto);
		return { msg: 'Haz actualizado correctamente este paquete.', paqueteBid };
	}

	@Delete(':id')
	async remove(
		@GetCurrentUserId() userId: string,
		@Param('id') id: string
	): Promise<PaqueteBidControllerReturn> {
		await this.usersService.verifyAdmin(userId);
		await this.paqueteBidsService.remove(id);
		return { msg: 'Haz eliminado este paquete exitosamente.' };
	}
}
