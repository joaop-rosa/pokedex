import { createContext, useCallback, useEffect, useMemo, useState } from "react"
import { PARTY_KEY } from "../contants/storage"
import { useApi } from "../hooks/useApi"

const PARTY_INICIAL_CONTEXT = {
  party: [],
}

export const PartyContext = createContext(PARTY_INICIAL_CONTEXT)

export const MAX_PARTY_LENGTH = 6

export const MOVE_SELECT_PROPS = {
  ATTACK1: "ATTACK1",
  ATTACK2: "ATTACK2",
  ATTACK3: "ATTACK3",
  ATTACK4: "ATTACK4",
  ABILITY: "ABILITY",
}

export const PartyProvider = ({ children }) => {
  const { fetchMove } = useApi()
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

      const newParty = [...party]
      newParty[indexOnParty] = pokemon
      setParty(newParty)
    },
    [party]
  )

  useEffect(() => {
    if (party.length) {
      localStorage.setItem(PARTY_KEY, JSON.stringify(party))
    }
  }, [party, editPokemonFromParty])

  async function addPokemonToParty(pokemon) {
    if (!isPartyFull) {
      console.log(pokemon)
      const firstMove = await fetchMove(pokemon.moves["LEVEL UP"][0].url)

      setParty((prev) => [
        ...prev,
        {
          partyId: idGenerator(),
          ...pokemon,
          movesSelected: {
            // [MOVE_SELECT_PROPS.ABILITY]: pokemon.abilities[0],
            [MOVE_SELECT_PROPS.ATTACK1]: firstMove,
            [MOVE_SELECT_PROPS.ATTACK2]: null,
            [MOVE_SELECT_PROPS.ATTACK3]: null,
            [MOVE_SELECT_PROPS.ATTACK4]: null,
          },
        },
      ])
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
