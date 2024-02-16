import s from "./card-pokemon.module.css"
import { renderTypeClassnames } from "../contants/types"
import { Spinner } from "./Spinner"
import { useContext, useEffect, useState } from "react"
import cn from "classnames"
import { noop, upperFirst } from "lodash"
import { PartyContext } from "../context/PartyProvider"
export function CardPokemon({
  pokemon,
  lastElementRef,
  fetchDetailedPokemon,
  setSelectedPokemon,
}) {
  const [pokemonData, setPokemonData] = useState(null)
  const { isPartyFull, addPokemonToParty } = useContext(PartyContext)

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

  function handleCard(event) {
    if (event.target.id !== "buttonAddParty") {
      setSelectedPokemon(pokemonData)
    }
  }

  return (
    <div
      className={s.cardPokemon}
      ref={lastElementRef}
      onClick={pokemonData ? handleCard : noop}
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
            <div className={s.cardPokemonHeader}>
              <h3 className={s.numberPokemon}>{`#${pokemonData.id}`}</h3>
              {!isPartyFull ? (
                <button
                  onClick={() => addPokemonToParty(pokemonData)}
                  className={s.addPartyButton}
                  id="buttonAddParty"
                >
                  Add to party +
                </button>
              ) : null}
            </div>
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
    </div>
  )
}
