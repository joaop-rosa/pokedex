import { useParty } from "../../hooks/useParty";
import { useSocket } from "../../hooks/useSocket";
import { Spinner } from "../UI/Spinner";
import s from "./LobbyLogin.module.css";

export function LobbyLogin() {
	const { party } = useParty();
	const {
		username,
		setUsername,
		isConnected,
		login,
		disconnect,
		isLoadingLogin,
	} = useSocket();
	function handleConnect() {
		if (username.length) {
			login(username, party);
		}
	}

	if (isLoadingLogin) {
		return <Spinner containerClassname={s.spinner} />;
	}

	if (isConnected) {
		return (
			<button type="button" className={s.submitButton} onClick={disconnect}>
				Desconectar
			</button>
		);
	}

	return (
		<div className={s.inputWrapper}>
			<input
				className={s.inputName}
				value={username}
				onChange={(event) => setUsername(event.target.value)}
				type="text"
			/>
			<button
				type="button"
				disabled={!username.length}
				className={s.submitButton}
				onClick={handleConnect}
			>
				Conectar
			</button>
		</div>
	);
}
