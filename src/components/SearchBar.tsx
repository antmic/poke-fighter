// components/SearchBar.tsx
'use client';

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

interface SearchResponse {
	hints: string[];
	found: boolean;
}

interface SearchState {
	hints: string[];
	message: string | null;
	isLoading: boolean;
}

export default function SearchBar() {
	const router = useRouter();
	const [query, setQuery] = useState<string>('');
	const [searchState, setSearchState] = useState<SearchState>({
		hints: [],
		message: null,
		isLoading: false,
	});

	const latestQuery = useRef(query);

	useEffect(() => {
		latestQuery.current = query;

		const controller = new AbortController();

		const fetchHints = async () => {
			if (query.length <= 1) {
				setSearchState({
					hints: [],
					message: null,
					isLoading: false,
				});
				return;
			}

			try {
				const response = await fetch(`/api/search-hints?query=${encodeURIComponent(query)}`, {
					signal: controller.signal,
				});

				if (!response.ok) throw new Error('Failed to fetch');

				const data: SearchResponse = await response.json();

				// Only update state if this is still the latest query
				if (latestQuery.current === query) {
					setSearchState({
						hints: data.hints,
						message: data.found ? null : 'No Pokémon Found. Did you mean:',
						isLoading: false,
					});
				}
			} catch (error) {
				if (error instanceof Error) {
					if (error.name !== 'AbortError') {
						console.error('Error fetching hints:', error);
						setSearchState({
							hints: [],
							message: 'Error fetching hints',
							isLoading: false,
						});
					}
				} else {
					console.error('Unexpected error:', error);
					setSearchState({
						hints: [],
						message: 'Unexpected error occurred',
						isLoading: false,
					});
				}
			}
		};

		const debounceTimer = setTimeout(() => {
			setSearchState(prev => ({ ...prev, isLoading: true }));
			fetchHints();
		}, 100);

		return () => {
			clearTimeout(debounceTimer);
			controller.abort();
		};
	}, [query]);

	const handleSearch = async (event: FormEvent) => {
		event.preventDefault();

		// Make a request to your API to check if the Pokémon exists
		const response = await fetch(`/api/pokemon?name=${query}`);
		const data = await response.json();

		if (data.exists) {
			router.push(`/pokemon/${query.toLowerCase()}`);
		} else {
			router.push(`/pokemon/not-found`);
		}
	};

	return (
		<div>
			<form onSubmit={handleSearch}>
				<input
					type='text'
					value={query}
					onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
					placeholder='Search Pokémon'
				/>
				<button type='submit'>Search</button>
			</form>
			{query.length > 1 && (
				<div>
					{searchState.isLoading && <p>Loading...</p>}
					{!searchState.isLoading && searchState.hints.length > 0 && (
						<>
							<p>{searchState.message}</p>
							<ul>
								{searchState.hints.map((hint, index) => (
									<li key={index} onClick={() => setQuery(hint)}>
										{hint}
									</li>
								))}
							</ul>
						</>
					)}
					{!searchState.isLoading && searchState.hints.length === 0 && <p>Error fetching hints.</p>}
				</div>
			)}
		</div>
	);
}
