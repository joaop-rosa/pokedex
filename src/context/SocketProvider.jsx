import { useState, useEffect, createContext } from "react"
import { io } from "socket.io-client"

export const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const socket = io("localhost:3001", { autoConnect: false })

  const [connected, setConnected] = useState(false)

  useEffect(() => {
    socket.connect()
    setConnected(true)

    return () => {
      setConnected(false)
      socket.disconnect()
    }
  }, [socket])

  return (
    <SocketContext.Provider value={{ connected, socket }}>
      {children}
    </SocketContext.Provider>
  )
}
