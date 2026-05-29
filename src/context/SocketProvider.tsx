import {
	createContext,
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../contants/socket.js";
import type { PokemonPartyItem } from "./PartyProvider";

export interface ChatMessage {
	name: string;
	message: string;
	hour: string;
	color: string;
}

import type { BattleUser } from "./BattleProvider";

export interface Challenge {
	id: string;
	name: string;
}

export interface SocketUser {
	id: string;
	isInBattle: boolean;
	data: {
		name: string;
		party: PokemonPartyItem[];
	};
}

export interface BattleData {
	battleId: string;
	owner: BattleUser;
	userInvited: BattleUser;
	battleLog: Record<string, Record<string, unknown>>[];
	round: number;
	messages: string[];
	isOver: boolean;
	winner: string;
	[key: string]: unknown;
}

export interface SocketContextType {
	socket: unknown;
	username: string;
	connectUsers: SocketUser[];
	challenges: Challenge[];
	battle: BattleData | null;
	isWaitingOponentMove: boolean;
	isConnected: boolean;
	isLoadingLogin: boolean;
	loginError: string | null;
	socketId: string | null;
	setUsername: React.Dispatch<React.SetStateAction<string>>;
	refreshConnectedList: () => void;
	challengeUser: (userInvitedSocketId: string) => Promise<boolean>;
	login: (username: string, party: PokemonPartyItem[]) => void;
	responseChallenge: (challengerId: string, response: boolean) => void;
	battleAction: (
		battleId: string,
		actionKey: string,
		actionValue: unknown,
	) => void;
	changePokemonAction: (battleId: string, newPokemonId: string) => void;
	finishBattle: () => void;
	disconnect: () => void;
	sendChatMessage: (message: string) => void;
	chatMessages: ChatMessage[];
}

export const SocketContext = createContext<SocketContextType>(
	{} as SocketContextType,
);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
	const navigation = useNavigate();
	const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
	const [username, setUsername] = useState<string>("");
	const [socketId, setSocketId] = useState<string | null>("");
	const [connectUsers, setConnectUsers] = useState<SocketUser[]>([]);
	const [challenges, setChallenges] = useState<Challenge[]>([]);
	const [battle, setBattle] = useState<BattleData | null>(null);
	const [isLoadingLogin, setLoadingLogin] = useState<boolean>(false);
	const [loginError, setLoginError] = useState<string | null>(null);
	const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

	const isWaitingOponentMove = useMemo(() => {
		if (battle?.battleLog) {
			const battleLogRoundIndex = battle.round - 1;
			const isOwner = battle.owner.socketId === socketId;
			const isWaitingOponentMove =
				battle.battleLog[battleLogRoundIndex]?.[
					isOwner ? "owner" : "userInvited"
				] &&
				!battle.battleLog[battleLogRoundIndex]?.[
					isOwner ? "userInvited" : "owner"
				];

			return isWaitingOponentMove;
		}

		return false;
	}, [battle, socketId]);

	useEffect(() => {
		function onConnection() {
			setIsConnected(true);
			setSocketId(socket.id || "");
		}

		function onDisconnect() {
			setIsConnected(false);
			setSocketId(null);
		}

		function onConnectError() {
			console.warn("Failed to connect. Trying again...");
		}

		function onReconnectFailed() {
			setLoadingLogin(false);
			setLoginError("Server unavailable after connection attempts.");
			socket.disconnect(); // Safe to disconnect here
		}

		socket.on("connect", onConnection);
		socket.on("disconnect", onDisconnect);
		socket.on("connect_error", onConnectError);
		socket.on("reconnect_failed", onReconnectFailed);

		return () => {
			socket.off("connect", onConnection);
			socket.off("disconnect", onDisconnect);
			socket.off("connect_error", onConnectError);
			socket.off("reconnect_failed", onReconnectFailed);
		};
	}, []);

	useEffect(() => {
		socket.on("connected-list", (list: SocketUser[]) => {
			setConnectUsers(list);
		});
		socket.on("challenges", (challenge: Challenge) =>
			setChallenges((prev) => [...prev, challenge]),
		);
		socket.on("battle", (battleData: BattleData) => {
			setBattle(battleData);
			navigation("/battle");
		});
		socket.on("battle:action-response", (battleData: BattleData) => {
			setBattle(battleData);
		});
		socket.on("message", (message: string) => alert(message));
		socket.on("chat:message", (message: ChatMessage) =>
			setChatMessages((prev) => [...prev, message]),
		);

		return () => {
			socket.off("connected-list");
			socket.off("challenges");
			socket.off("battle");
			socket.off("battle:action-response");
			socket.off("chat:message");
		};
	}, [navigation]);

	const loginCallback = useCallback((isLogged: boolean) => {
		if (isLogged) {
			setLoginError(null);
		} else {
			setLoginError("Nickname unavailable or invalid.");
		}

		setLoadingLogin(false);
	}, []);

	const login = useCallback(
		(uname: string, party: PokemonPartyItem[]) => {
			setLoginError(null);
			socket.connect();
			socket.emit("connect:server", uname, party, loginCallback);
			setLoadingLogin(true);
		},
		[loginCallback],
	);

	const refreshConnectedList = useCallback(() => {
		socket.emit("connected-list");
	}, []);

	const disconnect = useCallback(() => {
		socket.disconnect();
		setUsername("");
		setConnectUsers([]);
		setLoginError(null);
	}, []);

	const challengeUser = useCallback((userInvitedSocketId: string) => {
		return new Promise<boolean>((resolve) => {
			socket.emit("battle:invite", userInvitedSocketId, (isSended: boolean) => {
				resolve(isSended);
			});
		});
	}, []);

	const responseChallenge = useCallback(
		(challengerId: string, response: boolean) => {
			if (response) {
				socket.emit("battle:invite-response", challengerId);
			}

			setChallenges(
				challenges.filter((challenge) => challenge.id !== challengerId),
			);
		},
		[challenges],
	);

	const finishBattle = useCallback(() => {
		setBattle(null);
		navigation("/lobby");
	}, [navigation]);

	const battleAction = useCallback(
		(battleId: string, actionKey: string, actionValue: unknown) => {
			socket.emit("battle:actions", battleId, {
				actionKey,
				actionValue,
			});
		},
		[],
	);

	const changePokemonAction = useCallback(
		(battleId: string, newPokemonId: string) => {
			socket.emit("battle:action-change", battleId, newPokemonId);
		},
		[],
	);

	const sendChatMessage = useCallback((message: string) => {
		socket.emit("chat:message", message);
	}, []);

	return (
		<SocketContext.Provider
			value={{
				socket,
				username,
				connectUsers,
				challenges,
				battle,
				isWaitingOponentMove,
				isConnected,
				isLoadingLogin,
				loginError,
				socketId,
				setUsername,
				refreshConnectedList,
				challengeUser,
				login,
				responseChallenge,
				battleAction,
				changePokemonAction,
				finishBattle,
				disconnect,
				sendChatMessage,
				chatMessages,
			}}
		>
			{children}
		</SocketContext.Provider>
	);
};
