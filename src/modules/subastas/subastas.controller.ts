import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	DefaultValuePipe,
	ParseIntPipe,
} from '@nestjs/common';
import { GetCurrentRolId, Public } from '../auth/common/decorators';
import { CreateSubastasDto, UpdateSubastaDto } from './dto';
import { SubastasService } from './subastas.service';
import { UsersService } from '../users/users.service';
import { IsNull, Not } from 'typeorm';
@Controller('subastas')
export class SubastasController {
	constructor(private usersService: UsersService, private subastasService: SubastasService) {}

	@Get()
	getSubastas() {
		return this.subastasService.getSubastas();
	}

	@Get('subastasGanadoras')
	subastasGanadoras() {
		return this.subastasService.getSubastas({
			paqueteBidId: IsNull(),
			winnerUserId: Not(IsNull()),
		});
	}

	@Get('getLastFourSubastas')
	@Public()
	getLastFourtSubastas() {
		return this.subastasService.getLastFourtSubastas();
	}

	@Get('getSubastasByCategoriaId/:idcategoria')
	@Public()
	getSubastasByCategoriaId(
		@Param('idcategoria') idcategoria: number,
		@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
		@Query('limit', new DefaultValuePipe(6), ParseIntPipe) limit: number = 6
	) {
		return this.subastasService.getSubastasByCategoriaId(+idcategoria, page, limit);
	}

	@Get('getSubastasHome')
	@Public()
	getSubastasHome(
		@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
		@Query('limit', new DefaultValuePipe(6), ParseIntPipe) limit: number = 6
	) {
		return this.subastasService.getSubastasHome(page, limit);
	}

	@Get('getSubastasByPaqueteBids')
	@Public()
	getSubastasByPaqueteBids(
		@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
		@Query('limit', new DefaultValuePipe(6), ParseIntPipe) limit: number = 6
	) {
		return this.subastasService.getSubastasByPaqueteBids(page, limit);
	}

	@Get('/:idsubasta')
	@Public()
	getSubasta(@Param('idsubasta') idsubasta: string) {
		return this.subastasService.getSubasta(+idsubasta);
	}

	@Post()
	async crearSubasta(
		@GetCurrentRolId() currentUserRolId: number,
		@Body() subasta: CreateSubastasDto
	) {
		this.usersService.verifyAdminByRolId(currentUserRolId);
		const newSubasta = await this.subastasService.agregarSubasta(subasta);
		return { msg: 'Has creado la subasta con éxito', subasta: newSubasta };
	}

	@Put(':idsubasta')
	async editarSubasta(
		@GetCurrentRolId() currentUserRolId: number,
		@Body() data: UpdateSubastaDto,
		@Param('idsubasta') idsubasta: string
	) {
		this.usersService.verifyAdminByRolId(currentUserRolId);
		const updatedSubasta = await this.subastasService.editarSubasta(+idsubasta, data);
		return { msg: 'Has editado la subasta con éxito', subasta: updatedSubasta };
	}

	@Delete('/:idSubasta')
	async eliminarSubasta(
		@GetCurrentRolId() currentUserRolId: number,
		@Param('idSubasta') idsubasta: string
	) {
		this.usersService.verifyAdminByRolId(currentUserRolId);
		await this.subastasService.eliminarSubasta(+idsubasta);
		return { msg: 'Subasta eliminada con éxito' };
	}
}
