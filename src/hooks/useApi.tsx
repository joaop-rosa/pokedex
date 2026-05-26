import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toInteger, upperCase, upperFirst } from "lodash";
import { URL_BASE_ENDPOINT } from "../contants/endpoints";
import { LAST_POKEMON_NUMBER } from "../contants/generations";
import { POKEMON_TYPES } from "../contants/types";
import type {
	MoveDetailed,
	PokemonDetailed,
	PokemonListItem,
	PokemonMoveDetailed,
	PokemonSpecies,
} from "../types/pokemon";

export const fetchMoveFn = async (moveUrl: string): Promise<MoveDetailed> => {
	const { data } = await axios.get(moveUrl);

	const moveMapped: MoveDetailed = {
		name: upperFirst(data.name),
		priority: !!data.priority,
		pp: data.pp,
		power: data.power,
		accuracy: data.accuracy,
		type: data.type.name,
		damageClass: upperFirst(data.damage_class.name),
		description:
			data.flavor_text_entries[
				data.flavor_text_entries.findLastIndex(
					(entry: { language: { name: string } }) =>
						entry.language.name === "en",
				)
			].flavor_text,
	};

	return moveMapped;
};

export const fetchTypesFn = async (): Promise<string[]> => {
	const response = await axios.get(`${URL_BASE_ENDPOINT}/type`);
	return response.data.results
		.map((type: { name: string }) => type.name)
		.filter((type: string) => Object.values(POKEMON_TYPES).includes(type));
};

export const fetchDetailedPokemonFn = async (
	pokemonName: string | number,
): Promise<PokemonDetailed> => {
	const response = await axios.get(
		`${URL_BASE_ENDPOINT}/pokemon/${pokemonName}`,
	);

	const abilitiesMapped = await Promise.all(
		response.data.abilities?.map(
			async (ability: {
				ability: { name: string; url: string };
				is_hidden: boolean;
			}) => {
				const { data: abilityData } = await axios.get(ability.ability.url);
				const abilityMapped = {
					effectDescription:
						abilityData.effect_entries[
							abilityData.effect_entries.findIndex(
								(entry: { language: { name: string } }) =>
									entry.language.name === "en",
							)
						]?.effect,
					effectShortDescription:
						abilityData.flavor_text_entries[
							abilityData.flavor_text_entries.findIndex(
								(entry: { language: { name: string } }) =>
									entry.language.name === "en",
							)
						].flavor_text,
					effectException: abilityData.effect_changes.length
						? abilityData.effect_changes[0].effect_entries[
								abilityData.effect_entries.findIndex(
									(entry: { language: { name: string } }) =>
										entry.language.name === "en",
								)
							].effect
						: null,
				};

				return {
					name: ability.ability.name,
					isHidden: ability.is_hidden,
					...abilityMapped,
				};
			},
		),
	);

	const movesMapped = response.data.moves.reduce(
		(
			acc: Record<string, PokemonMoveDetailed[]>,
			move: {
				move: { name: string; url: string };
				version_group_details: {
					level_learned_at: number;
					move_learn_method: { name: string };
				}[];
			},
		) => {
			const moveMapped: PokemonMoveDetailed = {
				name: upperFirst(move.move.name),
				url: move.move.url,
				level: move.version_group_details.at(-1).level_learned_at,
			};

			const method = upperCase(
				move.version_group_details.at(-1).move_learn_method.name,
			);

			if (!acc[method]) {
				acc[method] = [];
			}
			acc[method].push(moveMapped);

			return acc;
		},
		{} as Record<string, PokemonMoveDetailed[]>,
	);

	const detailsMapped: PokemonDetailed = {
		sprites: {
			front: response.data.sprites.other["official-artwork"].front_default,
			back: response.data.sprites.back_default,
			frontAnimated: response.data.sprites.other.showdown.front_default,
			backAnimated: response.data.sprites.other.showdown.back_default,
			frontAnimatedFemale: response.data.sprites.other.showdown.front_female,
			backAnimatedFemale: response.data.sprites.other.showdown.back_female,
			frontAnimatedShiny: response.data.sprites.other.showdown.front_shiny,
			backAnimatedShiny: response.data.sprites.other.showdown.back_shiny,
			frontAnimatedFemaleShiny:
				response.data.sprites.other.showdown.front_shiny_female,
			backAnimatedFemaleShiny:
				response.data.sprites.other.showdown.back_shiny_female,
			miniature: response.data.sprites.front_default,
			icon: response.data.sprites.front_default,
		},
		types: response.data.types.reduce(
			(acc: string[], type: { type: { name: string } }) => {
				acc.push(type.type.name);
				return acc;
			},
			[] as string[],
		),
		id: response.data.id,
		name: response.data.name,
		stats: response.data.stats.reduce(
			(
				acc: Record<string, number>,
				stat: { base_stat: number; stat: { name: string } },
			) => {
				acc[stat.stat.name] = stat.base_stat;
				return acc;
			},
			{} as Record<string, number>,
		),
		weight: (toInteger(response.data.weight) * 1000) / 10000,
		height: toInteger(response.data.height) * 10,
		abilities: abilitiesMapped,
		otherParams: response.data,
		moves: movesMapped,
	};

	return detailsMapped;
};

export const fetchPokemonsFullListFn = async (): Promise<PokemonListItem[]> => {
	const response = await axios.get(
		`${URL_BASE_ENDPOINT}/pokemon/?limit=${LAST_POKEMON_NUMBER}&offset=0`,
	);
	return response.data.results.map(
		(pokemon: { name: string; url: string }) => ({
			name: pokemon.name,
			id: toInteger(pokemon.url.match(/\/(\d+)\/$/)?.[1] || 0),
		}),
	);
};

