import {
	createContext,
	type ReactNode,
	useCallback,
	useMemo,
	useState,
} from "react";
import {
	usePokemonByTypeQuery,
	usePokemonsFullListQuery,
	useTypesQuery,
} from "../hooks/useApi";
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
}

export const PokemonListContext = createContext<PokemonListContextType>(
	{} as PokemonListContextType,
);

export function PokemonListProvider({ children }: { children: ReactNode }) {
	const POKEMONS_PER_PAGE = 12;
	const [selectedType, setSelectedType] = useState<string[]>([]);
	const [pageSize, setPageSize] = useState<number>(POKEMONS_PER_PAGE);
	const [textFilter, setTextFilter] = useState<string>("");
	const [selectedGeneration, setSelectedGeneration] =
		useState<Generation | null>(null);

	const { data: typeList = [] } = useTypesQuery();
	const { data: pokemonFullList = [], isLoading: isLoadingFullList } =
		usePokemonsFullListQuery();
	const { data: typePokemonList = [], isFetching: isFetchingByType } =
		usePokemonByTypeQuery(selectedType);

	const isListFiltering = isLoadingFullList || isFetchingByType;

	const isReady = useMemo(
		() => typeList.length > 0 && pokemonFullList.length > 0,
		[pokemonFullList.length, typeList.length],
	);

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

	const pokemonListFinal = useMemo(() => {
		const baseList =
			selectedType.length > 0 ? typePokemonList : pokemonFullList;
		if (!baseList) return [];
		return applyBasicFilter(baseList);
	}, [selectedType.length, typePokemonList, pokemonFullList, applyBasicFilter]);

	const isEmpty = useMemo(
		() => !isListFiltering && pokemonListFinal.length === 0,
		[isListFiltering, pokemonListFinal.length],
	);

	const pokemonList = useMemo(
		() => pokemonListFinal.slice(0, pageSize),
		[pageSize, pokemonListFinal],
	);

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
			}}
		>
			{children}
		</PokemonListContext.Provider>
	);
}
