import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
	let service: LocalStorageService;

	beforeEach(() => {
		service = new LocalStorageService();
	});

	afterEach(() => {
		localStorage.clear();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should be able to get value', () => {
		localStorage.setItem('key', 'value');

		expect(service.getItem('key')).toBe('value');
	});

	it('should be able to set value', () => {
		service.setItem('key', 'value');
		expect(localStorage.getItem('key')).toBe('value');
	});

	it('should be able to remove value', () => {
		localStorage.setItem('key', 'value');
		service.removeItem('key');

		expect(localStorage.getItem('key')).toBeNull();
	});

	it('should return null if key does not exist', () => {
		expect(service.getItem('key')).toBeNull();
	});

	it('should remove nothing if key does not exist', () => {
		const prevValue = localStorage.getItem('key');

		service.removeItem('key');
		expect(localStorage.getItem('key')).toBe(prevValue);
	});
});
