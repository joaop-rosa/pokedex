import { createContext, useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { socket } from "../contants/socket.js"

export const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const navigation = useNavigate()
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [username, setUsername] = useState("")
  const [connectUsers, setConnectedUsers] = useState([])
  const [challenges, setChallenges] = useState([])
  const [battle, setBattle] = useState({})
  const isLogged = useMemo(
    () => connectUsers.some((user) => user.data.name === username),
    [connectUsers, username]
  )
  const isWaitingOponentMove = useMemo(() => {
    if (battle?.battleLog) {
      const battleLogRoundIndex = battle.round - 1
      const isOwner = battle.owner.name === username
      const isWaitingOponentMove =
        battle.battleLog[battleLogRoundIndex]?.[
          isOwner ? "owner" : "userInvited"
        ] &&
        !battle.battleLog[battleLogRoundIndex]?.[
          isOwner ? "userInvited" : "owner"
        ]

      return isWaitingOponentMove
    }

    return false
  }, [battle, username])

  useEffect(() => {
    function onConnection() {
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false)
    }

    socket.on("connect", onConnection)
    socket.on("disconnect", onDisconnect)

    return () => {
      socket.off("connect", onConnection)
      socket.off("disconnect", onDisconnect)
    }
  }, [])

  useEffect(() => {
    socket.on("connected-list", (list) => {
      setConnectedUsers(list)
    })
    socket.on("challenges", (challenge) =>
      setChallenges((prev) => [...prev, challenge])
    )
    socket.on("battle", (battle) => {
      setBattle(battle)
      navigation("/battle")
    })
    socket.on("battle:action-response", (battle) => {
      setBattle(battle)
    })

    return () => {
      socket.off("connected-list")
      socket.off("challenges")
      socket.off("battle")
      socket.off("battle:action-response")
    }
  }, [navigation])

  const login = useCallback((username, party) => {
    socket.connect()
    socket.emit("connect:server", username, party)
    setUsername(username)
  }, [])

  const refreshConnectedList = useCallback(() => {
    socket.emit("connected-list")
  }, [])

  const disconnect = useCallback(() => {
    socket.disconnect()
    setUsername("")
    setConnectedUsers([])
  }, [])

  const challengeUser = useCallback((userInvitedSocketId) => {
    socket.emit("battle:invite", userInvitedSocketId)
  }, [])

  const responseChallenge = useCallback(
    (challengerId, response) => {
      if (response) {
        socket.emit("battle:invite-response", challengerId)
      }

      setChallenges(
        challenges.filter((challenge) => challenge.id !== challengerId)
      )
    },
    [challenges]
  )

  const finishBattle = useCallback(() => {
    setBattle({})
    navigation("/lobby")
  }, [navigation])

  const battleAction = useCallback(
    (battleId, actionKey, actionValue) => {
      socket.emit("battle:actions", battleId, {
        actionKey,
        actionValue,
        username,
      })
    },
    [username]
  )

  const changePokemonAction = useCallback(
    (battleId, newPokemonId) => {
      socket.emit("battle:action-change", battleId, newPokemonId, username)
    },
    [username]
  )

  return (
    <SocketContext.Provider
      value={{
        socket,
        username,
        isLogged,
        connectUsers,
        challenges,
        battle,
        isWaitingOponentMove,
        isConnected,
        setUsername,
        refreshConnectedList,
        challengeUser,
        login,
        responseChallenge,
        battleAction,
        changePokemonAction,
        finishBattle,
        disconnect,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}
