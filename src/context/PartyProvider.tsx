import { useQueryClient } from "@tanstack/react-query";
import {
	createContext,
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { PARTY_KEY } from "../contants/storage";
import { fetchMoveFn } from "../hooks/useApi";
import type { MoveDetailed, PokemonDetailed } from "../types/pokemon";

export const MAX_PARTY_LENGTH = 3;

export const MOVE_SELECT_PROPS = {
	ATTACK1: "ATTACK1",
	ATTACK2: "ATTACK2",
	ATTACK3: "ATTACK3",
	ATTACK4: "ATTACK4",
	ABILITY: "ABILITY",
} as const;

export interface PokemonPartyItem extends PokemonDetailed {
	partyId: string;
	currentLife?: number;
	maxLife?: number;
	isActive?: boolean;
	movesSelected: {
		[MOVE_SELECT_PROPS.ATTACK1]: MoveDetailed | null;
		[MOVE_SELECT_PROPS.ATTACK2]: MoveDetailed | null;
		[MOVE_SELECT_PROPS.ATTACK3]: MoveDetailed | null;
		[MOVE_SELECT_PROPS.ATTACK4]: MoveDetailed | null;
	};
}

export interface PartyContextType {
	party: PokemonPartyItem[];
	addPokemonToParty: (pokemon: PokemonDetailed) => Promise<void>;
	removePokemonFromParty: (pokemon: PokemonPartyItem) => void;
	editPokemonFromParty: (pokemon: PokemonPartyItem) => void;
	isPartyFull: boolean;
}

export const PartyContext = createContext<PartyContextType>(
	{} as PartyContextType,
);

export const PartyProvider = ({ children }: { children: ReactNode }) => {
	const queryClient = useQueryClient();

	const getInitialParty = (): PokemonPartyItem[] => {
		const stored = localStorage.getItem(PARTY_KEY);
		return stored ? JSON.parse(stored) : [];
	};

	const [party, setParty] = useState<PokemonPartyItem[]>(getInitialParty());
	const isPartyFull = useMemo(() => party.length === MAX_PARTY_LENGTH, [party]);

	function idGenerator() {
		return crypto.randomUUID();
	}

	const editPokemonFromParty = useCallback(
		(pokemon: PokemonPartyItem) => {
			const indexOnParty = party.findIndex(
				(pokemonParty) => pokemonParty.partyId === pokemon.partyId,
			);

			const newParty = [...party];
			newParty[indexOnParty] = pokemon;
			setParty(newParty);
		},
		[party],
	);

	useEffect(() => {
		localStorage.setItem(PARTY_KEY, JSON.stringify(party));
	}, [party]);

	async function addPokemonToParty(pokemon: PokemonDetailed) {
		if (!isPartyFull) {
			const firstMoveUrl = pokemon.moves["LEVEL UP"]?.[0]?.url;
			const firstMove = firstMoveUrl
				? await queryClient.fetchQuery({
						queryKey: ["move", firstMoveUrl],
						queryFn: () => fetchMoveFn(firstMoveUrl),
					})
				: null;

			setParty((prev) => [
				...prev,
				{
					partyId: idGenerator(),
					...pokemon,
					movesSelected: {
						// [MOVE_SELECT_PROPS.ABILITY]: pokemon.abilities[0],
						[MOVE_SELECT_PROPS.ATTACK1]: firstMove,
						[MOVE_SELECT_PROPS.ATTACK2]: null,
						[MOVE_SELECT_PROPS.ATTACK3]: null,
						[MOVE_SELECT_PROPS.ATTACK4]: null,
					},
				},
			]);
		}
	}

	function removePokemonFromParty(pokemon: PokemonPartyItem) {
		setParty(
			party.filter((pokemonParty) => pokemonParty.partyId !== pokemon.partyId),
		);
	}

	return (
		<PartyContext.Provider
			value={{
				party,
				addPokemonToParty,
				removePokemonFromParty,
				editPokemonFromParty,
				isPartyFull,
			}}
		>
			{children}
		</PartyContext.Provider>
	);
};
