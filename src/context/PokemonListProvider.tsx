import {
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useApi } from "../hooks/useApi";

export const PokemonListContext = createContext({});

export function PokemonListProvider({ children }) {
	const POKEMONS_PER_PAGE = 12;
	const [pokemonFullList, setPokemonFullList] = useState([]);
	const [pokemonListFinal, setPokemonListFinal] = useState([]);
	const [typeList, setTypeList] = useState([]);
	const [selectedType, setSelectedType] = useState([]);
	const [pageSize, setPageSize] = useState(POKEMONS_PER_PAGE);
	const [textFilter, setTextFilter] = useState("");
	const [selectedGeneration, setSelectedGeneration] = useState(null);
	const isListLoading = !pokemonFullList.length || !typeList.length;
	const [isListFiltering, setIsListFiltering] = useState(false);
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
		(list) => {
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
	}, [
		applyBasicFilter,
		fetchPokemonByType,
		pokemonFullList,
		selectedType,
		POKEMONS_PER_PAGE,
	]);

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
