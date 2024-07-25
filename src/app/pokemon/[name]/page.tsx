// src/app/pokemon/[name]/page.tsx
import Navigation from '@/components/Navigation';
import SearchBar from '@/components/SearchBar';
import pool from '@/lib/db';
import { notFound } from 'next/navigation';
import Image from 'next/image';

type PokemonPageProps = {
	params: { name: string };
};

function capitalize(str: string) {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function normalize(x: number, decimalPlaces: number): number {
	const xMin: number = -2.08;
	const xMax: number = 2.08;
	const normalized = ((x - xMin) / (xMax - xMin)) * 100;
	return parseFloat(normalized.toFixed(decimalPlaces));
}

export default async function PokemonPage({ params }: PokemonPageProps) {
	const name = decodeURIComponent(params.name);

	const result = await pool.query('SELECT * FROM pokemon WHERE name = $1', [name]);

	if (result.rows.length === 0) {
		notFound();
	}

	const pokemon = result.rows[0];

	interface Attacker {
		PokemonType: string[];
		AttackType: string;
		AttackEffectiveness: number;
		DamageReceived: number;
		Difference: number;
	}

	type AttackerGroup = Attacker[];

	interface Pokemon {
		number: number;
		name: string;
		image_url: string;
		type1: string;
		type2: string | null;
		optimalattackers: AttackerGroup[];
	}

	return (
		<div>
			<Navigation />
			<SearchBar />
			<h1>
				{pokemon.number} {capitalize(pokemon.name)}
			</h1>
			<Image src={pokemon.image_url} alt={pokemon.name} width={120} height={112} />
			<p>
				Type: {pokemon.type1} {pokemon.type2 && ` / ${pokemon.type2}`}
			</p>
			<ul>
				Best attackers:
				{pokemon?.optimalattackers?.map((attackerGroup: AttackerGroup, groupIndex: number) => (
					<div key={`group-${groupIndex}`}>
						<h3>
							Group {groupIndex + 1} - Effectiveness {normalize(attackerGroup[0].Difference, 2)}
						</h3>
						{attackerGroup.map((attacker: Attacker, index: number) => (
							<li key={`${groupIndex}-${index}`}>
								<p>
									Attacker type:&nbsp;
									{attacker.PokemonType[0]}
									{attacker.PokemonType[1] && ` / ${attacker.PokemonType[1]}`}
								</p>
								<p>Attack type:&nbsp;{attacker.AttackType}</p>
								<p>Attack effectiveness:&nbsp;{attacker.AttackEffectiveness}</p>
								<p>Damage received:&nbsp;{attacker.DamageReceived}</p>
								<p>Difference:&nbsp;{attacker.Difference}</p>
							</li>
						))}
					</div>
				))}
			</ul>
		</div>
	);
}
