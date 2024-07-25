// components/Navigation.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const Navigation: React.FC = () => {
	const router = useRouter();

	const handleGoHome = () => {
		router.push('/');
	};

	return (
		<div>
			<button onClick={handleGoHome}>Home</button>
		</div>
	);
};

export default Navigation;
