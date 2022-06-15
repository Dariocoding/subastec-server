import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RUSER } from 'src/utils';
import { GetCurrentRolId } from '../auth/common/decorators';
import { PagosService } from '../pagos/pagos.service';
import { ProductosService } from '../productos/productos.service';
import { SubastasService } from '../subastas/subastas.service';
import { UsersService } from '../users/users.service';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
	constructor(
		private dashboardService: DashboardService,
		private usersService: UsersService,
		private productosService: ProductosService,
		private pagosService: PagosService,
		private subastasService: SubastasService
	) {}

	@Get('getTotalUsuarios')
	async getTotalUsuarios(@GetCurrentRolId() rolid: number) {
		this.usersService.verifyAdminByRolId(rolid);
		const total = await this.usersService.countByRol(RUSER);
		return { total };
	}

	@Get('getTotalProductos')
	async getTotalProductos(@GetCurrentRolId() rolid: number) {
		this.usersService.verifyAdminByRolId(rolid);
		const total = await this.productosService.countTotalProductos();
		return { total };
	}

	@Get('getTotalPagos')
	async getTotalPagos(@GetCurrentRolId() rolid: number) {
		this.usersService.verifyAdminByRolId(rolid);
		const total = await this.pagosService.countTotalPagos();
		return { total };
	}

	@Get('getTotalSubastas')
	async getTotalSubastas(@GetCurrentRolId() rolid: number) {
		this.usersService.verifyAdminByRolId(rolid);
		const total = await this.subastasService.countTotalSubastas();
		return { total };
	}

	@Get('findPaquetesBidPagoMes/:month/:year')
	async findPaquetesBidPagoMes(
		@GetCurrentRolId() rolid: number,
		@Param('month') month: string,
		@Param('year') year: string
	) {
		this.usersService.verifyAdminByRolId(rolid);
		return this.dashboardService.findPaquetesBidPagoMes(+month, +year);
	}

	@Get('findVentasMes/:month/:year')
	async findVentasMes(
		@GetCurrentRolId() rolid: number,
		@Param('month') month: string,
		@Param('year') year: string
	) {
		this.usersService.verifyAdminByRolId(rolid);
		return this.dashboardService.findVentasMes(+month, +year);
	}

	@Get('findVentasYear/:year')
	async findVentasYear(@GetCurrentRolId() rolid: number, @Param('year') year: string) {
		this.usersService.verifyAdminByRolId(rolid);
		return this.dashboardService.findVentasYear(+year);
	}

	@Get('findTopTenSubastasMasPujadas')
	async findTopTenSubastasMasPujadas(@GetCurrentRolId() rolid: number) {
		this.usersService.verifyAdminByRolId(rolid);
		return this.dashboardService.findTopTenSubastasMasPujadas();
	}
}
