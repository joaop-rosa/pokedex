import React, { useCallback, useEffect, useMemo, useState } from "react"
import s from "./PokemonDetailed.module.css"
import cn from "classnames"
import background from "../assets/img/detailed-background.png"
import { upperFirst } from "lodash"
import { renderTypeClassnames } from "../contants/types"
import { URL_BASE_ENDPOINT } from "../contants/endpoints"
import axios from "axios"
import ToggleSwitch from "./ToggleSwitch"
import { ReactComponent as FemaleIcon } from "../assets/icons/female.svg"
import { ReactComponent as MaleIcon } from "../assets/icons/male.svg"
import { ReactComponent as Rotate } from "../assets/icons/rotate.svg"

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
  FORMS: "FORMS",
  STATS: "STATS",
}

export default function PokemonDetailed({
  pokemon,
  setSelectedPokemon,
  fetchDetailedPokemon,
}) {
  const [speciesInfo, setSpeciesInfo] = useState(null)
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

  const isFemale = useMemo(
    () => sexVariation === SEX_VARIATIONS.FEMALE,
    [sexVariation]
  )
  const isBack = useMemo(
    () => positionVariation === POSITION_VARIATIONS.BACK,
    [positionVariation]
  )
  const isShiny = useMemo(
    () => spriteVariation === SPRITE_VARIATIONS.SHINY,
    [spriteVariation]
  )

  // Reset on pokemon selected change
  useEffect(() => {
    if (!pokemon) {
      setSpeciesInfo(null)
      setInfoScreenContent(INFOS_VARIATION.DEFAULT)
      setSpriteVariation(SPRITE_VARIATIONS.DEFAULT)
      setPositionVariation(POSITION_VARIATIONS.FRONT)
      setSexVariation(SEX_VARIATIONS.MALE)
    }
  }, [pokemon])

  const fetchPokemonSpecies = useCallback(async () => {
    if (pokemon) {
      const response = await axios.get(
        `${URL_BASE_ENDPOINT}/pokemon-species/${pokemon.id}/`
      )

      const description = response.data.flavor_text_entries

      const varietiesMapped = Promise.all(
        response.data.varieties.map(async (variation) => {
          return await fetchDetailedPokemon(variation.pokemon.name)
        })
      )

      varietiesMapped.then((varietiesMappedResolved) => {
        setSpeciesInfo({
          variations: varietiesMappedResolved,
          //mapear cadeia evolutiva
          hasFemale: response.data.has_gender_differences,
          isLegendary: response.data.is_legendary,
          isMythical: response.data.is_mythical,
          description:
            description[
              description.findIndex((entry) => entry.language.name === "en")
            ].flavor_text,
        })
      })
    }
  }, [fetchDetailedPokemon, pokemon])

  useEffect(() => {
    fetchPokemonSpecies()
  }, [fetchPokemonSpecies])

  function renderImage() {
    if (!pokemon.sprites.frontAnimated) {
      return pokemon.sprites.front
    }

    if (speciesInfo?.hasFemale && isFemale) {
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
    if (infoScreenContent === INFOS_VARIATION.DEFAULT) {
      return (
        <div className={s.infoScreenContent}>
          <div className={s.infoScreenContentInfo}>
            <div className={s.infoScreenContentRow}>
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
            <p className={s.infoScreenContentRow}>
              <span>Weight</span>
              {`${pokemon.weight}kg`}
            </p>
            <p className={s.infoScreenContentRow}>
              <span>Height</span>
              {`${pokemon.height}cm`}
            </p>
            <p className={s.infoScreenContentRow}>
              <span>Description</span>
              {speciesInfo?.description}
            </p>
          </div>
        </div>
      )
    }

    if (infoScreenContent === INFOS_VARIATION.FORMS) {
      return (
        <div className={s.variationsWrapper}>
          {speciesInfo?.variations.map((variation) => {
            return (
              <button
                onClick={() => setSelectedPokemon(variation)}
                key={variation.name}
                className={s.variation}
              >
                <img
                  className={s.variationImage}
                  src={variation.sprites.front}
                  alt={`Foto do pokemon ${pokemon.name}`}
                />
                <div className={s.variationInfos}>
                  <p>{upperFirst(variation.name)}</p>
                </div>
              </button>
            )
          })}
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
      isDisabled:
        !pokemon?.sprites?.backAnimatedFemaleShiny && isFemale && isBack,
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
      name: "Forms",
      action: () => setInfoScreenContent(INFOS_VARIATION.FORMS),
      isDisabled: false,
    },
    {
      name: "Stats",
      action: () => setInfoScreenContent(INFOS_VARIATION.STATS),
      isDisabled: false,
    },
  ]

  function handleBackdrop(event) {
    if (event.target.id === "backdrop") {
      setSelectedPokemon(null)
    }
  }

  function handleSexSwitch(event) {
    if (event.target.checked) {
      return setSexVariation(SEX_VARIATIONS.FEMALE)
    }

    return setSexVariation(SEX_VARIATIONS.MALE)
  }

  function handleRotateButton() {
    if (positionVariation === POSITION_VARIATIONS.FRONT) {
      return setPositionVariation(POSITION_VARIATIONS.BACK)
    }

    setPositionVariation(POSITION_VARIATIONS.FRONT)
  }

  function renderRotateButton() {
    if (!pokemon?.sprites?.backAnimatedFemaleShiny && isFemale && isShiny) {
      return null
    }
    return (
      <button className={s.rotateButton} onClick={handleRotateButton}>
        <Rotate className={s.rotateIcon} />
      </button>
    )
  }

  function renderToggleSwitchSex() {
    if (!speciesInfo?.hasFemale) {
      return null
    }

    if (!pokemon?.sprites?.backAnimatedFemaleShiny && isBack && isShiny) {
      return null
    }

    return (
      <div className={s.toggleSwitchWrapper}>
        <MaleIcon className={s.sexIcon} />
        <ToggleSwitch onChange={handleSexSwitch} />
        <FemaleIcon className={s.sexIcon} />
      </div>
    )
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
                      <p>{upperFirst(pokemon.name)}</p>
                      <p>{`#${pokemon.id}`}</p>
                    </div>
                  </>
                ) : null}
              </div>
              <div className={s.screenButtons}>
                {renderRotateButton()}
                {renderToggleSwitchSex()}
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
