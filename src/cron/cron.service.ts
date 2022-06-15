import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

type Fn = () => void;
@Injectable()
export class CronService {
	constructor(private schedulerRegistry: SchedulerRegistry) {}

	startCronJob(data: { date: string | Date; fn: Fn; name: string }) {
		const fechaPrueba = new Date();
		fechaPrueba.setSeconds(fechaPrueba.getSeconds() + 10);
		const job = new CronJob(
			/* data.date */ fechaPrueba,
			data.fn,
			null,
			true,
			'America/caracas'
		);
		this.schedulerRegistry.addCronJob(data.name, job);
	}

	#getCronJobs() {
		return this.schedulerRegistry.getCronJobs();
	}

	getCronJob(name: string) {
		const crons = this.#getCronJobs();
		return crons.get(name);
	}

	stopCronJob(name: string) {
		const crons = this.#getCronJobs();
		crons.delete(name);
	}
}
