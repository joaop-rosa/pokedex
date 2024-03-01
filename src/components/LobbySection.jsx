import s from "./LobbySection.module.css"
import { io } from "socket.io-client"

import { useEffect } from "react"

export function LobbySection() {
  const socket = io("localhost:3001", { autoConnect: false })

  useEffect(() => {
    // no-op if the socket is already connected
    socket.connect()

    return () => {
      socket.disconnect()
    }
  }, [socket])

  return <div>LobbySection</div>
}
