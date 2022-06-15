import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { FavoritosService } from './favoritos.service';
import { FavoritoDto } from './dto/favorito.dto';
import { GetCurrentUserId, Public } from '../auth/common/decorators';
import { Private } from '../auth/common/decorators/private.decorator';

@Controller('favoritos')
export class FavoritosController {
	constructor(private readonly favoritosService: FavoritosService) {}

	@Post()
	async create(@Body() dto: FavoritoDto, @GetCurrentUserId() currentUserId: number) {
		await this.favoritosService.create(currentUserId, dto);
		return { msg: 'Lo has guardado en favoritos correctamente!' };
	}

	@Get('findByUserId/:iduser')
	@Public()
	findByUserId(@Param('iduser') iduser: string) {
		return this.favoritosService.findByUserId(+iduser);
	}

	@Get('findByUser')
	findByUser(@GetCurrentUserId() currentUserId: number) {
		return this.favoritosService.findByUserId(currentUserId);
	}

	@Delete(':id')
	async remove(@Param('id') id: string, @GetCurrentUserId() currentUserId: number) {
		await this.favoritosService.remove(currentUserId, +id);
		return { msg: 'Lo has removido de favoritos correctamente!' };
	}
}
