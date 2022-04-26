import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { sharedComponents } from './components';
import { RouterModule } from '@angular/router';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
	declarations: [...sharedComponents],
	imports: [
		CommonModule,
		RouterModule,
		HighchartsChartModule,
		MatProgressSpinnerModule,
	],
	exports: [...sharedComponents],
})
export class SharedModule {}
