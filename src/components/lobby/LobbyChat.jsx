import { useState } from "react"
import { useSocket } from "../../hooks/useSocket"
import s from "./LobbyChat.module.css"

export function LobbyChat() {
  const { sendChatMessage, chatMessages } = useSocket()
  const [message, setMessage] = useState("")

  function handleSendMessage() {
    if (message.length) {
      sendChatMessage(message)
      setMessage("")
    }
  }

  return (
    <div className={s.lobbyChat}>
      <div className={s.messagesWrapper}>
        {chatMessages.map(({ name, message, hour, color }) => {
          const hourFormatted = `${new Date(hour).getHours()}:${
            new Date(hour).getMinutes() < 10
              ? `0${new Date(hour).getMinutes()}`
              : new Date(hour).getMinutes()
          }`

          return (
            <div key={hour} className={s.message}>
              <div className={s.messageHeader}>
                <h4 style={{ color }}>{name}</h4>
                <p>{hourFormatted}</p>
              </div>

              <p className={s.messageText}>{message}</p>
            </div>
          )
        })}
      </div>
      <div className={s.inputWrapper}>
        <textarea
          className={s.inputMessage}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          type="text"
        />
        <button disabled={!message.length} onClick={handleSendMessage}>
          Enviar
        </button>
      </div>
    </div>
  )
}
