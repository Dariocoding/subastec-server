import { Global, Module } from '@nestjs/common';
import { FavoritosService } from './favoritos.service';
import { FavoritosController } from './favoritos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorito } from './entities';

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([Favorito])],
	controllers: [FavoritosController],
	providers: [FavoritosService],
})
export class FavoritosModule {}
