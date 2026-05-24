import {
	createContext,
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../components/UI/Spinner";
import { useSocket } from "../hooks/useSocket";
import type { MoveDetailed, PokemonDetailed } from "../types/pokemon";
import type { PokemonPartyItem } from "./PartyProvider";

export interface BattleUser {
	socketId: string;
	username: string;
	party: PokemonPartyItem[];
	activePokemon?: PokemonPartyItem;
	[key: string]: unknown;
}

export interface BattleContextType {
	getActivePokemon: (party: PokemonPartyItem[]) => PokemonPartyItem;
	selectedMove: MoveDetailed | null;
	setSelectedMove: React.Dispatch<React.SetStateAction<MoveDetailed | null>>;
	selectedPokemon: PokemonDetailed | null;
	setSelectedPokemon: React.Dispatch<
		React.SetStateAction<PokemonDetailed | null>
	>;
	myUser: BattleUser | null;
	opponent: BattleUser | null;
	hasToChangePokemon: boolean;
	hasOpponentToChangePokemon: boolean;
}

export const BattleContext = createContext<BattleContextType>(
	{} as BattleContextType,
);

export function BattleProvider({ children }: { children: ReactNode }) {
	const { battle, isConnected, socketId } = useSocket();
	const { owner, userInvited } = battle || {};
	const navigate = useNavigate();
	const [opponent, setOpponent] = useState<BattleUser | null>(null);
	const [myUser, setMyUser] = useState<BattleUser | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [selectedMove, setSelectedMove] = useState<MoveDetailed | null>(null);
	const [selectedPokemon, setSelectedPokemon] =
		useState<PokemonDetailed | null>(null);

	const getActivePokemon = useCallback((party: PokemonPartyItem[]) => {
		return party.find((pokemon) => pokemon.isActive) as PokemonPartyItem;
	}, []);

	const hasToChangePokemon = useMemo(() => {
		if (!isLoading && myUser?.party) {
			return getActivePokemon(myUser.party)?.currentLife <= 0;
		}

		return false;
	}, [isLoading, myUser, getActivePokemon]);

	const hasOpponentToChangePokemon = useMemo(() => {
		if (!isLoading && opponent?.party) {
			return getActivePokemon(opponent.party)?.currentLife <= 0;
		}

		return false;
	}, [isLoading, opponent, getActivePokemon]);

	useEffect(() => {
		if (isConnected && owner && userInvited) {
			const isOwner = owner.socketId === socketId;

			if (isOwner) {
				setMyUser(owner);
				setOpponent(userInvited);
				setIsLoading(false);
				return;
			}

			setMyUser(userInvited);
			setOpponent(owner);
			setIsLoading(false);
			setSelectedMove(null);
			setSelectedPokemon(null);
		}

		if (isConnected && !owner && !userInvited) {
			navigate("/lobby");
		}
	}, [isConnected, navigate, owner, socketId, userInvited]);

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<BattleContext.Provider
			value={{
				getActivePokemon,
				selectedMove,
				setSelectedMove,
				selectedPokemon,
				setSelectedPokemon,
				myUser,
				opponent,
				hasToChangePokemon,
				hasOpponentToChangePokemon,
			}}
		>
			{children}
		</BattleContext.Provider>
	);
}
