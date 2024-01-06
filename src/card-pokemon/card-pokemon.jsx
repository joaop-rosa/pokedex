import { useEffect } from "react"
import s from "./card-pokemon.module.css"
import axios from "axios"
import { useState } from "react"
import { URL_BASE_ENDPOINT } from "../contants/endpoints"
import { backgroundTipos } from "../contants/typesColors"

export function CardPokemon({ pokemon, lastElementRef }) {
  const [isPokemonLoading, setIsPokemonLoading] = useState(true)
  const [pokemonDetalhado, setPokemonDetalhado] = useState([])
  const [fotoPokemon, setFotoPokemon] = useState([])
  const [tipoPokemon, setTipoPokemon] = useState()

  useEffect(() => {
    async function fetchDetalhePokemon() {
      const response = await axios.get(
        `${URL_BASE_ENDPOINT}/pokemon/${pokemon.name}`
      )
      setFotoPokemon(
        response.data.sprites.versions["generation-v"]["black-white"].animated
          .front_default
      )
      setTipoPokemon(response.data.types)
      setPokemonDetalhado(response.data)
      setIsPokemonLoading(false)
    }
    fetchDetalhePokemon()
  }, [])

  console.log(tipoPokemon)

  return (
    <div
      style={{
        backgroundColor:
          backgroundTipos[
            Object.keys(backgroundTipos).find((tipo) => {
              if (tipoPokemon) {
                return tipo === tipoPokemon[0].type.name
              }
            })
          ],
      }}
      className={s.cardPokemon}
      ref={lastElementRef}
    >
      {isPokemonLoading ? (
        "Loading..."
      ) : (
        <>
          <h3 className={s.numberPokemon}>{`#${pokemonDetalhado.id}`}</h3>
          <img
            loading="lazy"
            className={s.photoPokemon}
            src={fotoPokemon}
            alt={`Foto do pokemon ${pokemon.name}`}
          />
          <div className={s.typesWrapper}>
            {tipoPokemon.map((type, index) => (
              <div key={index} className={s.type}>
                <p className={s.typeName}>{type.type.name.toUpperCase()}</p>
              </div>
            ))}
          </div>
          <div className={s.namePokemonWrapper}>
            <h2 className={s.namePokemon}>{pokemon.name}</h2>
          </div>
        </>
      )}
    </div>
  )
}
