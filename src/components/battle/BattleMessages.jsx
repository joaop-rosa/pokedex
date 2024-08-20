import { useSocket } from "../../hooks/useSocket"
import s from "./BattleMessages.module.css"

export function BattleMessages() {
  const { battle } = useSocket()
  const { messages } = battle

  return (
    <div className={s.battleMessages}>
      {messages.map((message) => (
        <p key={message} className={s.message}>
          {message}
        </p>
      ))}
    </div>
  )
}
