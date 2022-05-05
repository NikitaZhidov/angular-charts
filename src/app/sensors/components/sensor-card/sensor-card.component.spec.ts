import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MeasurementUnit, SensorType } from 'src/app/shared/models';

import { SensorCardComponent } from './sensor-card.component';

describe('SensorCardComponent', () => {
	let component: SensorCardComponent;
	let fixture: ComponentFixture<SensorCardComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SensorCardComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SensorCardComponent);
		component = fixture.componentInstance;

		component.sensor = {
			id: 0,
			type: SensorType.Light,
			name: 'Light',
			unit: MeasurementUnit.lx,
		};

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should render name', () => {
		const $name = fixture.debugElement.query(By.css('.name'));
		expect($name?.nativeElement?.textContent).toContain('Light');
	});

	it('should render sensor type', () => {
		const $properties = fixture.debugElement.queryAll(By.css('.property'));
		expect($properties[0]?.nativeElement?.textContent).toContain(
			SensorType.Light
		);
	});

	it('should render sensor measurement unit', () => {
		const $properties = fixture.debugElement.queryAll(By.css('.property'));
		expect($properties[1]?.nativeElement?.textContent).toContain(
			MeasurementUnit.lx
		);
	});

	it('should render empty element without children if sensor is not defined', () => {
		component.sensor = undefined;
		fixture.detectChanges();

		expect(fixture.debugElement.children.length).toBe(0);
	});
});
