export const generateRandomInt = (from: number, to: number) => {
	return Math.floor(Math.random() * (to - from + 1) + from);
};

export const getRandomColor = () => {
	const letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
		color += letters[generateRandomInt(0, 15)];
	}
	return color;
};
