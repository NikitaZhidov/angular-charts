import { SensorsDataService } from './sensors-data.service';
import { availableSensors } from './mock-data';
import { AvailableSensor } from '../models';

// Testing mock service
describe('SensorsDataService', () => {
	let service: SensorsDataService;

	let mockLightSensor: AvailableSensor;
	let mockHumiditySensor: AvailableSensor;
	let mockTemperatureSensor: AvailableSensor;

	beforeEach(() => {
		service = new SensorsDataService();

		mockHumiditySensor = availableSensors[0];
		mockLightSensor = availableSensors[1];
		mockTemperatureSensor = availableSensors[2];
	});

	afterEach(() => {
		localStorage.clear();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('getAvailableSensors should return mock available sensors', (done) => {
		service.getAvailableSensors().subscribe((sensors) => {
			expect(sensors).toEqual(availableSensors);
			done();
		});
	});

	it('getSensorData should return 60 sensors readings by default', (done) => {
		service.getSensorData(mockLightSensor.id).subscribe((data) => {
			expect(data.data.length).toBe(60);
			done();
		});
	});

	it('getSensorData should return the same number sensors readings as duration in seconds', (done) => {
		const durationInSeconds = 120;

		service
			.getSensorData(mockLightSensor.id, new Date(), durationInSeconds)
			.subscribe((data) => {
				expect(data.data.length).toBe(durationInSeconds);
				done();
			});
	});

	it('getSensorData should return sensors readings with correct timestamp', (done) => {
		const durationInSeconds = 120;

		const initialDate = new Date();

		service
			.getSensorData(mockLightSensor.id, initialDate, durationInSeconds)
			.subscribe((data) => {
				expect(
					data.data.some(
						(d, i) => initialDate.getTime() + i * 1000 !== d.timestamp
					)
				).toBeFalse();
				done();
			});
	});

	it('getSensorData should return empty array if duration equal to 0', (done) => {
		const durationInSeconds = 0;

		service
			.getSensorData(mockLightSensor.id, new Date(), durationInSeconds)
			.subscribe((data) => {
				expect(data.data.length).toBe(0);
				done();
			});
	});

	it('getSensorData should throw Error if sensor not found', (done) => {
		service.getSensorData(-1).subscribe(
			(data) => {
				expect(data.data.length).toBe(0);
				done();
			},
			(error) => {
				expect(error).toEqual(new Error('Sensor not found'));
				done();
			}
		);
	});

	it('getSensorData should return sensor readings values between 300 and 400 for light sensor', (done) => {
		const durationInSeconds = 120;

		service
			.getSensorData(mockLightSensor.id, new Date(), durationInSeconds)
			.subscribe((data) => {
				expect(
					data.data.some((d) => d.value < 300 || d.value > 400)
				).toBeFalse();
				done();
			});
	});

	it('getSensorData should return sensor readings values between 0 and 1 for humidity sensor', (done) => {
		const durationInSeconds = 120;

		service
			.getSensorData(mockHumiditySensor.id, new Date(), durationInSeconds)
			.subscribe((data) => {
				expect(data.data.some((d) => d.value < 0 || d.value > 1)).toBeFalse();
				done();
			});
	});

	it('getSensorData should return sensor readings values between 5 and 40 for temperature sensor', (done) => {
		const durationInSeconds = 120;

		service
			.getSensorData(mockTemperatureSensor.id, new Date(), durationInSeconds)
			.subscribe((data) => {
				expect(data.data.some((d) => d.value < 5 || d.value > 40)).toBeFalse();
				done();
			});
	});

	it('getSensorData should return empty array if duration less than 0', (done) => {
		const durationInSeconds = -20;

		service
			.getSensorData(mockLightSensor.id, new Date(), durationInSeconds)
			.subscribe((data) => {
				expect(data.data.length).toBe(0);
				done();
			});
	});
});
