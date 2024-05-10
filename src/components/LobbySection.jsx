import s from "./LobbySection.module.css"
import { useContext, useEffect, useMemo } from "react"
import { PartyContext } from "../context/PartyProvider"
import { useState } from "react"
import { SocketContext } from "../context/SocketProvider"
import { upperFirst } from "lodash"
import cn from "classnames"

export function LobbySection() {
  const { party } = useContext(PartyContext)
  const [username, setUsername] = useState("")
  const [connectUsers, setConnectedUsers] = useState([])
  const [challenges, setChallenges] = useState([])
  const { socket } = useContext(SocketContext)
  const isConnected = useMemo(
    () => connectUsers.some((user) => user.socketId === socket.id),
    [connectUsers, socket.id]
  )

  console.log(connectUsers)

  useEffect(() => {
    socket.emit("connected-list")
    socket.on("connected-list", (list) => setConnectedUsers(list))
    socket.on("challenges", (challenges) => setChallenges(challenges))
    socket.on("warnings", () => {})
    socket.on("battle", (opponent) =>
      console.log(`starting battle with ${opponent.name}`)
    )

    return () => socket.emit("desconnect-server", socket.id)
  }, [socket])

  function handleConnect() {
    if (username.length) {
      socket.emit("connect-server", username, party)
    }
  }

  function handleInvite(userInvitedSocketId) {
    socket.emit("battle-invite", userInvitedSocketId)
  }

  console.log("Meu socket id", socket.id)

  return (
    <div className={s.lobby}>
      {!isConnected && (
        <div className={s.inputWrapper}>
          <input
            className={s.inputName}
            onChange={(event) => setUsername(event.target.value)}
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
          .filter((user) => user.socketId !== socket.id)
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
              {isConnected && !user.isInBattle && (
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
            onClick={() =>
              socket.emit(
                "battle-invite-response",
                challenges[0].challengeId,
                true
              )
            }
          >
            Aceitar
          </button>
          <button
            onClick={() =>
              socket.emit("battle-invite-response", challenges[0].challengeId)
            }
          >
            Recusar
          </button>
        </div>
      )}
    </div>
  )
}
