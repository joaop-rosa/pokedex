import axios from "axios";
import { toInteger, upperCase, upperFirst } from "lodash";
import { useCallback } from "react";
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

export function useApi() {
	const fetchMove = useCallback(
		async (moveUrl: string): Promise<MoveDetailed> => {
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
							// biome-ignore lint/suspicious/noExplicitAny: PokeAPI response is complex
							(entry: any) => entry.language.name === "en",
						)
					].flavor_text,
			};

			return moveMapped;
		},
		[],
	);

	const fetchTypes = useCallback(async (): Promise<string[]> => {
		const response = await axios.get(`${URL_BASE_ENDPOINT}/type`);
		return response.data.results
			.map((type: { name: string }) => type.name)
			.filter((type: string) => Object.values(POKEMON_TYPES).includes(type));
	}, []);

	const fetchDetailedPokemon = useCallback(
		async (pokemonName: string | number): Promise<PokemonDetailed> => {
			const response = await axios.get(
				`${URL_BASE_ENDPOINT}/pokemon/${pokemonName}`,
			);

			const abilitiesMapped = await Promise.all(
				// biome-ignore lint/suspicious/noExplicitAny: PokeAPI response
				response.data.abilities?.map(async (ability: any) => {
					const { data: abilityData } = await axios.get(ability.ability.url);
					const abilityMapped = {
						effectDescription:
							abilityData.effect_entries[
								abilityData.effect_entries.findIndex(
									// biome-ignore lint/suspicious/noExplicitAny: PokeAPI response
									(entry: any) => entry.language.name === "en",
								)
							]?.effect,
						effectShortDescription:
							abilityData.flavor_text_entries[
								abilityData.flavor_text_entries.findIndex(
									// biome-ignore lint/suspicious/noExplicitAny: PokeAPI response
									(entry: any) => entry.language.name === "en",
								)
							].flavor_text,
						effectException: abilityData.effect_changes.length
							? abilityData.effect_changes[0].effect_entries[
									abilityData.effect_entries.findIndex(
										// biome-ignore lint/suspicious/noExplicitAny: PokeAPI response
										(entry: any) => entry.language.name === "en",
									)
								].effect
							: null,
					};

					return {
						name: ability.ability.name,
						isHidden: ability.is_hidden,
						...abilityMapped,
					};
				}),
			);

			const movesMapped = response.data.moves.reduce(
				// biome-ignore lint/suspicious/noExplicitAny: PokeAPI response
				(acc: Record<string, PokemonMoveDetailed[]>, move: any) => {
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
					frontAnimatedFemale:
						response.data.sprites.other.showdown.front_female,
					backAnimatedFemale: response.data.sprites.other.showdown.back_female,
					frontAnimatedShiny: response.data.sprites.other.showdown.front_shiny,
					backAnimatedShiny: response.data.sprites.other.showdown.back_shiny,
					frontAnimatedFemaleShiny:
						response.data.sprites.other.showdown.front_shiny_female,
					backAnimatedFemaleShiny:
						response.data.sprites.other.showdown.back_shiny_female,
					miniature: response.data.sprites.front_default,
				},
				types: response.data.types.reduce(
					// biome-ignore lint/suspicious/noExplicitAny: PokeAPI response
					(acc: string[], type: any) => {
						acc.push(type.type.name);
						return acc;
					},
					[] as string[],
				),
				id: response.data.id,
				name: response.data.name,
				stats: response.data.stats.reduce(
					// biome-ignore lint/suspicious/noExplicitAny: PokeAPI response
					(acc: Record<string, number>, stat: any) => {
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
		},
		[],
	);

	const fetchPokemonsFullList = useCallback(async (): Promise<
		PokemonListItem[]
	> => {
		const response = await axios.get(
			`${URL_BASE_ENDPOINT}/pokemon/?limit=${LAST_POKEMON_NUMBER}&offset=0`,
		);
		// biome-ignore lint/suspicious/noExplicitAny: PokeAPI response
		return response.data.results.map((pokemon: any) => ({
			name: pokemon.name,
			id: toInteger(pokemon.url.match(/\/(\d+)\/$/)?.[1] || 0),
		}));
	}, []);

	const fetchPokemonByType = useCallback(
		async (selectedType: string[] = []): Promise<PokemonDetailed[]> => {
			const getPokemonListByType = async (type: string) => {
				const responseType1 = await axios.get(
					`${URL_BASE_ENDPOINT}/type/${type}`,
				);

				return (
					responseType1.data.pokemon
						// biome-ignore lint/suspicious/noExplicitAny: PokeAPI response
						.map(({ pokemon }: { pokemon: any }) => ({
							name: pokemon.name,
							id: toInteger(pokemon.url.match(/\/(\d+)\/$/)?.[1] || 0),
						}))
						.filter(
							(pokemon: PokemonListItem) => pokemon.id <= LAST_POKEMON_NUMBER,
						)
				);
			};
			const pokemonType1ListMapped = await getPokemonListByType(
				selectedType[0],
			);

			if (selectedType.length === 1) {
				const pokemonListDetailed = await Promise.all(
					pokemonType1ListMapped.map(
						async (pokemon: PokemonListItem) =>
							await fetchDetailedPokemon(pokemon.id),
					),
				);
				return pokemonListDetailed;
			}

			const pokemonType2ListMapped = await getPokemonListByType(
				selectedType[1],
			);

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
					async (pokemon) => await fetchDetailedPokemon(pokemon.id),
				),
			);

			return pokemonListDetailed.filter(
				(pokemon) =>
					pokemon?.types.includes(selectedType[0]) &&
					pokemon.types.includes(selectedType[1]),
			);
		},
		[fetchDetailedPokemon],
	);

	const fetchPokemonSpecies = useCallback(
		async (
			pokemon: PokemonDetailed | PokemonListItem,
		): Promise<PokemonSpecies> => {
			const response = await axios.get(
				`${URL_BASE_ENDPOINT}/pokemon-species/${pokemon.id}/`,
			);

			const description = response.data.flavor_text_entries;

			const varietiesMapped = await Promise.all(
				// biome-ignore lint/suspicious/noExplicitAny: PokeAPI response
				response.data.varieties.map(async (variation: any) => {
					return await fetchDetailedPokemon(
						toInteger(variation.pokemon.url.match(/\/(\d+)\/$/)?.[1] || 0),
					);
				}),
			);

			const { data: evolutionLine } = await axios.get(
				response.data.evolution_chain.url,
			);

			type EvolutionNode = {
				evolves_to: EvolutionNode[];
				species: { name: string; url: string };
			};

			async function evolutionLineMap(
				evolutionLine: EvolutionNode,
			): Promise<PokemonDetailed[]> {
				if (!evolutionLine.evolves_to.length) {
					return [
						await fetchDetailedPokemon(
							toInteger(
								evolutionLine.species.url.match(/\/(\d+)\/$/)?.[1] || 0,
							),
						),
					];
				}

				return [
					await fetchDetailedPokemon(
						toInteger(evolutionLine.species.url.match(/\/(\d+)\/$/)?.[1] || 0),
					),
					...(await Promise.all(
						// biome-ignore lint/suspicious/noExplicitAny: PokeAPI response
						evolutionLine.evolves_to.map((p: any) => {
							return evolutionLineMap(p);
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
						// biome-ignore lint/suspicious/noExplicitAny: PokeAPI response
						description.findIndex((entry: any) => entry.language.name === "en")
					].flavor_text,
			};
		},
		[fetchDetailedPokemon],
	);

	return {
		fetchMove,
		fetchDetailedPokemon,
		fetchTypes,
		fetchPokemonsFullList,
		fetchPokemonByType,
		fetchPokemonSpecies,
	};
}
