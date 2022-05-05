import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
} from '@angular/core';
import { SensorsDataService } from 'src/app/shared/services';
import { debounceTime, map, startWith, switchMap, tap } from 'rxjs/operators';
import {
	BehaviorSubject,
	combineLatest,
	Observable,
	of,
	ReplaySubject,
} from 'rxjs';
import { AvailableSensor } from 'src/app/shared/models';
import {
	ChartData,
	ChartOptions,
	chartTypes,
} from 'src/app/shared/components/chart/chart.component';
import { getRandomColor } from 'src/app/shared/utils';
import { MockCard } from '../dashboard-root/dashboard-root.component';

@Component({
	selector: 'app-dashboard-card',
	templateUrl: './dashboard-card.component.html',
	styleUrls: ['./dashboard-card.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardCardComponent implements OnInit {
	@Input()
	cardInfo: MockCard = {
		id: Number(new Date()),
		date: new Date(),
		selectedSensorsIds: [],
		chartType: 'line',
		sensorsColors: [],
	};

	@Input()
	availableSensors: AvailableSensor[] = [];

	@Output()
	readonly remove = new EventEmitter<void>();

	@Output()
	readonly cardInfoUpdated = new EventEmitter<MockCard>();

	readonly sensorsColors = new Map<number, string>();

	readonly chartTypes = chartTypes;

	readonly loadingChart$ = new BehaviorSubject(false);

	readonly chartOptions: ChartOptions = {
		title: 'Sensors Info',
		xAxisLabel: 'Time',
		yAxisLabel: 'Value',
	};

	private readonly _selectedSensorsIds$ = new ReplaySubject<number[]>(1);

	readonly chartData$: Observable<ChartData[]> = this._selectedSensorsIds$.pipe(
		tap((sensors) => sensors?.length && this.loadingChart$.next(true)),
		debounceTime(350),
		startWith([]),
		switchMap((sensorsIds) =>
			sensorsIds?.length
				? // combineLatest allows to get data from all sensors
				  combineLatest(
						sensorsIds.map((id) =>
							// combineLatest allows to change color of chart
							combineLatest([
								this._sensorData.getSensorData(id),
								this._colorChanged$,
							]).pipe(
								tap(() => this.loadingChart$.next(false)),
								map(
									([sd]) =>
										<ChartData>{
											name: sd.sensor.name,
											data: sd.data.map((d) => [d.timestamp, d.value]),
											color: this.getColorBySensorId(id),
											id: sd.sensor.id.toString(),
										}
								)
							)
						)
				  )
				: of([]).pipe(tap(() => this.loadingChart$.next(false)))
		)
	);

	private readonly _colorChanged$ = new BehaviorSubject<null>(null);

	constructor(private readonly _sensorData: SensorsDataService) {}

	ngOnInit() {
		// remove unavailable sensors from selected sensors
		this.cardInfo.selectedSensorsIds = this.cardInfo.selectedSensorsIds.filter(
			(id) => this.availableSensors.map((s) => s.id).includes(id)
		);

		// extract sensor colors
		this.cardInfo.sensorsColors.forEach((sc) => {
			this.sensorsColors.set(sc.id, sc.color);
		});

		this._selectedSensorsIds$.next(this.cardInfo.selectedSensorsIds);
	}

	onCardInfoUpdated() {
		// update sensors colors
		this.cardInfo.sensorsColors = this.cardInfo.selectedSensorsIds.map(
			(id) => ({
				id,
				color: this.getColorBySensorId(id),
			})
		);

		this.cardInfoUpdated.emit(this.cardInfo);
	}

	onChangeSelectedSensorsIds(sensorsIds: number[]) {
		const availableSensorIds = sensorsIds.filter((id) => {
			const sensor = this.availableSensors.find((s) => s.id === id);
			return !!sensor;
		});

		this._selectedSensorsIds$.next(availableSensorIds);
		this.cardInfo.selectedSensorsIds = availableSensorIds;

		this.onCardInfoUpdated();
	}

	onChangeColor(sensor: AvailableSensor, event: Event) {
		const color = (event.target as HTMLInputElement).value;

		this.sensorsColors.set(sensor.id, color);

		this._colorChanged$.next(null);
		this.onCardInfoUpdated();
	}

	getColorBySensorId(sensorId: number): string {
		if (this.sensorsColors.has(sensorId)) {
			return this.sensorsColors.get(sensorId) || getRandomColor();
		}

		const color = getRandomColor();

		this.sensorsColors.set(sensorId, color);
		return color;
	}
}
