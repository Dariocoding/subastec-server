import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { GetCurrentUserId, Public } from '../auth/common/decorators';
import { SubastaDto } from './dto';
import { SubastasService } from './subastas.service';
import { UsersService } from '../users/users.service';
import { Subasta } from './interface';
@Controller('subastas')
export class SubastasController {
	constructor(private usersService: UsersService, private subastasService: SubastasService) {}

	@Public()
	@Get()
	async getSubastas(): Promise<Subasta[]> {
		return await this.subastasService.getSubastas();
	}

	@Public()
	@Get('/:idSubasta')
	async getSubasta(@Param('idSubasta') idSubasta: string): Promise<Subasta> {
		return await this.subastasService.getSubasta(idSubasta);
	}

	@Post()
	async crearSubasta(
		@GetCurrentUserId() currentUserId: string,
		@Body() subasta: SubastaDto
	): Promise<{ msg: string; subasta: Subasta }> {
		await this.usersService.verifyAdmin(currentUserId);
		console.log(typeof subasta.fechaFinalizacion, typeof subasta.fechaInicio);
		const newSubasta = await this.subastasService.agregarSubasta(subasta);
		return { msg: 'Has creado la subasta con éxito', subasta: newSubasta };
	}

	@Put()
	async editarSubasta(
		@GetCurrentUserId() currentUserId: string,
		@Body() subasta: SubastaDto
	): Promise<{ msg: string; subasta: Subasta }> {
		await this.usersService.verifyAdmin(currentUserId);
		const updatedSubasta = await this.subastasService.editarSubasta(subasta);
		return { msg: 'Has editado la subasta con éxito', subasta: updatedSubasta };
	}

	@Delete('/:idSubasta')
	async eliminarSubasta(
		@GetCurrentUserId() currentUserId: string,
		@Param('idSubasta') idSubasta: string
	): Promise<{ msg: string }> {
		await this.usersService.verifyAdmin(currentUserId);
		await this.subastasService.eliminarSubasta(idSubasta);
		return { msg: 'Subasta eliminada con éxito' };
	}
}
