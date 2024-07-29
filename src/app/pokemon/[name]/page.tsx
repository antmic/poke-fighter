// src/app/pokemon/[name]/page.tsx
import SearchBar from '@/components/SearchBar';
import pool from '@/lib/db';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import styles from '@/styles/PokemonPage.module.scss';
import capitalize from '@/utils/capitalize';

type PokemonPageProps = {
	params: { name: string };
};

function normalize(x: number, decimalPlaces: number): number {
	const xMin: number = -2.32;
	const xMax: number = 2.32;
	const normalized = ((x - xMin) / (xMax - xMin)) * 100;
	return parseFloat(normalized.toFixed(decimalPlaces));
}

export default async function PokemonPage({ params }: PokemonPageProps) {
	const name = decodeURIComponent(params.name);

	const result = await pool.query('SELECT * FROM pokemon WHERE name = $1', [name]);

	if (result.rows.length === 0) {
		notFound();
	}

	const pokemon: Pokemon = result.rows[0];

	interface Attacker {
		PokemonType: string[];
		AttackType: string;
		AttackEffectiveness: number;
		DamageReceived: number;
		Difference: number;
	}

	interface Attack {
		AttackType: string;
		AttackEffectiveness: number;
	}

	type AttackerGroup = Attacker[];

	interface Pokemon {
		number: number;
		name: string;
		image_url: string;
		type1: string;
		type2: string | null;
		optimalattackers: AttackerGroup[];
		attacks: Attack[];
	}

	return (
		<main>
			<SearchBar />
			<div className={styles.wrapper}>
				<div className={`nes-container is-rounded with-title ${styles.pokemonInfo}`}>
					<h3 className={styles.number}>{pokemon.number}</h3>
					<div className={styles.imageContainer}>
						<Image
							priority
							className={styles.image}
							src={pokemon.image_url}
							alt={pokemon.name}
							width={120}
							height={112}
						/>
					</div>
					<h1 className={styles.name}>{capitalize(pokemon.name)}</h1>
					<span className={styles.types}>
						Type:{' '}
						<span className={`nes-container is-rounded ${styles.type} ${styles[`type__${pokemon.type1}`]}`}>
							{pokemon.type1}
						</span>
						{pokemon.type2 && (
							<>
								{' / '}
								<span className={`nes-container is-rounded ${styles.type} ${styles[`type__${pokemon.type2}`]}`}>
									{pokemon.type2}
								</span>
							</>
						)}
					</span>
				</div>
				<div className={`nes-container is-rounded with-title ${styles.pokemonInfo}`}>
					<span className={`title ${styles.title}`}>Vulnerable to:</span>
					<ul>
						{pokemon?.attacks?.map((attack: Attack, index: number) => (
							<li className={`${styles.types} ${styles.attackWrapper}`} key={index}>
								<div
									className={`nes-container is-rounded ${styles.attack} ${styles.type} ${
										styles[`type__${attack.AttackType}`]
									}`}>
									<span>{attack.AttackType}</span>
									<span>{attack.AttackEffectiveness}</span>
								</div>
							</li>
						))}
					</ul>
				</div>
				<div className={`nes-container is-rounded with-title ${styles.pokemonInfo}`}>
					<span className={`title ${styles.title}`}>Best attackers:</span>
					{pokemon?.optimalattackers?.map((attackerGroup: AttackerGroup, groupIndex: number) => (
						<div className={styles.group} key={`group-${groupIndex}`}>
							<div className={styles.table}>
								<div className={styles.row}>
									<span>Rating:</span>
									<span>{normalize(attackerGroup[0].Difference, 2)}%</span>
								</div>
								<div className={styles.row}>
									<span>Attack:</span>
									<span>{attackerGroup[0].AttackEffectiveness}</span>
								</div>
								<div className={styles.row}>
									<span>Defense:</span>
									<span>-{attackerGroup[0].DamageReceived}</span>
								</div>
								<div className={styles.row}>
									<span>Difference:</span>
									<span>{attackerGroup[0].Difference}</span>
								</div>
							</div>
							<ul className={styles.table}>
								<div className={styles.row}>
									<span>Pokémon:</span>
									<span className={styles.textAlignEnd}>Attack:</span>
								</div>
								{attackerGroup.map((attacker: Attacker, index: number) => (
									<li className={styles.row} key={`${groupIndex}-${index}`}>
										<div className={styles.cell}>
											<div
												className={`nes-container is-rounded ${styles.type} ${
													styles[`type__${attacker.PokemonType[0]}`]
												}`}>
												{attacker.PokemonType[0]}
											</div>
											{attacker.PokemonType[1] && (
												<>
													<div>/</div>
													<div
														className={`nes-container is-rounded ${styles.type} ${
															styles[`type__${attacker.PokemonType[1]}`]
														}`}>
														{attacker.PokemonType[1]}
													</div>
												</>
											)}
										</div>
										<div className={styles.cell}>{'->'}</div>
										<div className={styles.cell}>
											<div
												className={`nes-container is-rounded ${styles.type} ${styles[`type__${attacker.AttackType}`]}`}>
												{attacker.AttackType}
											</div>
										</div>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>
		</main>
	);
}
