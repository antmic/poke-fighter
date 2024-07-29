export default function normalize(x: number, decimalPlaces: number): number {
	const xMin: number = -2.32;
	const xMax: number = 2.32;
	const normalized = ((x - xMin) / (xMax - xMin)) * 100;
	return parseFloat(normalized.toFixed(decimalPlaces));
}
