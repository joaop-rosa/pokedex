import s from "./card-pokemon.module.css"
import { renderTypeClassnames } from "../../contants/types"
import { Spinner } from "../Spinner"
import { useEffect, useState } from "react"
import cn from "classnames"
import { noop, upperFirst } from "lodash"
export function CardPokemon({
  pokemon,
  lastElementRef,
  fetchDetailedPokemon,
  setSelectedPokemon,
}) {
  const [pokemonData, setPokemonData] = useState(null)

  useEffect(() => {
    async function fetchPokemon() {
      const pokemonDetailed = await fetchDetailedPokemon(pokemon.name)
      setPokemonData(pokemonDetailed)
    }

    if (!pokemon.sprites) {
      fetchPokemon()
    } else {
      setPokemonData(pokemon)
    }
  }, [fetchDetailedPokemon, pokemon])

  return (
    <button
      className={s.cardPokemon}
      ref={lastElementRef}
      onClick={pokemonData ? () => setSelectedPokemon(pokemonData) : noop}
    >
      <div
        className={cn(
          s.cardPokemonContent,
          renderTypeClassnames(pokemonData?.types?.[0], s)
        )}
      >
        {!pokemonData?.sprites ? (
          <Spinner />
        ) : (
          <>
            <h3 className={s.numberPokemon}>{`#${pokemonData.id}`}</h3>
            <div className={s.pokemonPhotoWrapper}>
              <img
                loading="lazy"
                className={s.photoPokemon}
                src={pokemonData.sprites.front}
                alt={`Foto do pokemon ${pokemonData.name}`}
              />
            </div>

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
              <h2 className={s.namePokemon}>{upperFirst(pokemonData.name)}</h2>
            </div>
          </>
        )}
      </div>
    </button>
  )
}
