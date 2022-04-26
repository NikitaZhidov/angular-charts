import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ChartType } from 'src/app/shared/components/chart/chart.component';
import { SensorsDataService } from 'src/app/shared/services';

export type SensorColor = {
	id: number;
	color: string;
};

export type MockCard = {
	id: number;
	date: Date;
	selectedSensorsIds: number[];
	sensorsColors: SensorColor[];
	chartType: ChartType;
};

// TODO save card state

@Component({
	selector: 'app-dashboard-root',
	templateUrl: './dashboard-root.component.html',
	styleUrls: ['./dashboard-root.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardRootComponent {
	readonly cards: MockCard[] = [
		{
			id: Number(new Date()),
			date: new Date(),
			selectedSensorsIds: [2],
			chartType: 'line',
			sensorsColors: [],
		},
	];

	filters = new FormGroup({
		start: new FormControl(),
		end: new FormControl(),
	});

	readonly availableSensors$ = this._sensorData.getAvailableSensors();

	constructor(private _sensorData: SensorsDataService) {}

	onUpdateCardInfo(card: MockCard) {
		console.log(card);
	}

	onAddCard() {
		const newCard: MockCard = {
			id: Number(new Date()),
			date: this.filters.value.start || new Date(),
			selectedSensorsIds: [],
			chartType: 'line',
			sensorsColors: [],
		};

		this.cards.push(newCard);
	}

	onRemoveCard(id: number) {
		const cardIndex = this.cards.findIndex((card) => card.id === id);

		if (cardIndex > -1) {
			this.cards.splice(cardIndex, 1);
		}
	}

	canShowCard(card: MockCard) {
		const { start, end } = this.filters.value;

		if (start && end) {
			return card.date >= start && card.date <= end;
		}

		return true;
	}

	clearFilters() {
		this.filters.reset();
	}
}
