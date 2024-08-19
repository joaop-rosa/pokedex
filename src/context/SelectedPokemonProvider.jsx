import { createContext, useEffect, useMemo, useState } from "react"
import { useApi } from "../hooks/useApi"
import { LAST_POKEMON_NUMBER } from "../contants/generations"

export const SelectedPokemonContext = createContext({})

export const SEX_VARIATIONS = {
  MALE: "MALE",
  FEMALE: "FEMALE",
}

export const POSITION_VARIATIONS = {
  FRONT: "FRONT",
  BACK: "BACK",
}

export const SPRITE_VARIATIONS = {
  DEFAULT: "DEFAULT",
  SHINY: "SHINY",
  GMAX: "GMAX",
  MEGA: "MEGA",
}

export const INFOS_VARIATION = {
  DEFAULT: "DEFAULT",
  ABILITIES: "ABILITIES",
  MOVES: "MOVES",
  EVOLUTION_LINE: "EVOLUTION_LINE",
  FORMS: "FORMS",
  STATS: "STATS",
}

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
  const [infoScreenContent, setInfoScreenContent] = useState(
    INFOS_VARIATION.DEFAULT
  )
  const [spriteVariation, setSpriteVariation] = useState(
    SPRITE_VARIATIONS.DEFAULT
  )
  const [positionVariation, setPositionVariation] = useState(
    POSITION_VARIATIONS.FRONT
  )
  const [sexVariation, setSexVariation] = useState(SEX_VARIATIONS.MALE)

  const isFemale = useMemo(
    () => sexVariation === SEX_VARIATIONS.FEMALE,
    [sexVariation]
  )
  const isBack = useMemo(
    () => positionVariation === POSITION_VARIATIONS.BACK,
    [positionVariation]
  )
  const isShiny = useMemo(
    () => spriteVariation === SPRITE_VARIATIONS.SHINY,
    [spriteVariation]
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

  useEffect(() => {
    setInfoScreenContent(INFOS_VARIATION.DEFAULT)
    setSpriteVariation(SPRITE_VARIATIONS.DEFAULT)
    setPositionVariation(POSITION_VARIATIONS.FRONT)
    setSexVariation(SEX_VARIATIONS.MALE)
  }, [selectedPokemon])

  return (
    <SelectedPokemonContext.Provider
      value={{
        selectedPokemon,
        setSelectedPokemon,
        speciesInfo,
        setSpeciesInfo,
        isLoadingScreen,
        infoScreenContent,
        setInfoScreenContent,
        isFemale,
        isBack,
        isShiny,
        spriteVariation,
        setSpriteVariation,
        positionVariation,
        setPositionVariation,
        sexVariation,
        setSexVariation,
      }}
    >
      {children}
    </SelectedPokemonContext.Provider>
  )
}
