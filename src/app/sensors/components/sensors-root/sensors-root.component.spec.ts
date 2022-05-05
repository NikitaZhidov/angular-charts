import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { SensorsDataService } from 'src/app/shared/services';
import { availableSensors } from 'src/app/shared/services/mock-data';

import { SensorsRootComponent } from './sensors-root.component';

describe('SensorsRootComponent', () => {
	let component: SensorsRootComponent;
	let fixture: ComponentFixture<SensorsRootComponent>;

	let service: SensorsDataService;

	const mockSensors = availableSensors;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SensorsRootComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();

		service = TestBed.inject(SensorsDataService);

		spyOn(service, 'getAvailableSensors').and.returnValue(of(mockSensors));
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SensorsRootComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should render title', () => {
		const $title = fixture.debugElement.query(By.css('h4.title'));
		expect($title?.nativeElement?.textContent).toContain('Available sensors');
	});

	it('should render sensor cards', () => {
		const $sensors = fixture.debugElement.queryAll(By.css('app-sensor-card'));

		expect($sensors.length).toBe(mockSensors.length);
	});

	it('should render sensors body without sensor cards if no sensors', () => {
		Object.defineProperty(component, 'availableSensors$', {
			value: of([]),
		});

		fixture.detectChanges();

		const $sensors = fixture.debugElement.queryAll(By.css('app-sensor-card'));

		expect($sensors.length).toBe(0);
	});
});
