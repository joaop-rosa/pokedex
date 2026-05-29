import cn from "classnames";
import { upperFirst } from "lodash";
import { useEffect, useState } from "react";
import { useSocket } from "../../hooks/useSocket";
import { LobbyChat } from "./LobbyChat";
import { LobbyLogin } from "./LobbyLogin";
import s from "./LobbySection.module.css";

export function LobbySection() {
	const {
		isConnected,
		refreshConnectedList,
		challengeUser,
		connectUsers,
		responseChallenge,
		challenges,
		socketId,
	} = useSocket();

	const [challengedUsers, setChallengedUsers] = useState<
		Record<string, boolean>
	>({});

	useEffect(() => {
		refreshConnectedList();
	}, [refreshConnectedList]);

	const handleChallenge = async (userId: string) => {
		const isSended = await challengeUser(userId);
		if (isSended) {
			setChallengedUsers((prev) => ({ ...prev, [userId]: true }));
			setTimeout(() => {
				setChallengedUsers((prev) => ({ ...prev, [userId]: false }));
			}, 3000);
		}
	};

	function renderLoggedFeatures() {
		return (
			<div className={s.lobbyFeatures}>
				<div className={s.trainersColumn}>
					<div className={s.connectUsersWrapper}>
						{connectUsers
							.filter((user) => user.id !== socketId)
							.map((user) => (
								<div
									key={user.id}
									className={cn(s.userWrapper, {
										[s.userWrapperInBattle]: user.isInBattle,
									})}
								>
									<div className={s.userInfo}>
										<p className={s.userName}>{user.data.name}</p>
										<p className={s.userId}>
											ID: <span>{user.id}</span>
										</p>
									</div>
									<div className={s.partyWrapper}>
										{user.data.party.map((pokemon) => (
											<div
												key={pokemon.partyId}
												className={s.partyPokemonWrapper}
											>
												<img
													className={s.partyPokemonImage}
													src={pokemon.sprites.front}
													alt={pokemon.name}
													title={upperFirst(pokemon.name)}
												/>
											</div>
										))}
									</div>
									{isConnected && !user.isInBattle && (
										<button
											type="button"
											className={s.challengeButton}
											onClick={() => handleChallenge(user.id)}
											disabled={challengedUsers[user.id]}
										>
											{challengedUsers[user.id]
												? "Challenge sent"
												: "Challenge"}
										</button>
									)}
								</div>
							))}
					</div>
				</div>
				<div className={s.chatColumn}>
					<LobbyChat />
				</div>
				{!!challenges.length && (
					<div className={s.challengesPopup}>
						<p>{challenges[0].name} challenged you</p>
						<div className={s.challengesPopupButtons}>
							<button
								type="button"
								onClick={() => responseChallenge(challenges[0].id, true)}
							>
								Accept
							</button>
							<button
								type="button"
								onClick={() => responseChallenge(challenges[0].id, false)}
							>
								Decline
							</button>
						</div>
					</div>
				)}
			</div>
		);
	}

	return (
		<div className={s.lobby}>
			<LobbyLogin />
			{isConnected && renderLoggedFeatures()}
		</div>
	);
}
