import React, { useCallback, useEffect, useMemo, useState } from "react"
import s from "./PokemonDetailed.module.css"
import cn from "classnames"
import background from "../assets/img/detailed-background.png"
import { toInteger, upperFirst } from "lodash"
import { renderTypeClassnames } from "../contants/types"
import { URL_BASE_ENDPOINT } from "../contants/endpoints"
import axios from "axios"
import ToggleSwitch from "./ToggleSwitch"
import { ReactComponent as FemaleIcon } from "../assets/icons/female.svg"
import { ReactComponent as MaleIcon } from "../assets/icons/male.svg"
import { ReactComponent as Rotate } from "../assets/icons/rotate.svg"
import { Accordion } from "./Accordion"
import RadarChart from "./RadarChart"
import { MovesScreen } from "./pokedex-screens/MovesScreen"
import { LAST_POKEMON_NUMBER } from "../contants/generations"
import { Spinner } from "./Spinner"

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
  const [isLoadingScreen, setIsLoadingScreen] = useState(true)

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

  // lock scroll
  useEffect(() => {
    if (pokemon) {
      document.body.style.overflow = "hidden"
    }

    return () => (document.body.style.overflow = "auto")
  }, [pokemon])

  // Reset on pokemon selected change
  useEffect(() => {
    if (!pokemon) {
      setSpeciesInfo(null)
    }

    setIsLoadingScreen(true)
    setInfoScreenContent(INFOS_VARIATION.DEFAULT)
    setSpriteVariation(SPRITE_VARIATIONS.DEFAULT)
    setPositionVariation(POSITION_VARIATIONS.FRONT)
    setSexVariation(SEX_VARIATIONS.MALE)
  }, [pokemon])

  const fetchPokemonSpecies = useCallback(async () => {
    if (pokemon && pokemon.id <= LAST_POKEMON_NUMBER) {
      const response = await axios.get(
        `${URL_BASE_ENDPOINT}/pokemon-species/${pokemon.id}/`
      )

      const description = response.data.flavor_text_entries

      const varietiesMapped = await Promise.all(
        response.data.varieties.map(async (variation) => {
          return await fetchDetailedPokemon(
            toInteger(variation.pokemon.url.match(/\/(\d+)\/$/)[1])
          )
        })
      )

      const { data: evolutionLine } = await axios.get(
        response.data.evolution_chain.url
      )

      async function evolutionLineMap(evolutionLine) {
        if (!evolutionLine.evolves_to.length) {
          return [
            await fetchDetailedPokemon(
              toInteger(evolutionLine.species.url.match(/\/(\d+)\/$/)[1])
            ),
          ]
        }

        return [
          await fetchDetailedPokemon(
            toInteger(evolutionLine.species.url.match(/\/(\d+)\/$/)[1])
          ),
          ...(await Promise.all(
            evolutionLine.evolves_to.map((pokemon) => {
              return evolutionLineMap(pokemon)
            })
          ).then((res) => res.flat(Infinity))),
        ]
      }

      const evolutionLineMapped = await evolutionLineMap(evolutionLine.chain)

      setSpeciesInfo({
        variations: varietiesMapped,
        evolutionLine: evolutionLineMapped,
        hasFemale: response.data.has_gender_differences,
        isLegendary: response.data.is_legendary,
        isMythical: response.data.is_mythical,
        description:
          description[
            description.findIndex((entry) => entry.language.name === "en")
          ].flavor_text,
      })

      setIsLoadingScreen(false)
    } else {
      setIsLoadingScreen(false)
    }
  }, [fetchDetailedPokemon, pokemon])

  useEffect(() => {
    fetchPokemonSpecies()
  }, [fetchPokemonSpecies])

  function renderImage() {
    if (!pokemon?.sprites?.frontAnimated) {
      return pokemon?.sprites.front
    }

    if (speciesInfo?.hasFemale && isFemale) {
      if (isBack && isShiny) {
        return pokemon?.sprites.backAnimatedFemaleShiny
      }

      if (isBack) {
        return pokemon?.sprites.backAnimatedFemale
      }

      if (isShiny) {
        return pokemon?.sprites.frontAnimatedFemaleShiny
      }

      return pokemon?.sprites.frontAnimatedFemale
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

    if (infoScreenContent === INFOS_VARIATION.EVOLUTION_LINE) {
      return (
        <div className={s.variationsWrapper}>
          {speciesInfo?.evolutionLine.map((variation) => {
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

    if (infoScreenContent === INFOS_VARIATION.ABILITIES) {
      return (
        <div className={s.abilitiesWrapper}>
          {pokemon.abilities.map((ability) => (
            <Accordion
              key={ability.name}
              header={
                <div className={s.abilityHeader}>
                  <div className={s.abilityHeaderInfo}>
                    <h4>
                      {upperFirst(ability.name)}
                      {ability.isHidden ? <span> (hidden)</span> : null}
                    </h4>
                    <p>{ability.effectShortDescription}</p>
                  </div>
                  <span className={s.abilityButtonOpen}>+</span>
                </div>
              }
              content={
                <div className={s.abilityContent}>
                  <p>{ability.effectDescription}</p>
                  <p>{ability.effectException}</p>
                </div>
              }
            />
          ))}
        </div>
      )
    }

    if (infoScreenContent === INFOS_VARIATION.STATS) {
      return <RadarChart stats={pokemon.stats} />
    }

    if (infoScreenContent === INFOS_VARIATION.MOVES) {
      return <MovesScreen pokemon={pokemon} />
    }
  }

  const BUTTONS = [
    {
      name: "Default",
      action: () => setSpriteVariation(SPRITE_VARIATIONS.DEFAULT),
      isDisabled: spriteVariation === SPRITE_VARIATIONS.DEFAULT,
    },
    {
      name: "Shiny",
      action: () => setSpriteVariation(SPRITE_VARIATIONS.SHINY),
      isDisabled:
        (!pokemon?.sprites?.backAnimatedFemaleShiny && isFemale && isBack) ||
        spriteVariation === SPRITE_VARIATIONS.SHINY ||
        !pokemon?.sprites?.frontAnimatedShiny,
    },
    {
      name: "Forms",
      action: () => setInfoScreenContent(INFOS_VARIATION.FORMS),
      isDisabled: isLoadingScreen || speciesInfo?.variations.length === 1,
    },
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
      isDisabled: Object.keys(pokemon?.moves ?? {}).length === 0,
    },
    {
      name: "Evolution line",
      action: () => setInfoScreenContent(INFOS_VARIATION.EVOLUTION_LINE),
      isDisabled: false,
    },
    {
      name: "Stats",
      action: () => setInfoScreenContent(INFOS_VARIATION.STATS),
      isDisabled: false,
    },
    {
      name: "Close",
      action: () => setSelectedPokemon(null),
      isDisabled: false,
      class: s.closeButton,
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
    const isDisabled = () => {
      if (!pokemon?.sprites?.backAnimatedFemaleShiny && isFemale && isShiny) {
        return true
      }

      if (!pokemon?.sprites?.backAnimatedShiny && isShiny) {
        return true
      }

      if (!pokemon?.sprites?.backAnimatedFemale && isFemale) {
        return true
      }

      if (!pokemon?.sprites?.backAnimated) {
        return true
      }

      return false
    }

    return (
      <button
        className={cn(s.rotateButton, {
          [s.rotateButtonDisabled]: isDisabled(),
        })}
        onClick={handleRotateButton}
        disabled={isDisabled()}
      >
        <Rotate className={s.rotateIcon} />
      </button>
    )
  }

  function renderToggleSwitchSex() {
    const isDisabled = () => {
      if (!speciesInfo?.hasFemale || !pokemon?.sprites?.frontAnimatedFemale) {
        return true
      }

      if (!pokemon?.sprites?.backAnimatedFemaleShiny && isBack && isShiny) {
        return true
      }

      return false
    }

    return (
      <div
        className={cn(s.toggleSwitchWrapper, {
          [s.toggleSwitchWrapperDisabled]: isDisabled(),
        })}
      >
        <MaleIcon className={s.sexIcon} />
        <ToggleSwitch onChange={handleSexSwitch} isDisabled={isDisabled()} />
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

            <div
              className={cn(s.infoScreen, { [s.infoScreenActive]: pokemon })}
            >
              {pokemon ? (
                <div className={s.infoScreenContentWrapper}>
                  {!isLoadingScreen ? (
                    renderInfoScreen()
                  ) : (
                    <Spinner containerClassname={s.spinnerScreen} />
                  )}
                </div>
              ) : null}
            </div>
            <div className={s.buttonsWrapper}>
              {BUTTONS.map((button) => (
                <button
                  key={button.name}
                  disabled={button.isDisabled}
                  className={cn(s.button, button?.class, {
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
