import { generateRandomInt, getRandomColor } from './random';

describe('Random utils', () => {
	it('generateRandomInt should return integer', () => {
		const from = 0;
		const to = 100000;

		const result = generateRandomInt(from, to);

		expect(Number.isInteger(result)).toBeTrue();
	});

	it('getRandomColor should return string in hex format', () => {
		const color = getRandomColor();

		expect(color.match(/#\b[0-9A-Fa-f]{6}\b/g)).toBeTruthy();
	});
});
