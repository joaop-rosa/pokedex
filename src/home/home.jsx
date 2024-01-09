import axios from "axios"
import { useState, useEffect, useRef, useCallback } from "react"
import s from "./home.module.css"
import { URL_BASE_ENDPOINT } from "../contants/endpoints"
import { CardPokemon } from "../card-pokemon/card-pokemon"
import { Spinner } from "../components/Spinner"
import _, { toInteger } from "lodash"
import cn from "classnames"
import { GENERATIONS, LAST_POKEMON_NUMBER } from "../contants/generations"

const POKEMONS_PER_PAGE = 12

export function Home() {
  const [pokemonFullList, setPokemonFullList] = useState([])
  const [pokemonByTypeFullList, setPokemonByTypeFullList] = useState([])
  const [pokemonList, setPokemonList] = useState([])
  const lastElementRef = useRef(null)
  const [isListLoading, setIsListLoading] = useState(true)
  const [typeList, setTypeList] = useState([])
  const [selectedType, setSelectedType] = useState([])
  const [pageSize, setPageSize] = useState(POKEMONS_PER_PAGE)
  const [inputTextFilter, setInputTextFilter] = useState("")
  const [selectedGeneration, setSelectedGeneration] = useState(null)
  const [pokemonListRender, setPokemonListRender] = useState([])

  console.log("pokemonList", pokemonList)
  console.log("pokemonListRender", pokemonListRender)

  useEffect(() => {
    async function fetchTypes() {
      const response = await axios.get(`${URL_BASE_ENDPOINT}/type`)
      setTypeList(response.data.results)
    }
    fetchTypes()
  }, [])

  // Used to fix render bug
  useEffect(() => {
    setPokemonListRender([])
    setPokemonListRender(pokemonList)
  }, [pokemonList])

  useEffect(() => {
    async function fetchPokemonsFullList() {
      const response = await axios.get(
        `${URL_BASE_ENDPOINT}/pokemon/?limit=${LAST_POKEMON_NUMBER}&offset=0`
      )
      const mappedResponse = response.data.results.map((pokemon) => ({
        name: pokemon.name,
        id: toInteger(pokemon.url.match(/\/(\d+)\/$/)[1]),
      }))

      setPokemonFullList(mappedResponse)
      setPokemonList(mappedResponse)
    }
    fetchPokemonsFullList()
  }, [])

  const applyBasicFilter = useCallback(
    (list) => {
      let tempList = [...list]
      tempList = list.filter((pokemon) =>
        pokemon.name.includes(inputTextFilter)
      )
      if (selectedGeneration) {
        tempList = tempList.filter(
          (pokemon) =>
            pokemon.id >= selectedGeneration.start &&
            pokemon.id <= selectedGeneration.final
        )
      }

      return tempList
    },
    [inputTextFilter, selectedGeneration]
  )

  const fetchPokemonByType = useCallback(async () => {
    if (selectedType.length) {
      let joinedList = []

      const responseType1 = await axios.get(
        `${URL_BASE_ENDPOINT}/type/${selectedType[0]}`
      )

      joinedList = [
        ...responseType1.data.pokemon.map((pokemon) => ({
          name: pokemon.pokemon.name,
          id: toInteger(pokemon.pokemon.url.match(/\/(\d+)\/$/)[1]),
        })),
      ]

      if (selectedType.length > 1) {
        const responseType2 = await axios.get(
          `${URL_BASE_ENDPOINT}/type/${selectedType[1]}`
        )

        joinedList = [
          ...joinedList,
          ...responseType2.data.pokemon.map((pokemon) => ({
            name: pokemon.pokemon.name,
            id: toInteger(pokemon.pokemon.url.match(/\/(\d+)\/$/)[1]),
          })),
        ]

        joinedList = joinedList.filter(
          (pokemon, index, self) =>
            index ===
            self.findIndex((selfPokemon) => selfPokemon.name === pokemon.name)
        )
      }

      joinedList = joinedList.filter(
        (pokemon) => pokemon.id < LAST_POKEMON_NUMBER
      )

      setPokemonByTypeFullList(joinedList)
    }
  }, [selectedType])

  const fetchDetailedPokemon = useCallback(async (pokemonName) => {
    const response = await axios.get(
      `${URL_BASE_ENDPOINT}/pokemon/${pokemonName}`
    )

    return {
      sprite: response.data.sprites.front_default,
      types: response.data.types.reduce(
        (acc, type) => [...acc, type.type.name],
        []
      ),
      id: response.data.id,
      name: response.data.name,
      otherParams: response.data,
    }
  }, [])

  useEffect(() => {
    async function getDetailedPokemons() {
      const pokemonListByTypeDetailed = await Promise.all(
        applyBasicFilter(pokemonByTypeFullList).map(async (pokemon) => {
          const detailedPokemon = await fetchDetailedPokemon(pokemon.name)
          return detailedPokemon
        })
      )

      return pokemonListByTypeDetailed.filter((pokemon) =>
        selectedType.every((type) => pokemon.types.includes(type))
      )
    }

    if (selectedType.length) {
      if (selectedType.length > 1) {
        getDetailedPokemons().then((filteredPokemonList) => {
          setPokemonList(filteredPokemonList)
        })
      } else {
        setPokemonList(applyBasicFilter(pokemonByTypeFullList))
      }
    } else {
      setPokemonList(applyBasicFilter(pokemonFullList))
    }
    setIsListLoading(false)
  }, [
    applyBasicFilter,
    fetchDetailedPokemon,
    pokemonByTypeFullList,
    pokemonFullList,
    selectedType,
  ])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => handleElementVisibility(entries, observer),
      {
        threshold: 0.5,
      }
    )

    if (lastElementRef.current) {
      observer.observe(lastElementRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [pageSize, pokemonList])

  useEffect(() => {
    if (selectedType.length) {
      fetchPokemonByType()
    }
    setPokemonList(applyBasicFilter(pokemonFullList))
  }, [applyBasicFilter, fetchPokemonByType, pokemonFullList, selectedType])

  useEffect(() => {
    setPageSize(POKEMONS_PER_PAGE)
  }, [pokemonList])

  const handleElementVisibility = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        observer.disconnect()
        setPageSize((prev) => prev + POKEMONS_PER_PAGE)
      }
    })
  }

  function handleButtonType(event) {
    const typeClicked = event.target.name
    setSelectedType((prev) => {
      if (prev.includes(typeClicked)) {
        return prev.filter((type) => type !== typeClicked)
      }

      if (prev.length === 2) {
        return [typeClicked]
      }

      return [...prev, typeClicked]
    })
  }

  function handlePokemonName(event) {
    const inputValue = event.target.value
    const onChange = _.debounce(() => {
      setInputTextFilter(inputValue)
    }, 700)
    onChange()
  }

  function handleGeneration(generation) {
    if (selectedGeneration && selectedGeneration.number === generation.number) {
      setSelectedGeneration(null)
    } else {
      setSelectedGeneration(generation)
    }
  }

  return (
    <section className={s.sectionHome}>
      <div className={s.container}>
        <div className={s.header}>
          <h1>Pokedex</h1>
        </div>

        <input
          type="text"
          className={s.inputText}
          onChange={handlePokemonName}
          placeholder="Digite o nome do pokemon"
        />
        <div className={s.typesFilterWrapper}>
          {typeList.map((type) => {
            return (
              <button
                key={type.name}
                className={cn(s.buttonTypeFilter, {
                  [s.buttonTypeFilterSelected]: selectedType.includes(
                    type.name
                  ),
                })}
                onClick={handleButtonType}
                name={type.name}
              >
                {type.name.toUpperCase()}
                {selectedType.includes(type.name) ? <span>X</span> : null}
              </button>
            )
          })}
        </div>
        <div className={s.generationWrapper}>
          {GENERATIONS.map((generation) => (
            <button
              key={generation.number}
              onClick={() => handleGeneration(generation)}
            >
              {`Geração ${generation.number}`}
              {selectedGeneration?.number === generation.number ? (
                <span>X</span>
              ) : null}
            </button>
          ))}
        </div>
        <div className={s.pokemonList}>
          {pokemonListRender.length && !isListLoading ? (
            pokemonListRender.slice(0, pageSize).map((pokemon, index) => {
              return (
                <CardPokemon
                  key={index}
                  pokemon={
                    selectedType.length === 2
                      ? pokemon.name
                      : fetchDetailedPokemon(pokemon.name)
                  }
                  lastElementRef={
                    pageSize === index + 1 ? lastElementRef : null
                  }
                />
              )
            })
          ) : (
            <p className={s.listEmpty}>Nenhum pokemon encontrado</p>
          )}
        </div>
        {isListLoading ? <Spinner /> : null}
      </div>
    </section>
  )
}
