import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { sharedComponents } from './components';
import { RouterModule } from '@angular/router';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
	declarations: [...sharedComponents],
	imports: [CommonModule, RouterModule, HighchartsChartModule],
	exports: [...sharedComponents],
})
export class SharedModule {}
