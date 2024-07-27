// src/app/page.tsx

import Info from '@/components/Info';
import SearchBar from '@/components/SearchBar';

export default function Home() {
	return (
		<main>
			<SearchBar />
			<Info />
		</main>
	);
}
