// src/app/pokemon/not-found/page.tsx
import SearchBar from '@/components/SearchBar';
import styles from '@/styles/NotFound.module.scss';

export default function NotFound() {
	return (
		<main>
			<SearchBar />
			<div className={styles.notFound}>
				<h4>Pokémon Not Found</h4>
				<span>The Pokémon you are looking for does not exist.</span>
			</div>
		</main>
	);
}
