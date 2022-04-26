import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnInit,
} from '@angular/core';
import * as Highcharts from 'highcharts';
import { ReplaySubject } from 'rxjs';

import HC_map from 'highcharts/modules/map';
HC_map(Highcharts);

export type ChartData = {
	name: string;
	data: [number, number][];
	color: string;
	id: string;
};

export type ChartOptions = {
	title: string;
	xAxisLabel: string;
	yAxisLabel: string;
};

export const chartTypes = ['line', 'bar'] as const;

export type ChartType = typeof chartTypes[number];

// TODO - add tests
// TODO add second page

@Component({
	selector: 'app-chart',
	templateUrl: './chart.component.html',
	styleUrls: ['./chart.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements OnInit {
	private readonly _chartInitialized$ = new ReplaySubject<null>(1);

	private _data: ChartData[] = [];
	private _type: ChartType = 'line';

	private _options: ChartOptions = {
		title: '',
		xAxisLabel: '',
		yAxisLabel: '',
	};

	@Input()
	set options(newOptions: ChartOptions) {
		this._options = newOptions;
		this._updateChartOptions();
	}

	get options(): ChartOptions {
		return this._options;
	}

	@Input()
	set data(data: ChartData[]) {
		this._data = data;

		this._updateChartData();
	}

	get data(): ChartData[] {
		return this._data;
	}

	@Input()
	set type(type: ChartType) {
		this._type = type;

		this._updateChartType();
	}

	get type(): ChartType {
		return this._type;
	}

	@Input()
	set loading(isLoading: boolean) {
		if (this.chart) {
			if (isLoading) {
				this.chart.showLoading();
			} else {
				this.chart.hideLoading();
			}
		}
	}

	chart?: Highcharts.Chart;

	chartCallback: (chart: Highcharts.Chart) => void;

	update = false;

	// For SSR
	readonly isHighcharts = typeof Highcharts === 'object';
	readonly Highcharts = Highcharts;

	chartOptions: Highcharts.Options = {};

	constructor() {
		this.chartOptions = {
			plotOptions: {
				series: {
					pointStart: 0,
				},
			},
			mapNavigation: {
				enableMouseWheelZoom: true,
			},
			chart: {
				zoomType: 'xy',
			},
			xAxis: {
				labels: {
					format: '{value: %m/%d %H:%M:%S}',
				},
			},
			accessibility: {
				enabled: false,
			},
			tooltip: {
				useHTML: true,
				headerFormat: '<div>{point.x: %m/%d %H:%M:%S}</div>',
			},
			responsive: {
				rules: [
					{
						condition: {
							maxWidth: 500,
						},
						chartOptions: {
							title: {
								text: '',
							},
							yAxis: {
								title: {
									text: '',
								},
							},
							xAxis: {
								title: {
									text: '',
								},
							},
						},
					},
				],
			},
		};

		this.chartCallback = (chart: Highcharts.Chart) => {
			this.chart = chart;
			this._chartInitialized$.next(null);
			this._chartInitialized$.complete();
		};
	}

	ngOnInit() {
		this._chartInitialized$.subscribe(() => {
			this._updateChartOptions();
		});
	}

	private _updateChartData() {
		if (this.chart) {
			const newDataIds = this.data.map((d) => d.id);

			const dataIdsToDelete = this.chart.series
				.map((s) => s.options.id)
				.filter((id) => !newDataIds.includes(id || ''));

			while (dataIdsToDelete.length > 0) {
				const id = dataIdsToDelete.pop();

				for (let s of this.chart.series) {
					if (s.options.id === id) {
						s.remove();
						break;
					}
				}
			}

			const existingSeriesIds = this.chart.series.map((s) => s.options.id);

			const dataToUpdate = this.data.filter((d) =>
				existingSeriesIds.includes(d.id)
			);

			this.chart.series.forEach((s) => {
				const data = dataToUpdate.find((d) => d.id === s.options.id);
				if (data) {
					s.update({
						data: data.data,
						type: this.type,
						color: data.color,
						id: data.id,
						name: data.name,
					});
				}
			});

			const dataToAdd = this.data.filter(
				(d) => !existingSeriesIds.includes(d.id)
			);

			dataToAdd.forEach((data) => {
				if (this.chart) {
					this.chart.addSeries({
						name: data.name,
						data: data.data,
						type: this.type,
						color: data.color,
						id: data.id,
					});
				}
			});

			if (this.data) this.update = true;
		}
	}

	private _updateChartOptions() {
		if (this.chart) {
			this.chart.update({
				title: {
					text: this.options.title,
				},
				yAxis: {
					title: {
						text: this.options.yAxisLabel,
					},
				},
				xAxis: {
					title: {
						text: this.options.xAxisLabel,
					},
				},
			});

			this.update = true;
		}
	}

	private _updateChartType() {
		if (this.chart) {
			const seriesIdsToUpdate = this.chart.series.map((s) => s.userOptions.id);

			seriesIdsToUpdate.forEach((id) => {
				const series = this.chart?.series.find((s) => s.userOptions.id === id);

				if (series) {
					series.update({
						type: this.type,
					});
				}
			});

			this.update = true;
		}
	}
}
