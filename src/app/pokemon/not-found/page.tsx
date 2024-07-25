// src/app/pokemon/not-found/page.tsx
import Navigation from '@/components/Navigation';
import SearchBar from '@/components/SearchBar';

export default function NotFound() {
	return (
		<div>
			<Navigation />
			<SearchBar />
			<h1>Pokémon Not Found</h1>
			<p>The Pokémon you are looking for does not exist.</p>
		</div>
	);
}
