import s from "./LobbySection.module.css"
import { useContext, useEffect, useState } from "react"
import { PartyContext } from "../context/PartyProvider"
import { SocketContext } from "../context/SocketProvider"
import { upperFirst } from "lodash"
import cn from "classnames"

export function LobbySection() {
  const { party } = useContext(PartyContext)
  const [inputUsername, setInputUsername] = useState("")
  const {
    username,
    isConnected,
    refreshConnectedList,
    challengeUser,
    connectUsers,
    responseChallenge,
    login,
    challenges,
  } = useContext(SocketContext)

  useEffect(() => {
    refreshConnectedList()
  }, [refreshConnectedList])

  function handleConnect() {
    if (inputUsername.length) {
      login(inputUsername, party)
    }
  }

  function handleInvite(userInvitedSocketId) {
    challengeUser(userInvitedSocketId)
  }

  return (
    <div className={s.lobby}>
      {!isConnected && (
        <div className={s.inputWrapper}>
          <input
            className={s.inputName}
            onChange={(event) => setInputUsername(event.target.value)}
            type="text"
          />
          {/* Label de erro retornada do socket */}
          <button className={s.submitButton} onClick={handleConnect}>
            Conectar
          </button>
        </div>
      )}
      {/* Lista de desafios */}
      <div className={s.connectUsersWrapper}>
        {connectUsers
          .filter((user) => user.name !== username && user.isOnline)
          .map((user) => (
            // Adicionar alguma decoração caso esteja em batalha
            <div
              key={user.socketId}
              className={cn(s.userWrapper, {
                [s.userWrapperInBattle]: user.isInBattle,
              })}
            >
              <p>{user.name}</p>
              <p>
                ID: <span>{user.socketId}</span>
              </p>
              <div className={s.partyWrapper}>
                {user.party.map((pokemon) => (
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
              {isConnected && user.name !== username && !user.isInBattle && (
                <button onClick={() => handleInvite(user.socketId)}>
                  Desafiar
                </button>
              )}
            </div>
          ))}
      </div>
      {!!challenges.length && (
        <div className={s.challengesPopup}>
          <p>{challenges[0].challenger.name} lhe desafiou</p>
          <button
            onClick={() => responseChallenge(challenges[0].challengeId, true)}
          >
            Aceitar
          </button>
          <button
            onClick={() => responseChallenge(challenges[0].challengeId, false)}
          >
            Recusar
          </button>
        </div>
      )}
    </div>
  )
}
