export interface SearchResponse {
	hints: string[];
	found: boolean;
}

export interface SearchState {
	hints: string[];
	message: string | null;
	isLoading: boolean;
}

export interface Attacker {
	PokemonType: string[];
	AttackType: string;
	AttackEffectiveness: number;
	DamageReceived: number;
	Difference: number;
}

export interface Attack {
	AttackType: string;
	AttackEffectiveness: number;
}

export type AttackerGroup = Attacker[];

export interface Pokemon {
	number: number;
	name: string;
	image_url: string;
	type1: string;
	type2: string | null;
	optimalattackers: AttackerGroup[];
	attacks: Attack[];
}

export type PokemonPageProps = {
	params: { name: string };
};
