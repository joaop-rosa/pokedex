import s from "./LobbySection.module.css"
import { useContext, useEffect } from "react"
import { PartyContext } from "../context/PartyProvider"
import { useState } from "react"
import { SocketContext } from "../context/SocketProvider"
import { upperFirst } from "lodash"

export function LobbySection() {
  const { party } = useContext(PartyContext)
  const [username, setUsername] = useState("")
  const [connectUsers, setConnectedUsers] = useState([])
  const { socket } = useContext(SocketContext)

  useEffect(() => {
    socket.on("connected-list", (list) => setConnectedUsers(list))
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
      {/* Esconder quando estiver conectado */}
      <div className={s.inputWrapper}>
        <input
          className={s.inputName}
          onChange={(event) => setUsername(event.target.value)}
          type="text"
        />
        {/* Label de erro retornada do socket */}
        <button className={s.submitButton} onClick={handleConnect}>
          Enviar
        </button>
      </div>
      {/* Lista de desafios */}
      <div className={s.connectUsersWrapper}>
        {connectUsers
          .filter((user) => user.socketId !== socket.id)
          .map((user) => (
            <div key={user.socketId} className={s.userWrapper}>
              <p>{user.name}</p>
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
              <button onClick={() => handleInvite(user.socketId)}>
                Desafiar
              </button>
              {/* Adicionar botão de desafio */}
            </div>
          ))}
      </div>
    </div>
  )
}
