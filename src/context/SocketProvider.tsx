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

export interface SocketContextType {
	// biome-ignore lint/suspicious/noExplicitAny: socket object
	socket: any;
	username: string;
	// biome-ignore lint/suspicious/noExplicitAny: socket users
	connectUsers: any[];
	// biome-ignore lint/suspicious/noExplicitAny: challenges
	challenges: any[];
	// biome-ignore lint/suspicious/noExplicitAny: battle obj
	battle: any;
	isWaitingOponentMove: boolean;
	isConnected: boolean;
	isLoadingLogin: boolean;
	socketId: string | null;
	setUsername: React.Dispatch<React.SetStateAction<string>>;
	refreshConnectedList: () => void;
	challengeUser: (userInvitedSocketId: string) => void;
	login: (username: string, party: PokemonPartyItem[]) => void;
	responseChallenge: (challengerId: string, response: boolean) => void;
	// biome-ignore lint/suspicious/noExplicitAny: action args
	battleAction: (battleId: string, actionKey: string, actionValue: any) => void;
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
	// biome-ignore lint/suspicious/noExplicitAny: list
	const [connectUsers, setConnectedUsers] = useState<any[]>([]);
	// biome-ignore lint/suspicious/noExplicitAny: list
	const [challenges, setChallenges] = useState<any[]>([]);
	// biome-ignore lint/suspicious/noExplicitAny: obj
	const [battle, setBattle] = useState<any>({});
	const [isLoadingLogin, setLoadingLogin] = useState<boolean>(false);
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
			console.log("conectado");
			setIsConnected(true);
			setSocketId(socket.id || "");
		}

		function onDisconnect() {
			console.log("desconectado");
			setIsConnected(false);
			setSocketId(null);
		}

		socket.on("connect", onConnection);
		socket.on("disconnect", onDisconnect);

		return () => {
			socket.off("connect", onConnection);
			socket.off("disconnect", onDisconnect);
		};
	}, []);

	useEffect(() => {
		// biome-ignore lint/suspicious/noExplicitAny: payload
		socket.on("connected-list", (list: any[]) => {
			setConnectedUsers(list);
		});
		// biome-ignore lint/suspicious/noExplicitAny: payload
		socket.on("challenges", (challenge: any) =>
			setChallenges((prev) => [...prev, challenge]),
		);
		// biome-ignore lint/suspicious/noExplicitAny: payload
		socket.on("battle", (battleData: any) => {
			setBattle(battleData);
			navigation("/battle");
		});
		// biome-ignore lint/suspicious/noExplicitAny: payload
		socket.on("battle:action-response", (battleData: any) => {
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
			alert("Logado com sucesso");
		} else {
			alert("Ocorreu um erro ao fazer o login");
		}

		setLoadingLogin(false);
	}, []);

	const login = useCallback(
		(uname: string, party: PokemonPartyItem[]) => {
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
		setConnectedUsers([]);
	}, []);

	const challengeUser = useCallback((userInvitedSocketId: string) => {
		socket.emit("battle:invite", userInvitedSocketId, (isSended: boolean) => {
			if (isSended) {
				alert("Desafio enviado");
			}
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
		setBattle({});
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
