import { createContext, useCallback, useEffect, useMemo, useState } from "react"
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

  function idGenerator() {
    return crypto.randomUUID()
  }

  const editPokemonFromParty = useCallback(
    (pokemon) => {
      const indexOnParty = party.findIndex(
        (pokemonParty) => pokemonParty.partyId === pokemon.partyId
      )
      console.log("indexOnParty", indexOnParty)

      const newParty = [...party]
      newParty[indexOnParty] = pokemon
      console.log("newParty", newParty)
      setParty(newParty)
    },
    [party]
  )

  useEffect(() => {
    if (party.length) {
      localStorage.setItem(PARTY_KEY, JSON.stringify(party))
    }
  }, [party, editPokemonFromParty])

  function addPokemonToParty(pokemon) {
    if (!isPartyFull) {
      setParty((prev) => [...prev, { partyId: idGenerator(), ...pokemon }])
    }
  }

  function removePokemonFromParty(pokemon) {
    setParty(
      party.filter((pokemonParty) => pokemonParty.partyId !== pokemon.partyId)
    )
  }

  return (
    <PartyContext.Provider
      value={{
        party,
        addPokemonToParty,
        removePokemonFromParty,
        editPokemonFromParty,
        isPartyFull,
      }}
    >
      {children}
    </PartyContext.Provider>
  )
}
