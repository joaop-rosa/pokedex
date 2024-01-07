import { useEffect } from "react"
import s from "./card-pokemon.module.css"
import axios from "axios"
import { useState } from "react"
import { URL_BASE_ENDPOINT } from "../contants/endpoints"
import { backgroundTipos } from "../contants/typesColors"
import { Spinner } from "../components/Spinner"
import cn from "classnames"

export function CardPokemon({ pokemon, lastElementRef, selectedType }) {
  const [isPokemonLoading, setIsPokemonLoading] = useState(true)
  const [pokemonDetalhado, setPokemonDetalhado] = useState([])
  const [fotoPokemon, setFotoPokemon] = useState([])
  const [pokemonType, setPokemonType] = useState()

  useEffect(() => {
    async function fetchDetalhePokemon() {
      const response = await axios.get(
        `${URL_BASE_ENDPOINT}/pokemon/${pokemon}`
      )
      setFotoPokemon(
        response.data.sprites.versions["generation-v"]["black-white"].animated
          .front_default
      )
      setPokemonType(
        response.data.types.reduce((acc, type) => [...acc, type.type.name], [])
      )
      setPokemonDetalhado(response.data)
      setIsPokemonLoading(false)
    }
    fetchDetalhePokemon()
  }, [pokemon])

  return (
    <div
      style={{
        backgroundColor:
          backgroundTipos[
            Object.keys(backgroundTipos).find((tipo) => {
              if (pokemonType) {
                return tipo === pokemonType[0]
              }
            })
          ],
      }}
      className={cn(s.cardPokemon, {
        [s.displayNone]:
          selectedType.length === 2
            ? !selectedType?.every((type) => pokemonType?.includes(type))
            : false,
      })}
      ref={lastElementRef}
    >
      {isPokemonLoading ? (
        <Spinner />
      ) : (
        <>
          <h3 className={s.numberPokemon}>{`#${pokemonDetalhado.id}`}</h3>
          <img
            loading="lazy"
            className={s.photoPokemon}
            src={fotoPokemon}
            alt={`Foto do pokemon ${pokemon}`}
          />
          <div className={s.typesWrapper}>
            {pokemonType.map((type, index) => (
              <div key={index} className={s.type}>
                <p className={s.typeName}>{type.toUpperCase()}</p>
              </div>
            ))}
          </div>
          <div className={s.namePokemonWrapper}>
            <h2 className={s.namePokemon}>{pokemon}</h2>
          </div>
        </>
      )}
    </div>
  )
}
