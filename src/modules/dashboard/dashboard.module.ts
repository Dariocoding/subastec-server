import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subasta } from '../subastas/entities';
import { Puja } from '../puja/entities/puja.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Subasta, Puja])],
	controllers: [DashboardController],
	providers: [DashboardService],
})
export class DashboardModule {}
