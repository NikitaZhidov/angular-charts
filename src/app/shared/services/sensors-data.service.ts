import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AvailableSensor, SensorType } from '../models';
import { generateRandomInt } from '../utils';
import { availableSensors } from './mock-data';

export type SensorReading = {
	value: number;
	timestamp: number;
};

export type SensorData = {
	sensor: AvailableSensor;
	data: SensorReading[];
};

@Injectable({
	providedIn: 'root',
})
export class SensorsDataService {
	getAvailableSensors(): Observable<AvailableSensor[]> {
		return of<AvailableSensor[]>(availableSensors);
	}

	getSensorData(
		sensorId: number,
		start: Date = new Date(Date.now() - 60 * 1000),
		durationInSeconds: number = 60
	): Observable<SensorData> {
		if (durationInSeconds < 0) {
			durationInSeconds = 0;
		}

		return new Observable<SensorData>((sub) => {
			const sensor = availableSensors.find((s) => s.id === sensorId);

			if (!sensor) {
				sub.error(new Error('Sensor not found'));
				return;
			}

			// Simulate data fetching
			setTimeout(() => {
				sub.next({
					sensor,
					data: this._generateMockSensorReading(
						sensor.type,
						start,
						durationInSeconds
					),
				});
				sub.complete();
			}, 50);
		});
	}

	private _generateMockSensorReading(
		type: SensorType,
		start: Date,
		durationInSeconds: number
	): SensorReading[] {
		const startTimestamp = start.getTime();

		switch (type) {
			case SensorType.Light:
				return new Array(durationInSeconds).fill(0).map((_, i) => {
					return {
						value: generateRandomInt(300, 400),
						timestamp: startTimestamp + 1000 * i,
					};
				});
			case SensorType.Temperature:
				return new Array(durationInSeconds).fill(0).map((_, i) => {
					return {
						value: generateRandomInt(5, 40),
						timestamp: startTimestamp + 1000 * i,
					};
				});
			case SensorType.Humidity:
				return new Array(durationInSeconds).fill(0).map((_, i) => {
					return {
						value: Math.random(),
						timestamp: startTimestamp + 1000 * i,
					};
				});
			default:
				break;
		}

		return [];
	}
}
