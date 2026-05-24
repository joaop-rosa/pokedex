import {
	createContext,
	type ReactNode,
	useEffect,
	useMemo,
	useState,
} from "react";
import { LAST_POKEMON_NUMBER } from "../contants/generations";
import { useApi } from "../hooks/useApi";
import type { PokemonDetailed, PokemonSpecies } from "../types/pokemon";

export const SEX_VARIATIONS = {
	MALE: "MALE",
	FEMALE: "FEMALE",
} as const;

export const POSITION_VARIATIONS = {
	FRONT: "FRONT",
	BACK: "BACK",
} as const;

export const SPRITE_VARIATIONS = {
	DEFAULT: "DEFAULT",
	SHINY: "SHINY",
	GMAX: "GMAX",
	MEGA: "MEGA",
} as const;

export const INFOS_VARIATION = {
	DEFAULT: "DEFAULT",
	ABILITIES: "ABILITIES",
	MOVES: "MOVES",
	EVOLUTION_LINE: "EVOLUTION_LINE",
	FORMS: "FORMS",
	STATS: "STATS",
} as const;

type ValueOf<T> = T[keyof T];

export interface SelectedPokemonContextType {
	selectedPokemon: PokemonDetailed | null;
	setSelectedPokemon: React.Dispatch<
		React.SetStateAction<PokemonDetailed | null>
	>;
	speciesInfo: PokemonSpecies | null;
	setSpeciesInfo: React.Dispatch<React.SetStateAction<PokemonSpecies | null>>;
	isLoadingScreen: boolean;
	infoScreenContent: ValueOf<typeof INFOS_VARIATION>;
	setInfoScreenContent: React.Dispatch<
		React.SetStateAction<ValueOf<typeof INFOS_VARIATION>>
	>;
	isFemale: boolean;
	isBack: boolean;
	isShiny: boolean;
	spriteVariation: ValueOf<typeof SPRITE_VARIATIONS>;
	setSpriteVariation: React.Dispatch<
		React.SetStateAction<ValueOf<typeof SPRITE_VARIATIONS>>
	>;
	positionVariation: ValueOf<typeof POSITION_VARIATIONS>;
	setPositionVariation: React.Dispatch<
		React.SetStateAction<ValueOf<typeof POSITION_VARIATIONS>>
	>;
	sexVariation: ValueOf<typeof SEX_VARIATIONS>;
	setSexVariation: React.Dispatch<
		React.SetStateAction<ValueOf<typeof SEX_VARIATIONS>>
	>;
}

export const SelectedPokemonContext = createContext<SelectedPokemonContextType>(
	{} as SelectedPokemonContextType,
);

export function SelectedPokemonProvider({ children }: { children: ReactNode }) {
	const [selectedPokemon, setSelectedPokemon] =
		useState<PokemonDetailed | null>(null);
	const [speciesInfo, setSpeciesInfo] = useState<PokemonSpecies | null>(null);
	const { fetchPokemonSpecies } = useApi();
	const hasSpecies = useMemo(
		() => selectedPokemon && selectedPokemon.id <= LAST_POKEMON_NUMBER,
		[selectedPokemon],
	);
	const isLoadingScreen = useMemo(
		() => !selectedPokemon || (!!hasSpecies && !speciesInfo),
		[hasSpecies, selectedPokemon, speciesInfo],
	);
	const [infoScreenContent, setInfoScreenContent] = useState<
		ValueOf<typeof INFOS_VARIATION>
	>(INFOS_VARIATION.DEFAULT);
	const [spriteVariation, setSpriteVariation] = useState<
		ValueOf<typeof SPRITE_VARIATIONS>
	>(SPRITE_VARIATIONS.DEFAULT);
	const [positionVariation, setPositionVariation] = useState<
		ValueOf<typeof POSITION_VARIATIONS>
	>(POSITION_VARIATIONS.FRONT);
	const [sexVariation, setSexVariation] = useState<
		ValueOf<typeof SEX_VARIATIONS>
	>(SEX_VARIATIONS.MALE);

	const isFemale = useMemo(
		() => sexVariation === SEX_VARIATIONS.FEMALE,
		[sexVariation],
	);
	const isBack = useMemo(
		() => positionVariation === POSITION_VARIATIONS.BACK,
		[positionVariation],
	);
	const isShiny = useMemo(
		() => spriteVariation === SPRITE_VARIATIONS.SHINY,
		[spriteVariation],
	);

	useEffect(() => {
		async function getSpeciesInfo() {
			if (selectedPokemon) {
				const info = await fetchPokemonSpecies(selectedPokemon);
				setSpeciesInfo(info);
			}
		}

		if (hasSpecies) {
			getSpeciesInfo();
		}
	}, [fetchPokemonSpecies, hasSpecies, selectedPokemon]);

	useEffect(() => {
		setInfoScreenContent(INFOS_VARIATION.DEFAULT);
		setSpriteVariation(SPRITE_VARIATIONS.DEFAULT);
		setPositionVariation(POSITION_VARIATIONS.FRONT);
		setSexVariation(SEX_VARIATIONS.MALE);
	}, []);

	return (
		<SelectedPokemonContext.Provider
			value={{
				selectedPokemon,
				setSelectedPokemon,
				speciesInfo,
				setSpeciesInfo,
				isLoadingScreen,
				infoScreenContent,
				setInfoScreenContent,
				isFemale,
				isBack,
				isShiny,
				spriteVariation,
				setSpriteVariation,
				positionVariation,
				setPositionVariation,
				sexVariation,
				setSexVariation,
			}}
		>
			{children}
		</SelectedPokemonContext.Provider>
	);
}
