import React, { useEffect, useMemo, useState } from "react"
import s from "./PokemonDetailed.module.css"
import cn from "classnames"
import background from "../assets/img/detailed-background.png"
import { ReactComponent as FemaleIcon } from "../assets/icons/female.svg"
import { ReactComponent as MaleIcon } from "../assets/icons/male.svg"
import { ReactComponent as Rotate } from "../assets/icons/rotate.svg"
import { MovesScreen } from "./pokedex-screens/MovesScreen"
import { RadarChart } from "./pokedex-screens/RadarChart"
import { ToggleSwitch } from "../components/UI/ToggleSwitch"
import { Spinner } from "../components/UI/Spinner"
import { useSelectedPokemon } from "../hooks/useSelectedPokemon"
import { FormsScreen } from "./pokedex-screens/FormsScreen"
import { DefaultScreen } from "./pokedex-screens/DefaultScreen"
import { upperFirst } from "lodash"
import { EvolutionLineScreen } from "./pokedex-screens/EvolutionLineScreen"
import { AbilitiesScreen } from "./pokedex-screens/AbilitiesScreen"

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

export function PokemonDetailed() {
  const {
    selectedPokemon,
    setSelectedPokemon,
    speciesInfo,
    setSpeciesInfo,
    isLoadingScreen,
  } = useSelectedPokemon()

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

  // TODO - lock scroll
  useEffect(() => {
    if (selectedPokemon) {
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.body.style.overflow = "auto"
      setSpeciesInfo(null)
    }
  }, [selectedPokemon, setSpeciesInfo])

  // TODO - Reset on selectedPokemon selected change
  useEffect(() => {
    setInfoScreenContent(INFOS_VARIATION.DEFAULT)
    setSpriteVariation(SPRITE_VARIATIONS.DEFAULT)
    setPositionVariation(POSITION_VARIATIONS.FRONT)
    setSexVariation(SEX_VARIATIONS.MALE)
  }, [selectedPokemon])

  function renderImage() {
    if (!selectedPokemon?.sprites?.frontAnimated) {
      return selectedPokemon?.sprites.front
    }

    if (speciesInfo?.hasFemale && isFemale) {
      if (isBack && isShiny) {
        return selectedPokemon?.sprites.backAnimatedFemaleShiny
      }

      if (isBack) {
        return selectedPokemon?.sprites.backAnimatedFemale
      }

      if (isShiny) {
        return selectedPokemon?.sprites.frontAnimatedFemaleShiny
      }

      return selectedPokemon?.sprites.frontAnimatedFemale
    }

    if (isBack && isShiny) {
      return selectedPokemon.sprites.backAnimatedShiny
    }

    if (isBack) {
      return selectedPokemon.sprites.backAnimated
    }

    if (isShiny) {
      return selectedPokemon.sprites.frontAnimatedShiny
    }

    return selectedPokemon.sprites.frontAnimated
  }

  function renderInfoScreen() {
    if (infoScreenContent === INFOS_VARIATION.DEFAULT) {
      return <DefaultScreen />
    }

    if (infoScreenContent === INFOS_VARIATION.FORMS) {
      return <FormsScreen />
    }

    if (infoScreenContent === INFOS_VARIATION.EVOLUTION_LINE) {
      return <EvolutionLineScreen />
    }

    if (infoScreenContent === INFOS_VARIATION.ABILITIES) {
      return <AbilitiesScreen />
    }

    if (infoScreenContent === INFOS_VARIATION.STATS) {
      return <RadarChart />
    }

    if (infoScreenContent === INFOS_VARIATION.MOVES) {
      return <MovesScreen />
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
        (!selectedPokemon?.sprites?.backAnimatedFemaleShiny &&
          isFemale &&
          isBack) ||
        spriteVariation === SPRITE_VARIATIONS.SHINY ||
        !selectedPokemon?.sprites?.frontAnimatedShiny,
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
      isDisabled: Object.keys(selectedPokemon?.moves ?? {}).length === 0,
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
      if (
        !selectedPokemon?.sprites?.backAnimatedFemaleShiny &&
        isFemale &&
        isShiny
      ) {
        return true
      }

      if (!selectedPokemon?.sprites?.backAnimatedShiny && isShiny) {
        return true
      }

      if (!selectedPokemon?.sprites?.backAnimatedFemale && isFemale) {
        return true
      }

      if (!selectedPokemon?.sprites?.backAnimated) {
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
      if (
        !speciesInfo?.hasFemale ||
        !selectedPokemon?.sprites?.frontAnimatedFemale
      ) {
        return true
      }

      if (
        !selectedPokemon?.sprites?.backAnimatedFemaleShiny &&
        isBack &&
        isShiny
      ) {
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
      className={cn(s.backdrop, { [s.backdropActive]: selectedPokemon })}
    >
      <div className={s.contentWrapper}>
        <div className={s.container}>
          <div className={s.content}>
            <div className={s.screenWrapper}>
              <div className={s.screen}>
                {selectedPokemon ? (
                  <>
                    <img src={background} className={s.background} alt="" />
                    <div className={s.photoPokemonWrapper}>
                      <img
                        loading="lazy"
                        className={s.photoPokemon}
                        src={renderImage()}
                        alt={`Foto do pokemon ${selectedPokemon?.name}`}
                      />
                    </div>

                    <div className={s.pokemonInfoWrapper}>
                      <p>{upperFirst(selectedPokemon.name)}</p>
                      <p>{`#${selectedPokemon.id}`}</p>
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
              className={cn(s.infoScreen, {
                [s.infoScreenActive]: selectedPokemon,
              })}
            >
              {selectedPokemon && (
                <div className={s.infoScreenContentWrapper}>
                  {!isLoadingScreen ? (
                    renderInfoScreen()
                  ) : (
                    <Spinner containerClassname={s.spinnerScreen} />
                  )}
                </div>
              )}
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
