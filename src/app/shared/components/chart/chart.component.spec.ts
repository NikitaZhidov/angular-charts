import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartComponent, ChartData, ChartOptions } from './chart.component';

describe('ChartComponent', () => {
	let component: ChartComponent;
	let fixture: ComponentFixture<ChartComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ChartComponent],
			imports: [HighchartsChartModule],
		})
			.overrideComponent(ChartComponent, {
				set: {
					changeDetection: ChangeDetectionStrategy.Default,
				},
			})
			.compileComponents();
	});

	beforeEach((done) => {
		fixture = TestBed.createComponent(ChartComponent);
		component = fixture.componentInstance;

		component.options = {
			title: 'initialTitle',
			xAxisLabel: 'initialXAxisLabel',
			yAxisLabel: 'initialYAxisLabel',
		};

		component.type = 'line';

		fixture.detectChanges();

		component.chartInitialized$.subscribe(() => {
			done();
		});
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	// TODO: test updating all options
	// now i can't test it because I didn't find how to get new current xAxisLabel, yAxisLabel from chart instance

	it('should update type', () => {
		const data: ChartData[] = [
			{
				name: 'should update type',
				data: [[1, 2]],
				color: '#e2e2e2',
				id: '1',
			},
		];

		component.type = 'line';
		component.data = data;

		fixture.detectChanges();

		component.type = 'bar';

		fixture.detectChanges();

		component.chart?.series.forEach((s) => {
			expect(s.type).toBe('bar');
		});
	});

	it('should add data', () => {
		const data: ChartData[] = [
			{
				id: '1',
				name: 'should update data',
				data: [
					[13, 1],
					[2, 25],
					[73, 3],
				],
				color: '#e2e2e2',
			},
			{
				id: '2',
				name: 'should update data 2',
				data: [
					[12, 128],
					[922, 22],
					[23, 233],
				],
				color: '#ffffff',
			},
		];

		component.data = data;

		fixture.detectChanges();

		component.chart?.series.forEach((s, i) => {
			expect(s.name).toBe(data[i].name);
			expect(s.userOptions.id).toBe(data[i].id);
			expect(s.data.map((d) => [d.x, d.y])).toEqual(data[i].data);
			expect(s.data[0].color).toBe(data[i].color);
		});
	});

	it('should update data', () => {
		const data: ChartData[] = [
			{ id: '1', name: 'initData', data: [], color: '#e2e2e2' },
			{ id: '8', name: 'initData8', data: [], color: '#e2e282' },
		];

		component.data = data;

		fixture.detectChanges();

		expect(component.chart?.series.length).toBe(data.length);

		const newData: ChartData[] = [
			{ id: '1', name: 'newData', data: [[1, 2]], color: '#e2e2e2' },
			{ id: '2', name: 'newData', data: [[1, 2]], color: '#e2e2e2' },
		];

		component.data = newData;

		fixture.detectChanges();

		component.chart?.series.forEach((s, i) => {
			expect(s.name).toBe(newData[i].name);
			expect(s.userOptions.id).toBe(newData[i].id);
			expect(s.data.map((d) => [d.x, d.y])).toEqual(newData[i].data);
			expect(s.data[0].color).toBe(newData[i].color);
		});
	});
});
