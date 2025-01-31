// components/SearchBar.tsx
'use client';

import { useState, useEffect, useRef, FormEvent, ChangeEvent, MutableRefObject } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/SearchBar.module.scss';
import capitalize from '@/utils/capitalize';
import fetchHints from '@/utils/fetchHints';
import { SearchState } from '@/types/types';

export default function SearchBar() {
	const router = useRouter();
	const [query, setQuery] = useState<string>('');
	const [searchState, setSearchState] = useState<SearchState>({
		hints: [],
		message: null,
		isLoading: false,
	});
	const [isQueryValid, setIsQueryValid] = useState<boolean>(false);
	const [selectedHintIndex, setSelectedHintIndex] = useState<number>(-1);
	const latestQuery = useRef(query);

	useEffect(() => {
		latestQuery.current = query;

		const controller = new AbortController();

		const debounceTimer = setTimeout(async () => {
			setSearchState(prev => ({ ...prev, isLoading: true }));
			const newState = await fetchHints(query, latestQuery, controller);
			setSearchState(newState);
			setIsQueryValid(() => newState.hints.some(hint => hint === query.toLowerCase()));
		}, 100);

		return () => {
			clearTimeout(debounceTimer);
			controller.abort();
		};
	}, [query]);

	const handleSearch = async (pokemonName: string) => {
		// Make a request to your API to check if the Pokémon exists
		const response = await fetch(`/api/pokemon?name=${pokemonName}`);
		const data = await response.json();

		if (data.exists) {
			router.push(`/pokemon/${pokemonName.toLowerCase()}`);
		} else {
			router.push(`/pokemon/not-found`);
		}
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault(); // Prevent the default form submission
		if (selectedHintIndex < 0 && isQueryValid) {
			handleSearch(query);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		switch (e.key) {
			case 'ArrowDown':
				setSelectedHintIndex(prevIndex => (prevIndex + 1) % searchState.hints.length);
				break;
			case 'ArrowUp':
				setSelectedHintIndex(prevIndex => (prevIndex - 1 + searchState.hints.length) % searchState.hints.length);
				break;
			case 'Enter':
				if (selectedHintIndex >= 0) {
					handleSearch(searchState.hints[selectedHintIndex]);
				}
				break;
			default:
				break;
		}
	};

	const handleButtonClick = () => {
		if (selectedHintIndex < 0 && isQueryValid) {
			handleSearch(query);
		} else if (selectedHintIndex >= 0) {
			handleSearch(searchState.hints[selectedHintIndex]);
		}
	};

	return (
		<div className={styles.searchBarWrapper}>
			<div className={`nes-container is-rounded ${styles.searchBar}`}>
				<form autoComplete='off' className={styles.form} onSubmit={handleSubmit}>
					<input
						name='searchForm'
						type='text'
						value={query}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
						placeholder='Pokémon name'
						className={`nes-pointer nes-input ${styles.input} ${searchState.message ? 'is-error' : ''} ${
							isQueryValid ? 'is-success' : ''
						}`}
						onKeyDown={handleKeyDown}
					/>
					<button
						type='button'
						className='nes-btn'
						onClick={() => {
							handleButtonClick();
						}}>
						Search
					</button>
				</form>
				<>
					{query.length > 1 && (
						<div className={styles.hintsWrapper}>
							<div className={`nes-balloon is-rounded ${styles.hintsBalloon}`}>
								{searchState.isLoading && <p>Loading...</p>}
								{!searchState.isLoading && searchState.hints.length > 0 && (
									<>
										{searchState.message && (
											<p className={`nes-text is-error ${styles.message}`}>{searchState.message}</p>
										)}
										<ul className={styles.list}>
											{searchState.hints.map((hint, index) => (
												<li
													className={`${styles.item} ${
														index === selectedHintIndex ? `${styles.selected} nes-text is-primary` : ''
													}`}
													key={index}
													onClick={() => handleSearch(hint)}>
													{capitalize(hint)}
												</li>
											))}
										</ul>
									</>
								)}
							</div>
						</div>
					)}
				</>
			</div>
		</div>
	);
}
