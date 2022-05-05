import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from 'src/app/shared/services';
import { MockCard } from '../components/dashboard-root/dashboard-root.component';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
	let mockCards: MockCard[] = [];

	let service: DashboardService;

	beforeEach(() => {
		// Imitate localStorage
		mockCards = [
			{
				id: 0,
				date: new Date(),
				selectedSensorsIds: [0, 3],
				chartType: 'bar',
				sensorsColors: [],
			},
			{
				id: 1,
				date: new Date(),
				selectedSensorsIds: [],
				chartType: 'line',
				sensorsColors: [],
			},
		];

		TestBed.configureTestingModule({
			providers: [
				DashboardService,
				{
					provide: LocalStorageService,
					useValue: <LocalStorageService>{
						getItem(key: string): string {
							return JSON.stringify(mockCards);
						},

						setItem(key: string, value: string): void {
							mockCards = JSON.parse(value);
						},
					},
				},
			],
		});

		service = TestBed.inject(DashboardService);
	});

	it('should be created', () => {
		const service: DashboardService = TestBed.get(DashboardService);
		expect(service).toBeTruthy();
	});

	it('should get cards', (done) => {
		service.getCards().subscribe((cards) => {
			expect(JSON.stringify(cards)).toEqual(JSON.stringify(mockCards));
			done();
		});
	});

	it('should return empty array if no cards', (done) => {
		mockCards = [];

		service.getCards().subscribe((cards) => {
			expect(JSON.stringify(cards)).toEqual(JSON.stringify([]));
			done();
		});
	});

	it('should remove card', (done) => {
		const prevLength = mockCards.length;
		const cardId = mockCards[0].id;

		service.removeCard(cardId).subscribe(() => {
			expect(mockCards.length).toBe(prevLength - 1);
			expect(mockCards.some((c) => c.id === cardId)).toBeFalse();
			done();
		});
	});

	it('should remove nothing if card not found', (done) => {
		const prevLength = mockCards.length;
		const cardId = 214;

		service.removeCard(cardId).subscribe(() => {
			expect(mockCards.length).toBe(prevLength);
			done();
		});
	});

	it('should update card', (done) => {
		const card = mockCards[0];

		card.selectedSensorsIds = [1, 2];
		card.chartType = 'line';

		service.updateCard(card).subscribe((updatedCard) => {
			expect(updatedCard.selectedSensorsIds).toEqual([1, 2]);
			expect(updatedCard.chartType).toBe('line');
			done();
		});
	});

	it('should add card while trying update not existing card', (done) => {
		const prevLength = mockCards.length;

		const card: MockCard = {
			id: 214,
			date: new Date(),
			selectedSensorsIds: [],
			chartType: 'line',
			sensorsColors: [],
		};

		service.updateCard(card).subscribe((updatedCard) => {
			expect(JSON.stringify(updatedCard)).toBe(JSON.stringify(mockCards[2]));
			expect(mockCards.length).toBe(prevLength + 1);
			done();
		});
	});

	it('should add card', (done) => {
		const prevLength = mockCards.length;

		const card: MockCard = {
			id: 2,
			date: new Date(),
			selectedSensorsIds: [],
			chartType: 'line',
			sensorsColors: [],
		};

		service.addCard(card).subscribe((addedCard) => {
			expect(addedCard.id).toBe(2);
			expect(mockCards.length).toBe(prevLength + 1);
			done();
		});
	});
});
