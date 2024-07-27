// components/Info.tsx

import React from 'react';
import styles from '@/styles/Info.module.scss';

const Info: React.FC = () => {
	return (
		<div className={styles.info}>
			<div className='nes-container is-rounded with-title'>
				<span className='title'>Info</span>
				<span>{`This app will help you find pokémon's weaknesses and how best to fight them.`}</span>
			</div>
		</div>
	);
};

export default Info;
