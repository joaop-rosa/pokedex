import s from "./LobbySection.module.css"
import { useContext, useEffect } from "react"
import { PartyContext } from "../context/PartyProvider"
import { SocketContext } from "../context/SocketProvider"
import { upperFirst } from "lodash"
import cn from "classnames"

export function LobbySection() {
  const { party } = useContext(PartyContext)
  const {
    username,
    setUsername,
    isLogged,
    refreshConnectedList,
    challengeUser,
    connectUsers,
    responseChallenge,
    login,
    challenges,
    disconnect,
  } = useContext(SocketContext)

  console.log(process.env.API_URL)

  useEffect(() => {
    refreshConnectedList()
  }, [refreshConnectedList])

  function handleConnect() {
    if (username.length) {
      login(username, party)
    }
  }

  return (
    <div className={s.lobby}>
      {!isLogged && (
        <div className={s.inputWrapper}>
          <input
            className={s.inputName}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            type="text"
          />
          {/* Label de erro retornada do socket */}
          <button
            disabled={!username.length}
            className={s.submitButton}
            onClick={handleConnect}
          >
            Conectar
          </button>
        </div>
      )}
      {isLogged && (
        <button className={s.submitButton} onClick={disconnect}>
          Desconectar
        </button>
      )}
      {/* Lista de desafios */}
      <div className={s.connectUsersWrapper}>
        {connectUsers
          .filter((user) => user.data.name !== username)
          .map((user) => (
            // Adicionar alguma decoração caso esteja em batalha
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
                  <div key={pokemon.partyId} className={s.partyPokemonWrapper}>
                    <img
                      className={s.partyPokemonImage}
                      src={pokemon.sprites.miniature}
                      alt=""
                    />
                    <p>{upperFirst(pokemon.name)}</p>
                  </div>
                ))}
              </div>
              {isLogged && !user.isInBattle && (
                <button onClick={() => challengeUser(user.id)}>Desafiar</button>
              )}
            </div>
          ))}
      </div>
      {!!challenges.length && (
        <div className={s.challengesPopup}>
          <p>{challenges[0].name} lhe desafiou</p>
          <button onClick={() => responseChallenge(challenges[0].id, true)}>
            Aceitar
          </button>
          <button onClick={() => responseChallenge(challenges[0].id, false)}>
            Recusar
          </button>
        </div>
      )}
    </div>
  )
}
