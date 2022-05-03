import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { take } from 'rxjs/operators';
import { ChartType } from 'src/app/shared/components/chart/chart.component';
import { SensorsDataService } from 'src/app/shared/services';
import { DashboardService } from '../../services';

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
// TODO edit README

@Component({
	selector: 'app-dashboard-root',
	templateUrl: './dashboard-root.component.html',
	styleUrls: ['./dashboard-root.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardRootComponent implements OnInit {
	cards: MockCard[] = [];

	filters = new FormGroup({
		start: new FormControl(),
		end: new FormControl(),
	});

	readonly availableSensors$ = this._sensorData.getAvailableSensors();

	constructor(
		private _sensorData: SensorsDataService,
		private readonly _dashboardService: DashboardService
	) {}

	ngOnInit() {
		this._dashboardService
			.getCards()
			.pipe(take(1))
			.subscribe((cards) => {
				this.cards = cards;
			});
	}

	onUpdateCardInfo(card: MockCard) {
		this._dashboardService.updateCard(card).pipe(take(1)).subscribe();
	}

	onAddCard() {
		const newCard: MockCard = {
			id: Number(new Date()),
			date: this.filters.value.start || new Date(),
			selectedSensorsIds: [],
			chartType: 'line',
			sensorsColors: [],
		};

		this._dashboardService
			.addCard(newCard)
			.pipe(take(1))
			.subscribe((newCard) => this.cards.push(newCard));
	}

	onRemoveCard(id: number) {
		const cardIndex = this.cards.findIndex((card) => card.id === id);

		if (cardIndex > -1) {
			this._dashboardService
				.removeCard(this.cards[cardIndex])
				.pipe(take(1))
				.subscribe(() => {
					this.cards.splice(cardIndex, 1);
				});
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
