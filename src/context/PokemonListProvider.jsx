import { createContext, useCallback, useEffect, useMemo, useState } from "react"
import { useApi } from "../hooks/useApi"
import { useEffectOnce } from "react-use"

export const PokemonListContext = createContext({})

export function PokemonListProvider({ children }) {
  const POKEMONS_PER_PAGE = 12
  const [pokemonFullList, setPokemonFullList] = useState([])
  const [pokemonListFinal, setPokemonListFinal] = useState([])
  const [typeList, setTypeList] = useState([])
  const [selectedType, setSelectedType] = useState([])
  const [pageSize, setPageSize] = useState(POKEMONS_PER_PAGE)
  const [textFilter, setTextFilter] = useState("")
  const [selectedGeneration, setSelectedGeneration] = useState(null)
  const [isListLoading, setIsListLoading] = useState(true)
  const isReady = useMemo(
    () => typeList && pokemonFullList,
    [pokemonFullList, typeList]
  )
  const isEmpty = useMemo(
    () => !isListLoading && !pokemonListFinal,
    [isListLoading, pokemonListFinal]
  )
  const pokemonList = useMemo(
    () => pokemonListFinal.slice(0, pageSize),
    [pageSize, pokemonListFinal]
  )

  const { fetchTypes, fetchPokemonsFullList, fetchPokemonByType } = useApi()

  useEffectOnce(() => {
    async function getTypes() {
      const types = await fetchTypes()
      setTypeList(types)
    }

    getTypes()
  }, [fetchTypes])

  useEffectOnce(() => {
    async function getPokemonList() {
      const fullPokemonList = await fetchPokemonsFullList()
      setPokemonFullList(fullPokemonList)
    }

    getPokemonList()
  }, [fetchPokemonsFullList])

  const applyBasicFilter = useCallback(
    (list) => {
      let filteredList = list.filter((pokemon) =>
        pokemon.name.includes(textFilter.toLowerCase())
      )

      if (selectedGeneration) {
        filteredList = filteredList.filter(
          (pokemon) =>
            pokemon.id >= selectedGeneration.start &&
            pokemon.id <= selectedGeneration.final
        )
      }

      return filteredList
    },
    [selectedGeneration, textFilter]
  )

  useEffect(() => {
    async function getPokemonListByType() {
      const typePokemonList = await fetchPokemonByType(selectedType)
      const typePokemonListWithFilters = applyBasicFilter(typePokemonList)
      setPokemonListFinal(typePokemonListWithFilters)
    }
    setIsListLoading(true)
    setPokemonListFinal([])
    if (pokemonFullList.length) {
      setPageSize(POKEMONS_PER_PAGE)
      if (selectedType.length) {
        getPokemonListByType()
      } else {
        setPokemonListFinal(applyBasicFilter(pokemonFullList))
      }
    }
    setIsListLoading(false)
  }, [applyBasicFilter, fetchPokemonByType, pokemonFullList, selectedType])

  return (
    <PokemonListContext.Provider
      value={{
        POKEMONS_PER_PAGE,
        isReady,
        isListLoading,
        selectedGeneration,
        setSelectedGeneration,
        setTextFilter,
        pageSize,
        setPageSize,
        pokemonList,
        isEmpty,
        typeList,
        setSelectedType,
        selectedType,
        setIsListLoading,
      }}
    >
      {children}
    </PokemonListContext.Provider>
  )
}
