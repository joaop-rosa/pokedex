import s from "./LobbySection.module.css"
import { useEffect } from "react"
import { upperFirst } from "lodash"
import cn from "classnames"
import { LobbyLogin } from "./LobbyLogin"
import { useSocket } from "../../hooks/useSocket"
import { LobbyChat } from "./LobbyChat"

export function LobbySection() {
  const {
    isConnected,
    refreshConnectedList,
    challengeUser,
    connectUsers,
    responseChallenge,
    challenges,
    socketId,
  } = useSocket()

  useEffect(() => {
    refreshConnectedList()
  }, [refreshConnectedList])

  function renderLoggedFeatures() {
    return (
      <>
        <LobbyChat />
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
                <p>{user.data.name}</p>
                <p>
                  ID: <span>{user.id}</span>
                </p>
                <div className={s.partyWrapper}>
                  {user.data.party.map((pokemon) => (
                    <div
                      key={pokemon.partyId}
                      className={s.partyPokemonWrapper}
                    >
                      <img
                        className={s.partyPokemonImage}
                        src={pokemon.sprites.miniature}
                        alt=""
                      />
                      <p>{upperFirst(pokemon.name)}</p>
                    </div>
                  ))}
                </div>
                {isConnected && !user.isInBattle && (
                  <button onClick={() => challengeUser(user.id)}>
                    Desafiar
                  </button>
                )}
              </div>
            ))}
        </div>
        {!!challenges.length && (
          <div className={s.challengesPopup}>
            <p>{challenges[0].name} lhe desafiou</p>
            <div className={s.challengesPopupButtons}>
              <button onClick={() => responseChallenge(challenges[0].id, true)}>
                Aceitar
              </button>
              <button
                onClick={() => responseChallenge(challenges[0].id, false)}
              >
                Recusar
              </button>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <div className={s.lobby}>
      <LobbyLogin />
      {isConnected && renderLoggedFeatures()}
    </div>
  )
}
