import s from "./card-pokemon.module.css"
import { backgroundTipos } from "../contants/typesColors"
import { Spinner } from "../components/Spinner"
import cn from "classnames"
import { useEffect, useState } from "react"

export function CardPokemon({ pokemon, lastElementRef }) {
  const [pokemonData, setPokemonData] = useState(pokemon)

  useEffect(() => {
    if (pokemon instanceof Promise) {
      pokemon.then((res) => {
        setPokemonData(res)
      })
    }
  }, [pokemon])

  return (
    <div
      style={{
        backgroundColor:
          backgroundTipos[
            Object.keys(backgroundTipos).find((tipo) => {
              if (pokemonData.types) {
                return tipo === pokemonData.types[0]
              }
            })
          ],
      }}
      className={s.cardPokemon}
      ref={lastElementRef}
    >
      {!pokemonData?.name ? (
        <Spinner />
      ) : (
        <>
          <h3 className={s.numberPokemon}>{`#${pokemonData.id}`}</h3>
          <img
            loading="lazy"
            className={s.photoPokemon}
            src={pokemonData.sprite}
            alt={`Foto do pokemon ${pokemonData.name}`}
          />
          <div className={s.typesWrapper}>
            {pokemonData.types.map((type, index) => (
              <div key={index} className={s.type}>
                <p className={s.typeName}>{type.toUpperCase()}</p>
              </div>
            ))}
          </div>
          <div className={s.namePokemonWrapper}>
            <h2 className={s.namePokemon}>{pokemonData.name}</h2>
          </div>
        </>
      )}
    </div>
  )
}
