import React, { useState } from "react"
import s from "./PokemonDetailed.module.css"
import cn from "classnames"

export default function PokemonDetailed({ pokemon, setSelectedPokemon }) {
  const [hasFemale, setHasFemale] = useState(false)
  const [isFemale, setIsFemale] = useState(false)
  const [isBack, setIsBack] = useState(false)
  const [isShiny, setIsShiny] = useState(false)

  function renderImage() {
    if (hasFemale && isFemale) {
      if (isBack && isShiny) {
        return pokemon.sprites.backAnimatedFemaleShiny
      }

      if (isBack) {
        return pokemon.sprites.backAnimatedFemale
      }

      if (isShiny) {
        return pokemon.sprites.frontAnimatedFemaleShiny
      }

      return pokemon.sprites.frontAnimatedFemale
    }

    if (isBack && isShiny) {
      return pokemon.sprites.backAnimatedShiny
    }

    if (isBack) {
      return pokemon.sprites.backAnimated
    }

    if (isShiny) {
      return pokemon.sprites.frontAnimatedShiny
    }

    if (pokemon?.sprites?.frontAnimated) {
      return pokemon.sprites.frontAnimated
    }

    if (pokemon?.sprites?.front) {
      return pokemon.sprites.front
    }

    return null
  }

  const BUTTONS = [
    {
      name: "General",
      action: () => {},
      isDisabled: false,
    },
    {
      name: "Abilities",
      action: () => {},
      isDisabled: false,
    },
    {
      name: "Moves",
      action: () => {},
      isDisabled: false,
    },
    {
      name: "Shiny",
      action: () => {},
      isDisabled: false,
    },
    {
      name: "Evolution line",
      action: () => {},
      isDisabled: false,
    },
    {
      name: "Default",
      action: () => {},
      isDisabled: false,
    },
    {
      name: "GMAX",
      action: () => {},
      isDisabled: false,
    },
    {
      name: "Mega",
      action: () => {},
      isDisabled: false,
    },
  ]

  return (
    <div
      onClick={() => setSelectedPokemon(null)}
      className={cn(s.backdrop, { [s.backdropActive]: pokemon })}
    >
      <div className={s.contentWrapper}>
        <div className={s.container}>
          <div className={s.content}>
            <div className={s.screenWrapper}>
              <div className={s.screen}>
                {pokemon ? (
                  <>
                    <div className={s.photoPokemonWrapper}>
                      <img
                        loading="lazy"
                        className={s.photoPokemon}
                        src={renderImage()}
                        alt={`Foto do pokemon ${pokemon?.name}`}
                      />
                    </div>

                    <div className={s.pokemonInfoWrapper}>
                      <p>{`#${pokemon.id}`}</p>
                      <p>{pokemon.name}</p>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
            <div className={s.infoScreen}>
              <div className={s.infoScreenContent}></div>
            </div>
            <div className={s.buttonsWrapper}>
              {BUTTONS.map((button) => (
                <button
                  disabled={button.isDisabled}
                  className={cn(s.button, {
                    [s.buttonDisabled]: button.isDisabled,
                  })}
                  onClick={button.action}
                >
                  {button.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
