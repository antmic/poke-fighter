// components/Footer.tsx
'use client';

import React from 'react';
import styles from '@/styles/Footer.module.scss';

const Footer: React.FC = () => {
	return (
		<footer>
			<a
				className={styles.footer}
				href='https://github.com/antmic/poke-fighter'
				target='_blank'
				rel='noopener noreferrer'>
				<i className='nes-icon github'></i>
				<span>Check me out on GitHub!</span>
			</a>
		</footer>
	);
};

export default Footer;
