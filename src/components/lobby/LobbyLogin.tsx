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
		loginError,
	} = useSocket();

	function handleConnect() {
		if (username.trim().length) {
			login(username, party);
		}
	}

	if (isLoadingLogin) {
		return (
			<div className={s.loginContainer}>
				<Spinner containerClassname={s.spinner} />
			</div>
		);
	}

	return (
		<div className={s.loginContainer}>
			<h2 className={s.title}>Trainer Registration</h2>
			<form
				className={s.inputWrapper}
				onSubmit={(e) => {
					e.preventDefault();
					if (!isConnected && username.trim().length) {
						handleConnect();
					} else if (isConnected) {
						disconnect();
					}
				}}
			>
				{!isConnected && (
					<>
						<input
							className={s.inputName}
							value={username}
							onChange={(event) => setUsername(event.target.value)}
							type="text"
							placeholder="ENTER NICKNAME_"
						/>
						{loginError && <p className={s.errorMessage}>{loginError}</p>}
					</>
				)}
				<button
					type="submit"
					disabled={!isConnected && !username.trim().length}
					className={s.submitButton}
				>
					{isConnected ? "Desconectar" : "Conectar"}
				</button>
			</form>
		</div>
	);
}
