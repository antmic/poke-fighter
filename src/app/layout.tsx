import type { Metadata } from 'next';
import 'nes.css/css/nes.min.css';
import { Press_Start_2P } from 'next/font/google';
import './globals.scss';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const pressStart2P = Press_Start_2P({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Pokémon Weakness Finder',
	description: 'Simple app to search for Pokémon and find their weaknesses',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body className={pressStart2P.className}>
				<Header />
				{children}
				<Footer />
			</body>
		</html>
	);
}
