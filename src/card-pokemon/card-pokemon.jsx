import s from "./card-pokemon.module.css"
import { renderTypeClassnames } from "../contants/types"
import { Spinner } from "../components/Spinner"
import { useEffect, useState } from "react"
import cn from "classnames"
export function CardPokemon({
  pokemon,
  lastElementRef,
  fetchDetailedPokemon,
  setSelectedPokemon,
}) {
  const [pokemonData, setPokemonData] = useState(pokemon)
  const [isPokemonAnimated, setIsPokemonAnimated] = useState(false)

  useEffect(() => {
    async function fetchPokemon() {
      const pokemonDetailed = await fetchDetailedPokemon(pokemon.name)
      setPokemonData(pokemonDetailed)
    }

    if (!pokemon.sprite) {
      fetchPokemon()
    }

    setPokemonData(pokemon)
  }, [fetchDetailedPokemon, pokemon])

  return (
    <button
      className={s.cardPokemon}
      ref={lastElementRef}
      onClick={() => setSelectedPokemon(pokemonData)}
      onMouseEnter={() => setIsPokemonAnimated(true)}
      onMouseLeave={() => setIsPokemonAnimated(false)}
    >
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
            <div className={s.pokemonPhotoWrapper}>
              <img
                loading="lazy"
                className={s.photoPokemon}
                src={
                  isPokemonAnimated && pokemonData.spriteAnimated
                    ? pokemonData.spriteAnimated
                    : pokemonData.sprite
                }
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
              <h2 className={s.namePokemon}>{pokemonData.name}</h2>
            </div>
          </>
        )}
      </div>
    </button>
  )
}
