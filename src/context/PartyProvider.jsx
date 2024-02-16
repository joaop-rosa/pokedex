import { createContext, useEffect, useMemo, useState } from "react"
import { PARTY_KEY } from "../contants/storage"

const PARTY_INICIAL_CONTEXT = {
  party: [],
}

export const PartyContext = createContext(PARTY_INICIAL_CONTEXT)

export const MAX_PARTY_LENGTH = 6

export const PartyProvider = ({ children }) => {
  const [party, setParty] = useState(
    localStorage.getItem(PARTY_KEY)
      ? JSON.parse(localStorage.getItem(PARTY_KEY))
      : []
  )
  const isPartyFull = useMemo(() => party.length === MAX_PARTY_LENGTH, [party])

  useEffect(() => {
    if (party.length) {
      localStorage.setItem(PARTY_KEY, JSON.stringify(party))
    }
  }, [party])

  // Método para adicionar pokemon
  function addPokemonToParty(pokemon) {
    if (!isPartyFull) {
      setParty((prev) => [...prev, pokemon])
    }
  }

  // Método para remover pokemon

  // Talvez um método para editar o pokemon

  return (
    <PartyContext.Provider value={{ party, addPokemonToParty, isPartyFull }}>
      {children}
    </PartyContext.Provider>
  )
}
