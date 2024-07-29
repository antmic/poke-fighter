import { MutableRefObject } from 'react';
import { SearchResponse, SearchState } from '@/types/types';

const fetchHints = async (
	query: string,
	latestQuery: MutableRefObject<string>,
	controller: AbortController
): Promise<SearchState> => {
	if (query.length <= 1) {
		return {
			hints: [],
			message: null,
			isLoading: false,
		};
	}

	try {
		const response = await fetch(`/api/search-hints?query=${encodeURIComponent(query)}`, {
			signal: controller.signal,
		});

		if (!response.ok) throw new Error('Failed to fetch');

		const data: SearchResponse = await response.json();

		// Only update state if this is still the latest query
		if (latestQuery.current === query) {
			return {
				hints: data.hints,
				message: data.found ? null : 'No Pokémon Found.\nDid you mean:',
				isLoading: false,
			};
		}
	} catch (error) {
		if (error instanceof Error) {
			if (error.name !== 'AbortError') {
				console.error('Error fetching hints:', error);
				return {
					hints: [],
					message: 'Error fetching hints',
					isLoading: false,
				};
			}
		} else {
			console.error('Unexpected error:', error);
			return {
				hints: [],
				message: 'Unexpected error occurred',
				isLoading: false,
			};
		}
	}

	// Return a default state if the query is not the latest
	return {
		hints: [],
		message: null,
		isLoading: false,
	};
};

export default fetchHints;
