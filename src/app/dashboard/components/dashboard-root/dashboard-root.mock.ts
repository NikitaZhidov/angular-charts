import { Observable, of } from 'rxjs';
import { MockCard } from './dashboard-root.component';

export const _mockCards: MockCard[] = [
	{
		id: 0,
		date: new Date(),
		selectedSensorsIds: [0],
		chartType: 'line',
		sensorsColors: [
			{
				id: 0,
				color: '#8122A7',
			},
		],
	},
	{
		id: 1,
		date: new Date(),
		selectedSensorsIds: [1],
		chartType: 'bar',
		sensorsColors: [
			{
				id: 1,
				color: '#e2e2e2',
			},
		],
	},
];

export const refreshMockCards = () => {
	mockDashboardService.cards.splice(0, mockDashboardService.cards.length);

	_mockCards.forEach((m) => mockDashboardService.cards.push(m));
};

export const mockDashboardService = {
	cards: <MockCard[]>[],
	getCards(): Observable<MockCard[]> {
		return of(this.cards);
	},
	removeCard(cardId: number): Observable<null> {
		const cardIndex = this.cards.findIndex((card) => card.id === cardId);

		if (cardIndex !== -1) {
			this.cards.splice(cardIndex, 1);
		}

		return of(null);
	},
	addCard(card: MockCard): Observable<MockCard> {
		this.cards.push(card);

		return of(card);
	},
	updateCard(card: MockCard): Observable<MockCard> {
		const hasCard = this.cards.some((item) => item.id === card.id);

		if (!hasCard) {
			return this.addCard(card);
		}

		this.cards = this.cards.map((item) => {
			if (item.id === card.id) {
				return card;
			}

			return item;
		});

		return of(card);
	},
};
