import { ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { SensorsDataService } from 'src/app/shared/services';
import { availableSensors } from 'src/app/shared/services/mock-data';
import { DashboardService } from '../../services';

import { DashboardRootComponent } from './dashboard-root.component';
import {
	_mockCards,
	mockDashboardService,
	refreshMockCards,
} from './dashboard-root.mock';

describe('DashboardRootComponent', () => {
	let component: DashboardRootComponent;
	let fixture: ComponentFixture<DashboardRootComponent>;

	let sensorDataService: SensorsDataService;

	const mockSensors = availableSensors;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [DashboardRootComponent],
			providers: [
				{
					provide: DashboardService,
					useValue: mockDashboardService,
				},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(DashboardRootComponent, {
				set: {
					changeDetection: ChangeDetectionStrategy.Default,
				},
			})
			.compileComponents();

		sensorDataService = TestBed.inject(SensorsDataService);
		refreshMockCards();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DashboardRootComponent);
		component = fixture.componentInstance;

		spyOn(sensorDataService, 'getAvailableSensors').and.returnValue(
			of(mockSensors)
		);

		fixture.detectChanges();

		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);

		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		component.filters.patchValue({
			start: yesterday,
			end: tomorrow,
		});
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should render cards', () => {
		const $dashboardCards = fixture.debugElement.queryAll(
			By.css('app-dashboard-card')
		);

		expect($dashboardCards.length).toBe(_mockCards.length);
	});

	it('should render dashboard body without cards if no sensors', () => {
		component.cards = [];

		fixture.detectChanges();

		const $dashboardCards = fixture.debugElement.queryAll(
			By.css('app-dashboard-card')
		);

		expect($dashboardCards.length).toBe(0);
	});

	it('should render add card button if cards less than max card count', () => {
		component.cards = _mockCards.slice(0, component.maxCardCount - 1);

		fixture.detectChanges();

		const $addCardButton = fixture.debugElement.query(By.css('div.add-card'));

		expect($addCardButton).toBeTruthy();
	});

	it('should not render add card button if cards more than or equal to max card count ', () => {
		Object.defineProperty(component, 'maxCardCount', {
			value: _mockCards.length,
		});

		fixture.detectChanges();

		const $addCardButton = fixture.debugElement.query(By.css('div.add-card'));

		expect($addCardButton).toBeFalsy();
	});

	it('should handle add card button click', () => {
		const event = spyOn(component, 'onAddCard');

		Object.defineProperty(component, 'maxCardCount', {
			value: _mockCards.length + 1,
		});

		const $addCardButton = fixture.debugElement.query(By.css('div.add-card'));

		$addCardButton.nativeElement.click();

		fixture.detectChanges();

		expect(event).toHaveBeenCalled();
	});

	// it can be encapsulated in date utils
	it('canShowCard should return true if card between start and end', () => {
		const card = _mockCards[0];

		card.date = new Date();

		expect(component.canShowCard(card)).toBeTrue();
	});

	it('canShowCard should return false if card before start', () => {
		const card = _mockCards[0];

		const dayBeforeYesterday = new Date();
		dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);

		card.date = dayBeforeYesterday;

		expect(component.canShowCard(card)).toBeFalse();
	});

	it('canShowCard should return false if card after end', () => {
		const card = _mockCards[0];

		const dayAfterTomorrow = new Date();
		dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

		card.date = dayAfterTomorrow;

		expect(component.canShowCard(card)).toBeFalse();
	});

	it('card should not render if date not between start and end', () => {
		const card = _mockCards[0];

		const dayBeforeYesterday = new Date();
		dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
		card.date = dayBeforeYesterday;

		const cards = [card];

		component.cards = cards;

		fixture.detectChanges();

		const $dashboardCard = fixture.debugElement.query(
			By.css('app-dashboard-card')
		);

		expect($dashboardCard).toBeFalsy();
	});

	it('card should render if date between start and end', () => {
		const card = _mockCards[0];
		card.date = new Date();

		const cards = [card];
		component.cards = cards;

		fixture.detectChanges();

		const $dashboardCard = fixture.debugElement.query(
			By.css('app-dashboard-card')
		);

		expect($dashboardCard).toBeTruthy();
	});

	it('clear filters should reset filters group form', () => {
		const event = spyOn(component.filters, 'reset');

		component.clearFilters();

		expect(event).toHaveBeenCalled();
	});
});
