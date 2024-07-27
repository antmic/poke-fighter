// components/Header.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/Header.module.scss';

const Header: React.FC = () => {
	const router = useRouter();

	const handleGoHome = () => {
		router.push('/');
	};

	return (
		<header className={styles.header} onClick={handleGoHome}>
			<i className={`nes-ash ${styles.icon}`}></i>
			<h1 className={styles.headerText}>Pokémon Weakness Finder</h1>
			<i className={`nes-pokeball ${styles.icon}`}></i>
		</header>
	);
};

export default Header;
