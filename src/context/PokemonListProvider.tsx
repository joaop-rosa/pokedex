import {
	createContext,
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useApi } from "../hooks/useApi";
import type { PokemonDetailed, PokemonListItem } from "../types/pokemon";

export interface Generation {
	number: number;
	start: number;
	final: number;
}

export interface PokemonListContextType {
	POKEMONS_PER_PAGE: number;
	isReady: boolean;
	isListLoading: boolean;
	selectedGeneration: Generation | null;
	setSelectedGeneration: React.Dispatch<
		React.SetStateAction<Generation | null>
	>;
	setTextFilter: React.Dispatch<React.SetStateAction<string>>;
	pageSize: number;
	setPageSize: React.Dispatch<React.SetStateAction<number>>;
	pokemonList: (PokemonListItem | PokemonDetailed)[];
	isEmpty: boolean;
	typeList: string[];
	setSelectedType: React.Dispatch<React.SetStateAction<string[]>>;
	selectedType: string[];
	setIsListLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PokemonListContext = createContext<PokemonListContextType>(
	{} as PokemonListContextType,
);

export function PokemonListProvider({ children }: { children: ReactNode }) {
	const POKEMONS_PER_PAGE = 12;
	const [pokemonFullList, setPokemonFullList] = useState<PokemonListItem[]>([]);
	const [pokemonListFinal, setPokemonListFinal] = useState<
		(PokemonListItem | PokemonDetailed)[]
	>([]);
	const [typeList, setTypeList] = useState<string[]>([]);
	const [selectedType, setSelectedType] = useState<string[]>([]);
	const [pageSize, setPageSize] = useState<number>(POKEMONS_PER_PAGE);
	const [textFilter, setTextFilter] = useState<string>("");
	const [selectedGeneration, setSelectedGeneration] =
		useState<Generation | null>(null);
	const [isListFiltering, setIsListFiltering] = useState<boolean>(false);

	const isReady = useMemo(
		() => typeList.length > 0 && pokemonFullList.length > 0,
		[pokemonFullList, typeList],
	);
	const isEmpty = useMemo(
		() => !isListFiltering && pokemonListFinal.length === 0,
		[isListFiltering, pokemonListFinal],
	);
	const pokemonList = useMemo(
		() => pokemonListFinal.slice(0, pageSize),
		[pageSize, pokemonListFinal],
	);

	const { fetchTypes, fetchPokemonsFullList, fetchPokemonByType } = useApi();

	useEffect(() => {
		async function getTypes() {
			if (typeList.length > 0) return;
			const types = await fetchTypes();
			setTypeList(types);
		}

		getTypes();
	}, [fetchTypes, typeList.length]);

	useEffect(() => {
		async function getPokemonList() {
			if (pokemonFullList.length > 0) return;
			const fullPokemonList = await fetchPokemonsFullList();
			setPokemonFullList(fullPokemonList);
		}

		getPokemonList();
	}, [fetchPokemonsFullList, pokemonFullList.length]);

	const applyBasicFilter = useCallback(
		(list: (PokemonListItem | PokemonDetailed)[]) => {
			let filteredList = list.filter((pokemon) =>
				pokemon.name.includes(textFilter.toLowerCase()),
			);

			if (selectedGeneration) {
				filteredList = filteredList.filter(
					(pokemon) =>
						pokemon.id >= selectedGeneration.start &&
						pokemon.id <= selectedGeneration.final,
				);
			}

			return filteredList;
		},
		[selectedGeneration, textFilter],
	);

	useEffect(() => {
		async function getPokemonListByType() {
			const typePokemonList = await fetchPokemonByType(selectedType);
			const typePokemonListWithFilters = applyBasicFilter(typePokemonList);
			setPokemonListFinal(typePokemonListWithFilters);
			setIsListFiltering(false);
		}

		if (pokemonFullList.length) {
			setIsListFiltering(true);
			setPageSize(POKEMONS_PER_PAGE);
			if (selectedType.length) {
				getPokemonListByType();
			} else {
				setPokemonListFinal(applyBasicFilter(pokemonFullList));
				setIsListFiltering(false);
			}
		}
	}, [applyBasicFilter, fetchPokemonByType, pokemonFullList, selectedType]);

	return (
		<PokemonListContext.Provider
			value={{
				POKEMONS_PER_PAGE,
				isReady,
				isListLoading: isListFiltering,
				selectedGeneration,
				setSelectedGeneration,
				setTextFilter,
				pageSize,
				setPageSize,
				pokemonList,
				isEmpty,
				typeList,
				setSelectedType,
				selectedType,
				setIsListLoading: setIsListFiltering,
			}}
		>
			{children}
		</PokemonListContext.Provider>
	);
}
