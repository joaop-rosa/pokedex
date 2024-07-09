import { createContext, useCallback, useEffect, useMemo, useState } from "react"
import { io } from "socket.io-client"
import { PLAYER_KEY } from "../contants/storage"
import { useNavigate } from "react-router-dom"

export const SocketContext = createContext()

const socket = io("localhost:3001", { autoConnect: false })

// TODO - Fazer uma forma de desconectar e apagar local storage
// TODO - Fazer com que esse provider não fique em todo o app
export const SocketProvider = ({ children }) => {
  const navigation = useNavigate()
  const [username, setUsername] = useState("")
  const [connectUsers, setConnectedUsers] = useState([])
  const [challenges, setChallenges] = useState([])
  const [battle, setBattle] = useState([])
  const [waitingOponentMove, setWaitingOponentMove] = useState(false)
  const isConnected = useMemo(
    () => connectUsers.some((user) => user.socketId === socket.id),
    [connectUsers]
  )

  console.log("battle", battle)

  useEffect(() => {
    socket.on("connect", () => {
      const player = localStorage.getItem(PLAYER_KEY)
      if (player) {
        const parsedPlayer = JSON.parse(player)
        socket.emit("reconnect", parsedPlayer)
        localStorage.setItem(
          PLAYER_KEY,
          JSON.stringify({
            username: parsedPlayer.username,
            id: socket.id,
          })
        )
        setUsername(parsedPlayer.username)
      }
    })
    socket.on("connected-list", (list) => setConnectedUsers(list))
    socket.on("challenges", (challenges) => setChallenges(challenges))
    socket.on("warnings", () => {})
    socket.on("battle", (battle) => {
      setBattle(battle)
      navigation("/battle")
    })
    socket.on("battle-action-response", (battle) => {
      setWaitingOponentMove(false)
      setBattle(battle)
    })

    socket.connect()
  }, [navigation])

  const login = useCallback((username, party) => {
    socket.emit("connect-server", username, party)
    localStorage.setItem(
      PLAYER_KEY,
      JSON.stringify({
        id: socket.id,
        username: username,
      })
    )
    setUsername(username)
  }, [])

  const refreshConnectedList = useCallback(() => {
    socket.emit("connected-list")
  }, [])

  const challengeUser = useCallback((userInvitedSocketId) => {
    socket.emit("battle-invite", userInvitedSocketId)
  }, [])

  const responseChallenge = useCallback((challengeId, response) => {
    socket.emit("battle-invite-response", challengeId, response)
  }, [])

  const battleAction = useCallback(
    (battleId, actionKey, actionValue) => {
      socket.emit("battle-actions", battleId, {
        actionKey,
        actionValue,
        username,
      })
      setWaitingOponentMove(true)
    },
    [username]
  )

  const changePokemonAction = useCallback(
    (battleId, newPokemonId) => {
      socket.emit("battle-action-change", battleId, newPokemonId, username)
    },
    [username]
  )

  return (
    <SocketContext.Provider
      value={{
        socket,
        username,
        isConnected,
        connectUsers,
        challenges,
        battle,
        waitingOponentMove,
        setUsername,
        refreshConnectedList,
        challengeUser,
        login,
        responseChallenge,
        battleAction,
        changePokemonAction,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}
