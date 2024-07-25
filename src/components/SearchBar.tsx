// src/components/SearchBar.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
	const [searchTerm, setSearchTerm] = useState('');
	const router = useRouter();

	const handleSearch = async (event: FormEvent) => {
		event.preventDefault();

		// Make a request to your API to check if the Pokémon exists
		const response = await fetch(`/api/pokemon?name=${searchTerm}`);
		const data = await response.json();

		if (data.exists) {
			router.push(`/pokemon/${searchTerm.toLowerCase()}`);
		} else {
			router.push(`/pokemon/not-found`);
		}
	};

	return (
		<div>
			<h1>Search for a Pokémon</h1>
			<form onSubmit={handleSearch}>
				<input
					type='text'
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					placeholder='Enter Pokémon name'
				/>
				<button type='submit'>Search</button>
			</form>
		</div>
	);
}
