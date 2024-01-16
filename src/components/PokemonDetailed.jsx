import React, { useState } from "react"
import s from "./PokemonDetailed.module.css"
import cn from "classnames"
import background from "../assets/img/detailed-background.png"
import { upperFirst } from "lodash"
import { renderTypeClassnames } from "../contants/types"

const SEX_VARIATIONS = {
  MALE: "MALE",
  FEMALE: "FEMALE",
}

const POSITION_VARIATIONS = {
  FRONT: "FRONT",
  BACK: "BACK",
}

const SPRITE_VARIATIONS = {
  DEFAULT: "DEFAULT",
  SHINY: "SHINY",
  GMAX: "GMAX",
  MEGA: "MEGA",
}

const INFOS_VARIATION = {
  DEFAULT: "DEFAULT",
  ABILITIES: "ABILITIES",
  MOVES: "MOVES",
  EVOLUTION_LINE: "EVOLUTION_LINE",
}

export default function PokemonDetailed({ pokemon, setSelectedPokemon }) {
  const [hasFemale, setHasFemale] = useState(false)
  const [hasGmax, setHasGmax] = useState(false)
  const [hasMega, setHasMega] = useState(false)
  const [infoScreenContent, setInfoScreenContent] = useState(
    INFOS_VARIATION.DEFAULT
  )
  const [spriteVariation, setSpriteVariation] = useState(
    SPRITE_VARIATIONS.DEFAULT
  )
  const [positionVariation, setPositionVariation] = useState(
    POSITION_VARIATIONS.FRONT
  )
  const [sexVariation, setSexVariation] = useState(SEX_VARIATIONS.MALE)

  //Pensar em como fazer com formas alternativas

  function renderImage() {
    const isFemale = sexVariation === SEX_VARIATIONS.FEMALE
    const isBack = positionVariation === POSITION_VARIATIONS.BACK
    const isShiny = spriteVariation === SPRITE_VARIATIONS.SHINY

    if (!pokemon.sprites.frontAnimated) {
      return pokemon.sprites.front
    }

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

    return pokemon.sprites.frontAnimated
  }

  function renderInfoScreen() {
    console.log(pokemon)

    if (infoScreenContent === INFOS_VARIATION.DEFAULT) {
      return (
        <div className={s.infoScreenContent}>
          <div className={s.infoScreenContentInfo}>
            <div>
              <span>Types</span>
              <div className={s.typesWrapper}>
                {pokemon.types.map((type, index) => (
                  <div
                    key={index}
                    className={cn(s.type, renderTypeClassnames(type, s))}
                  >
                    <p className={s.typeName}>{type.toUpperCase()}</p>
                  </div>
                ))}
              </div>
            </div>
            <p>
              <span>Weight</span>
              {`${pokemon.weight}kg`}
            </p>
            <p>
              <span>Height</span>
              {`${pokemon.height}cm`}
            </p>
            <p>
              <span>Description</span>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
      )
    }
  }

  const BUTTONS = [
    {
      name: "General",
      action: () => setInfoScreenContent(INFOS_VARIATION.DEFAULT),
      isDisabled: false,
    },
    {
      name: "Abilities",
      action: () => setInfoScreenContent(INFOS_VARIATION.ABILITIES),
      isDisabled: false,
    },
    {
      name: "Moves",
      action: () => setInfoScreenContent(INFOS_VARIATION.MOVES),
      isDisabled: false,
    },
    {
      name: "Shiny",
      action: () => setSpriteVariation(SPRITE_VARIATIONS.SHINY),
      isDisabled: false,
    },
    {
      name: "Evolution line",
      action: () => setInfoScreenContent(INFOS_VARIATION.EVOLUTION_LINE),
      isDisabled: false,
    },
    {
      name: "Default",
      action: () => setSpriteVariation(SPRITE_VARIATIONS.DEFAULT),
      isDisabled: false,
    },
    {
      name: "GMAX",
      action: () => setSpriteVariation(SPRITE_VARIATIONS.GMAX),
      isDisabled: !hasGmax,
    },
    {
      name: "Mega",
      action: () => setSpriteVariation(SPRITE_VARIATIONS.MEGA),
      isDisabled: !hasMega,
    },
  ]

  function handleBackdrop(event) {
    if (event.target.id === "backdrop") {
      setSelectedPokemon(null)
    }
  }

  return (
    <div
      id="backdrop"
      onClick={handleBackdrop}
      className={cn(s.backdrop, { [s.backdropActive]: pokemon })}
    >
      <div className={s.contentWrapper}>
        <div className={s.container}>
          <div className={s.content}>
            <div className={s.screenWrapper}>
              <div className={s.screen}>
                {pokemon ? (
                  <>
                    <img src={background} className={s.background} alt="" />
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
                      <p>{upperFirst(pokemon.name)}</p>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
            <div className={s.infoScreen}>
              {pokemon ? (
                <div className={s.infoScreenContentWrapper}>
                  {renderInfoScreen()}
                </div>
              ) : null}
            </div>
            <div className={s.buttonsWrapper}>
              {BUTTONS.map((button) => (
                <button
                  key={button.name}
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
