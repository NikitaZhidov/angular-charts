import { AvailableSensor } from '../models/available-sensor';
import { SensorType } from '../models/sensor-type';
import { MeasurementUnit } from '../models/unit';

export const availableSensors: AvailableSensor[] = [
	{
		id: 0,
		name: 'Humidity sensor [1]',
		type: SensorType.Humidity,
		unit: MeasurementUnit.humidity,
	},
	{
		id: 1,
		name: 'Light sensor',
		type: SensorType.Light,
		unit: MeasurementUnit.lx,
	},
	{
		id: 2,
		name: 'Temperature sensor',
		type: SensorType.Temperature,
		unit: MeasurementUnit.celsius,
	},
	{
		id: 3,
		name: 'Humidity sensor [2]',
		type: SensorType.Humidity,
		unit: MeasurementUnit.humidity,
	},
];
