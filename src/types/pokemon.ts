export interface PokemonListItem {
	name: string;
	id: number;
}

export interface PokemonAbility {
	name: string;
	isHidden: boolean;
	effectDescription?: string;
	effectShortDescription?: string;
	effectException?: string | null;
}

export interface PokemonMoveDetailed {
	name: string;
	url: string;
	level: number;
}

export interface PokemonSprites {
	front: string | null;
	back: string | null;
	frontAnimated: string | null;
	backAnimated: string | null;
	frontAnimatedFemale: string | null;
	backAnimatedFemale: string | null;
	frontAnimatedShiny: string | null;
	backAnimatedShiny: string | null;
	frontAnimatedFemaleShiny: string | null;
	backAnimatedFemaleShiny: string | null;
	miniature: string | null;
	icon: string | null;
	battleFront: string | null;
	battleBack: string | null;
}

export interface PokemonDetailed {
	id: number;
	name: string;
	types: string[];
	weight: number;
	height: number;
	stats: Record<string, number>;
	abilities: PokemonAbility[];
	moves: Record<string, PokemonMoveDetailed[]>;
	sprites: PokemonSprites;
	otherParams: Record<string, unknown>;
	evolutionLevel?: number;
}

export interface PokemonSpecies {
	variations: PokemonDetailed[];
	evolutionLine: PokemonDetailed[];
	hasFemale: boolean;
	isLegendary: boolean;
	isMythical: boolean;
	description: string;
}

export interface MoveDetailed {
	name: string;
	priority: boolean;
	pp: number;
	power: number | null;
	accuracy: number | null;
	type: string;
	damageClass: string;
	description: string;
}
