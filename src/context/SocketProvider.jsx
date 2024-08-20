import { createContext, useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { socket } from "../contants/socket.js"

export const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const navigation = useNavigate()
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [username, setUsername] = useState("")
  const [socketId, setSocketId] = useState("")
  const [connectUsers, setConnectedUsers] = useState([])
  const [challenges, setChallenges] = useState([])
  const [battle, setBattle] = useState({})
  const [isLoadingLogin, setLoadingLogin] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const isWaitingOponentMove = useMemo(() => {
    if (battle?.battleLog) {
      const battleLogRoundIndex = battle.round - 1
      const isOwner = battle.owner.socketId === socketId
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
  }, [battle, socketId])

  useEffect(() => {
    function onConnection() {
      console.log("conectado")
      setIsConnected(true)
      setSocketId(socket.id)
    }

    function onDisconnect() {
      console.log("desconectado")
      setIsConnected(false)
      setSocketId(null)
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
    socket.on("message", (message) => alert(message))
    socket.on("chat:message", (message) =>
      setChatMessages((prev) => [...prev, message])
    )

    return () => {
      socket.off("connected-list")
      socket.off("challenges")
      socket.off("battle")
      socket.off("battle:action-response")
      socket.off("chat:message")
    }
  }, [navigation])

  const loginCallback = useCallback((isLogged) => {
    if (isLogged) {
      alert("Logado com sucesso")
    } else {
      alert("Ocorreu um erro ao fazer o login")
    }

    setLoadingLogin(false)
  }, [])

  const login = useCallback(
    (username, party) => {
      socket.connect()
      socket.emit("connect:server", username, party, loginCallback)
      setLoadingLogin(true)
    },
    [loginCallback]
  )

  const refreshConnectedList = useCallback(() => {
    socket.emit("connected-list")
  }, [])

  const disconnect = useCallback(() => {
    socket.disconnect()
    setUsername("")
    setConnectedUsers([])
  }, [])

  const challengeUser = useCallback((userInvitedSocketId) => {
    socket.emit("battle:invite", userInvitedSocketId, (isSended) => {
      if (isSended) {
        alert("Desafio enviado")
      }
    })
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

  const battleAction = useCallback((battleId, actionKey, actionValue) => {
    socket.emit("battle:actions", battleId, {
      actionKey,
      actionValue,
    })
  }, [])

  const changePokemonAction = useCallback((battleId, newPokemonId) => {
    socket.emit("battle:action-change", battleId, newPokemonId)
  }, [])

  const sendChatMessage = useCallback((message) => {
    socket.emit("chat:message", message)
  }, [])

  return (
    <SocketContext.Provider
      value={{
        socket,
        username,
        connectUsers,
        challenges,
        battle,
        isWaitingOponentMove,
        isConnected,
        isLoadingLogin,
        socketId,
        setUsername,
        refreshConnectedList,
        challengeUser,
        login,
        responseChallenge,
        battleAction,
        changePokemonAction,
        finishBattle,
        disconnect,
        sendChatMessage,
        chatMessages,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}
