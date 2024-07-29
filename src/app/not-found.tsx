// src/app/not-found.tsx
'use client';
import styles from '@/styles/NotFound.module.scss';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
	const router = useRouter();

	useEffect(() => {
		setTimeout(() => {
			router.replace('/');
		}, 3000);
	}, [router]);

	return (
		<main>
			<div className={styles.notFound}>
				<h4>This page does not exist.</h4>
				<span>Redirecting to home page...</span>
			</div>
		</main>
	);
}
