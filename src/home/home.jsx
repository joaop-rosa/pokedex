import axios from "axios"
import { useState, useEffect, useRef, useCallback } from "react"
import s from "./home.module.css"
import { URL_BASE_ENDPOINT } from "../contants/endpoints"
import { CardPokemon } from "../card-pokemon/card-pokemon"
import { Spinner } from "../components/Spinner"
import _ from "lodash"

const POKEMONS_PER_PAGE = 12

export function Home() {
  const [pokemonFullList, setPokemonFullList] = useState([])
  const [pokemonList, setPokemonList] = useState([])
  const lastElementRef = useRef(null)
  const [lastPage, setLastPage] = useState(0)
  const [isListLoading, setIsListLoading] = useState(true)
  const [typeList, setTypeList] = useState([])
  const [selectedType, setSelectedType] = useState([])

  useEffect(() => {
    async function fetchPokemonsFullList() {
      const response = await axios.get(
        `${URL_BASE_ENDPOINT}/pokemon/?limit=10000&offset=0`
      )
      setPokemonFullList(response.data.results.map((pokemon) => pokemon.name))
    }
    fetchPokemonsFullList()
  }, [])

  useEffect(() => {
    async function fetchPokemons() {
      const response = await axios.get(
        `${URL_BASE_ENDPOINT}/pokemon/?limit=${POKEMONS_PER_PAGE}&offset=${lastPage}`
      )
      setPokemonList((prevList) => [
        ...prevList,
        ...response.data.results.map((pokemon) => pokemon.name),
      ])
      setIsListLoading(false)
    }
    fetchPokemons()
  }, [lastPage])

  const fetchPokemonByType = useCallback(async () => {
    let joinedList = []

    const responseType1 = await axios.get(
      `${URL_BASE_ENDPOINT}/type/${selectedType[0]}`
    )

    joinedList = [
      ...responseType1.data.pokemon.map((pokemon) => pokemon.pokemon.name),
    ]

    if (selectedType.length > 1) {
      const responseType2 = await axios.get(
        `${URL_BASE_ENDPOINT}/type/${selectedType[1]}`
      )

      joinedList = [
        ...joinedList,
        ...responseType2.data.pokemon.map((pokemon) => pokemon.pokemon.name),
      ]

      joinedList = [...new Set(joinedList)]
    }

    setPokemonList(joinedList)
    setIsListLoading(false)
  }, [selectedType])

  useEffect(() => {
    async function fetchTypes() {
      const response = await axios.get(`${URL_BASE_ENDPOINT}/type`)
      setTypeList(response.data.results)
    }
    fetchTypes()
  }, [])

  const handleElementVisibility = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        observer.disconnect()
        setLastPage((prev) => prev + POKEMONS_PER_PAGE)
        setIsListLoading(true)
      }
    })
  }

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
  }, [pokemonList])

  useEffect(() => {
    if (selectedType.length) {
      fetchPokemonByType()
    }
  }, [fetchPokemonByType, selectedType])

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
    setPokemonList([])
    setIsListLoading(true)
  }

  function handlePokemonName(event) {
    const inputValue = event.target.value
    const onChange = _.debounce(() => {
      setPokemonList(
        pokemonFullList.filter((pokemon) => pokemon.includes(inputValue))
      )
    }, 700)
    onChange()
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
        />

        <div className={s.typesFilterWrapper}>
          {typeList.map((type) => {
            return (
              <button
                key={type.name}
                className={s.buttonTypeFilter}
                onClick={handleButtonType}
                name={type.name}
                style={{
                  border: selectedType.includes(type.name)
                    ? "solid 3px pink"
                    : "",
                }}
              >
                {type.name.toUpperCase()}
                {selectedType.includes(type.name) ? <span>X</span> : null}
              </button>
            )
          })}
        </div>
        <div className={s.pokemonList}>
          {pokemonList.map((pokemon, index) => {
            return (
              <CardPokemon
                key={index}
                pokemon={pokemon}
                selectedType={selectedType}
                lastElementRef={
                  pokemonList.length === index + 1 ? lastElementRef : null
                }
              />
            )
          })}
        </div>
        {isListLoading ? <Spinner /> : null}
      </div>
    </section>
  )
}
