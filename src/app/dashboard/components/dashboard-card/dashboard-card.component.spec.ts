import {
	ChangeDetectionStrategy,
	CUSTOM_ELEMENTS_SCHEMA,
	NO_ERRORS_SCHEMA,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { availableSensors } from 'src/app/shared/services/mock-data';
import { SensorColor } from '../dashboard-root/dashboard-root.component';

import { DashboardCardComponent } from './dashboard-card.component';

describe('DashboardCardComponent', () => {
	let component: DashboardCardComponent;
	let fixture: ComponentFixture<DashboardCardComponent>;

	const mockAvailableSensors = availableSensors;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [DashboardCardComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
		})
			.overrideComponent(DashboardCardComponent, {
				set: {
					changeDetection: ChangeDetectionStrategy.Default,
				},
			})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DashboardCardComponent);
		component = fixture.componentInstance;

		component.availableSensors = mockAvailableSensors;

		component.cardInfo = {
			id: 1,
			date: new Date(),
			selectedSensorsIds: [],
			chartType: 'line',
			sensorsColors: [],
		};

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should emit remove event when remove button was clicked', () => {
		const event = spyOn(component.remove, 'emit');
		const $removeBtn = fixture.debugElement.query(By.css('.remove-card-btn'));

		$removeBtn.nativeElement.dispatchEvent(new Event('click'));

		expect(event).toHaveBeenCalled();
	});

	it('should render all selected available sensors', () => {
		const sensorsToSelect = [mockAvailableSensors[0], mockAvailableSensors[1]];
		const selectedSensorsIds = sensorsToSelect.map((sensor) => sensor.id);
		component.onChangeSelectedSensorsIds(selectedSensorsIds);

		fixture.detectChanges();

		const $sensors = fixture.debugElement.queryAll(By.css('.sensor-item'));

		expect($sensors.length).toBe(selectedSensorsIds.length);

		$sensors.forEach(($s, i) => {
			expect($s.nativeElement.textContent).toBe(sensorsToSelect[i].name);
		});
	});

	it('should update selected sensors', () => {
		const selectedSensorsIds = [
			mockAvailableSensors[0].id,
			mockAvailableSensors[1].id,
		];
		component.onChangeSelectedSensorsIds(selectedSensorsIds);

		fixture.detectChanges();

		expect(component.cardInfo.selectedSensorsIds).toEqual(selectedSensorsIds);
	});

	it('sensor input with type color should update sensors colors', () => {
		const sensor = component.availableSensors[0];
		const color = '#e2e2e2';

		component.availableSensors = [sensor];
		component.onChangeSelectedSensorsIds([sensor.id]);

		fixture.detectChanges();

		const $colorInput = fixture.debugElement.query(
			By.css('.sensor-item input')
		);

		const changeEvent = new InputEvent('change');

		$colorInput.nativeElement.value = color;
		$colorInput.nativeElement.dispatchEvent(changeEvent);

		expect(component.cardInfo.sensorsColors[0].color).toEqual(color);
	});

	it('getColorBySensorId should return sensor color', () => {
		const sensor = component.availableSensors[0];
		const color = '#e2e2e2';

		const mockInputEvent = {
			target: {
				value: color,
			},
		};

		component.onChangeColor(sensor, mockInputEvent as any);

		expect(color).toEqual(component.getColorBySensorId(sensor.id));
	});

	it('getColorBySensorId should generate and create new sensor color if sensor color is not found', () => {
		const sensor = component.availableSensors[0];

		const color = component.getColorBySensorId(sensor.id);

		expect(color).toEqual(component.getColorBySensorId(sensor.id));
	});

	it('getColorBySensorId should return string in hex format', () => {
		const sensor = component.availableSensors[0];
		const color = component.getColorBySensorId(sensor.id);

		expect(color.match(/#\b[0-9A-Fa-f]{6}\b/g)).toBeTruthy();
	});

	it('onChangeSelectedSensorsIds should remove unavailable selected sensors', () => {
		const availableSensorIds = [
			mockAvailableSensors[0].id,
			mockAvailableSensors[1].id,
		];

		const unavailableSensorIds = [40, 50, 60];
		const selectedSensorsIds = [...availableSensorIds, ...unavailableSensorIds];

		component.onChangeSelectedSensorsIds(selectedSensorsIds);

		fixture.detectChanges();

		expect(component.cardInfo.selectedSensorsIds).toEqual(availableSensorIds);
	});

	it('component should remove unavailable selected sensors in ngOnInit method', () => {
		const availableSensorIds = [
			mockAvailableSensors[0].id,
			mockAvailableSensors[1].id,
		];

		const unavailableSensorIds = [40, 50, 60];
		const selectedSensorsIds = [...availableSensorIds, ...unavailableSensorIds];

		component.cardInfo.selectedSensorsIds = selectedSensorsIds;

		component.ngOnInit();

		fixture.detectChanges();

		expect(component.cardInfo.selectedSensorsIds).toEqual(availableSensorIds);
	});

	it('component should extract extract sensors color in ngOnInit method', () => {
		const availableSensorIds = [
			mockAvailableSensors[0].id,
			mockAvailableSensors[1].id,
		];

		const colors = ['#e2e2e2', '#dfdfdf'];

		const sensorColors: SensorColor[] = [
			{
				id: mockAvailableSensors[0].id,
				color: colors[0],
			},
			{
				id: mockAvailableSensors[1].id,
				color: colors[1],
			},
		];

		component.cardInfo.sensorsColors = sensorColors;

		component.ngOnInit();

		expect(component.getColorBySensorId(availableSensorIds[0])).toEqual(
			colors[0]
		);
		expect(component.getColorBySensorId(availableSensorIds[1])).toEqual(
			colors[1]
		);
	});
});
