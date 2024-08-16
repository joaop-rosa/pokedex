import s from "./LobbyLogin.module.css"
import { useSocket } from "../../hooks/useSocket"
import { useParty } from "../../hooks/useParty"

export function LobbyLogin() {
  const { party } = useParty()
  const { username, setUsername, isLogged, login, disconnect } = useSocket()
  function handleConnect() {
    if (username.length) {
      login(username, party)
    }
  }

  if (isLogged) {
    return (
      <button className={s.submitButton} onClick={disconnect}>
        Desconectar
      </button>
    )
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
        disabled={!username.length}
        className={s.submitButton}
        onClick={handleConnect}
      >
        Conectar
      </button>
    </div>
  )
}
