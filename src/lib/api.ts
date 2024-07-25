export async function fetchPokemon() {
	const response = await fetch('/api/pokemon');
	if (!response.ok) {
		throw new Error('Failed to fetch pokemon');
	}
	return response.json();
}
