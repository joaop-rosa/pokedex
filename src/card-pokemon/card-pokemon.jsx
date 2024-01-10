import s from "./card-pokemon.module.css"
import { renderTypeClassnames } from "../contants/types"
import { Spinner } from "../components/Spinner"
import { useEffect, useState } from "react"
import cn from "classnames"
export function CardPokemon({ pokemon, lastElementRef }) {
  const [pokemonData, setPokemonData] = useState(pokemon)

  useEffect(() => {
    if (pokemon instanceof Promise) {
      pokemon.then((res) => {
        setPokemonData(res)
      })
    } else {
      setPokemonData(pokemon)
    }
  }, [pokemon])

  return (
    <div className={s.cardPokemon} ref={lastElementRef}>
      <div
        className={cn(
          s.cardPokemonContent,
          renderTypeClassnames(pokemonData?.types?.[0], s)
        )}
      >
        {!pokemonData?.sprite ? (
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
                <div
                  key={index}
                  className={cn(s.type, renderTypeClassnames(type, s))}
                >
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
    </div>
  )
}
