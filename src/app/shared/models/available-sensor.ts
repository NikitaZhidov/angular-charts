import { SensorType } from './sensor-type';
import { MeasurementUnit } from './unit';

export type AvailableSensor = {
	id: number;
	name: string;
	type: SensorType;
	unit: MeasurementUnit;
};
