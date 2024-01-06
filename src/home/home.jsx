import axios from "axios"
import { useState, useEffect, useRef } from "react"
import s from "./home.module.css"
import { URL_BASE_ENDPOINT } from "../contants/endpoints"
import { CardPokemon } from "../card-pokemon/card-pokemon"

const POKEMONS_PER_PAGE = 10

export function Home() {
  const [listaPokemons, setListaPokemons] = useState([])
  const lastElementRef = useRef(null)
  const [lastPage, setLastPage] = useState(0)
  const [isListLoading, setIsListLoading] = useState(true)

  useEffect(() => {
    async function fetchPokemons() {
      const response = await axios.get(
        `${URL_BASE_ENDPOINT}/pokemon/?limit=${POKEMONS_PER_PAGE}&offset=${lastPage}`
      )
      setListaPokemons((prevList) => [...prevList, ...response.data.results])
      setIsListLoading(false)
    }
    fetchPokemons()
  }, [lastPage])

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

    console.log(lastElementRef.current)

    return () => {
      observer.disconnect()
    }
  }, [listaPokemons])

  return (
    <section className={s.sectionHome}>
      <div className={s.container}>
        <div className={s.header}>
          <h1>Pokedex</h1>
        </div>
        <input type="text" className={s.inputText} />

        <div className={s.pokemonList}>
          {listaPokemons.map((pokemon, index) => {
            return (
              <CardPokemon
                key={index}
                pokemon={pokemon}
                lastElementRef={
                  listaPokemons.length === index + 1 ? lastElementRef : null
                }
              />
            )
          })}
        </div>
        {isListLoading ? "Loading..." : null}
      </div>
    </section>
  )
}