export const fetchPokemonByTypeFn = async (
	selectedType: string[] = [],
): Promise<PokemonDetailed[]> => {
	const getPokemonListByType = async (type: string) => {
		const responseType1 = await axios.get(`${URL_BASE_ENDPOINT}/type/${type}`);

		return responseType1.data.pokemon
			.map(({ pokemon }: { pokemon: { name: string; url: string } }) => ({
				name: pokemon.name,
				id: toInteger(pokemon.url.match(/\/(\d+)\/$/)?.[1] || 0),
			}))
			.filter((pokemon: PokemonListItem) => pokemon.id <= LAST_POKEMON_NUMBER);
	};
	const pokemonType1ListMapped = await getPokemonListByType(selectedType[0]);

	if (selectedType.length === 1) {
		const pokemonListDetailed = await Promise.all(
			pokemonType1ListMapped.map(
				async (pokemon: PokemonListItem) =>
					await fetchDetailedPokemonFn(pokemon.id),
			),
		);
		return pokemonListDetailed;
	}

	const pokemonType2ListMapped = await getPokemonListByType(selectedType[1]);

	const pokemonListByTypeJoined = [
		...pokemonType1ListMapped,
		...pokemonType2ListMapped,
	].filter(
		(pokemon, index, self) =>
			index ===
			self.findIndex((selfPokemon) => selfPokemon.name === pokemon.name),
	);

	const pokemonListDetailed = await Promise.all(
		pokemonListByTypeJoined.map(
			async (pokemon) => await fetchDetailedPokemonFn(pokemon.id),
		),
	);

	return pokemonListDetailed.filter(
		(pokemon) =>
			pokemon?.types.includes(selectedType[0]) &&
			pokemon.types.includes(selectedType[1]),
	);
};

export const fetchPokemonSpeciesFn = async (
	pokemon: PokemonDetailed | PokemonListItem,
): Promise<PokemonSpecies> => {
	const response = await axios.get(
		`${URL_BASE_ENDPOINT}/pokemon-species/${pokemon.id}/`,
	);

	const description = response.data.flavor_text_entries;

	const varietiesMapped = await Promise.all(
		response.data.varieties.map(
			async (variation: { pokemon: { name: string; url: string } }) => {
				return await fetchDetailedPokemonFn(
					toInteger(variation.pokemon.url.match(/\/(\d+)\/$/)?.[1] || 0),
				);
			},
		),
	);

	const { data: evolutionLine } = await axios.get(
		response.data.evolution_chain.url,
	);

	type EvolutionNode = {
		evolves_to: EvolutionNode[];
		species: { name: string; url: string };
		evolution_details: { min_level: number }[];
	};

	async function evolutionLineMap(
		evolutionLine: EvolutionNode,
		minLevel?: number,
	): Promise<PokemonDetailed[]> {
		const pokemon = await fetchDetailedPokemonFn(
			toInteger(evolutionLine.species.url.match(/\/(\d+)\/$/)?.[1] || 0),
		);
		pokemon.evolutionLevel = minLevel;

		if (!evolutionLine.evolves_to.length) {
			return [pokemon];
		}

		return [
			pokemon,
			...(await Promise.all(
				evolutionLine.evolves_to.map((p: EvolutionNode) => {
					return evolutionLineMap(p, p.evolution_details?.[0]?.min_level);
				}),
			).then((res) => res.flat(Number.POSITIVE_INFINITY as 1))),
		];
	}

	const evolutionLineMapped = await evolutionLineMap(evolutionLine.chain);

	return {
		variations: varietiesMapped,
		evolutionLine: evolutionLineMapped as PokemonDetailed[],
		hasFemale: response.data.has_gender_differences,
		isLegendary: response.data.is_legendary,
		isMythical: response.data.is_mythical,
		description:
			description[
				description.findIndex(
					(entry: { language: { name: string } }) =>
						entry.language.name === "en",
				)
			].flavor_text,
	};
};

// --- REACT QUERY HOOKS ---

export function useMoveQuery(moveUrl: string | undefined) {
	return useQuery({
		queryKey: ["move", moveUrl],
		queryFn: () => {
			if (!moveUrl) throw new Error("Missing moveUrl");
			return fetchMoveFn(moveUrl);
		},
		enabled: !!moveUrl,
	});
}

export function useTypesQuery() {
	return useQuery({
		queryKey: ["pokemonTypes"],
		queryFn: fetchTypesFn,
	});
}

export function useDetailedPokemonQuery(
	pokemonName: string | number | undefined,
) {
	return useQuery({
		queryKey: ["pokemon", pokemonName],
		queryFn: () => {
			if (!pokemonName) throw new Error("Missing pokemonName");
			return fetchDetailedPokemonFn(pokemonName);
		},
		enabled: !!pokemonName,
	});
}

export function usePokemonsFullListQuery() {
	return useQuery({
		queryKey: ["pokemonFullList"],
		queryFn: fetchPokemonsFullListFn,
	});
}

export function usePokemonByTypeQuery(selectedType: string[]) {
	return useQuery({
		queryKey: ["pokemonByType", selectedType],
		queryFn: () => fetchPokemonByTypeFn(selectedType),
		enabled: selectedType.length > 0,
	});
}

export function usePokemonSpeciesQuery(
	pokemon: PokemonDetailed | PokemonListItem | undefined | null,
) {
	return useQuery({
		queryKey: ["pokemonSpecies", pokemon?.id],
		queryFn: () => {
			if (!pokemon) throw new Error("Missing pokemon");
			return fetchPokemonSpeciesFn(pokemon);
		},
		enabled: !!pokemon,
	});
}
