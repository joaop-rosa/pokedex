import { createContext, useEffect, useMemo, useState } from "react"
import { useSocket } from "../hooks/useSocket"
import { useNavigate } from "react-router-dom"
import { Spinner } from "../components/UI/Spinner"

export const BattleContext = createContext({})

export function BattleProvider({ children }) {
  const { battle, username, isConnected } = useSocket()
  const { owner, userInvited } = battle
  const navigate = useNavigate()
  const [opponent, setOpponent] = useState(null)
  const [myUser, setMyUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMove, setSelectedMove] = useState(null)
  const [selectedPokemon, setSelectedPokemon] = useState(null)

  const hasToChangePokemon = useMemo(() => {
    if (!isLoading) {
      return getActivePokemon(myUser?.party).currentLife <= 0
    }

    return false
  }, [isLoading, myUser])

  const hasOpponentToChangePokemon = useMemo(() => {
    if (!isLoading) {
      return getActivePokemon(opponent?.party).currentLife <= 0
    }

    return false
  }, [isLoading, opponent])

  function getActivePokemon(party) {
    return party.find((pokemon) => pokemon.isActive)
  }

  useEffect(() => {
    if (isConnected && owner && userInvited) {
      const isOwner = owner.name === username

      if (isOwner) {
        setMyUser(owner)
        setOpponent(userInvited)
        setIsLoading(false)
        return
      }

      setMyUser(userInvited)
      setOpponent(owner)
      setIsLoading(false)
      setSelectedMove(null)
      setSelectedPokemon(null)
    }

    if (isConnected && !owner && !userInvited) {
      navigate("/lobby")
    }
  }, [isConnected, navigate, owner, userInvited, username])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <BattleContext.Provider
      value={{
        getActivePokemon,
        selectedMove,
        setSelectedMove,
        selectedPokemon,
        setSelectedPokemon,
        myUser,
        opponent,
        hasToChangePokemon,
        hasOpponentToChangePokemon,
      }}
    >
      {children}
    </BattleContext.Provider>
  )
}
