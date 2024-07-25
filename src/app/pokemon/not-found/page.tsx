// src/app/pokemon/not-found/page.tsx
import SearchBar from '@/components/SearchBar';

export default function NotFound() {
	return (
		<div>
			<SearchBar />
			<h1>Pokémon Not Found</h1>
			<p>The Pokémon you are looking for does not exist.</p>
		</div>
	);
}
