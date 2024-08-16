import { createContext, useEffect, useMemo, useState } from "react"
import { useApi } from "../hooks/useApi"
import { LAST_POKEMON_NUMBER } from "../contants/generations"

export const SelectedPokemonContext = createContext({})

export function SelectedPokemonProvider({ children }) {
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const [speciesInfo, setSpeciesInfo] = useState(null)
  const { fetchPokemonSpecies } = useApi()
  const hasSpecies = useMemo(
    () => selectedPokemon && selectedPokemon.id <= LAST_POKEMON_NUMBER,
    [selectedPokemon]
  )
  const isLoadingScreen = useMemo(
    () => !selectedPokemon || (hasSpecies && !speciesInfo),
    [hasSpecies, selectedPokemon, speciesInfo]
  )

  useEffect(() => {
    async function getSpeciesInfo() {
      const speciesInfo = await fetchPokemonSpecies(selectedPokemon)
      setSpeciesInfo(speciesInfo)
    }

    if (hasSpecies) {
      getSpeciesInfo()
    }
  }, [fetchPokemonSpecies, hasSpecies, selectedPokemon])

  return (
    <SelectedPokemonContext.Provider
      value={{
        selectedPokemon,
        setSelectedPokemon,
        speciesInfo,
        setSpeciesInfo,
        isLoadingScreen,
      }}
    >
      {children}
    </SelectedPokemonContext.Provider>
  )
}
