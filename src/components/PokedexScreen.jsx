import { upperFirst } from "lodash"
import s from "./PokedexScreen.module.css"
import cn from "classnames"
import { ReactComponent as FemaleIcon } from "../assets/icons/female.svg"
import { ReactComponent as MaleIcon } from "../assets/icons/male.svg"
import { ReactComponent as Rotate } from "../assets/icons/rotate.svg"
import background from "../assets/img/detailed-background.png"
import { useSelectedPokemon } from "../hooks/useSelectedPokemon"
import {
  POSITION_VARIATIONS,
  SEX_VARIATIONS,
} from "../context/SelectedPokemonProvider"
import { ToggleSwitch } from "./UI/ToggleSwitch"

export function PokedexScreen() {
  const {
    selectedPokemon,
    speciesInfo,
    positionVariation,
    isFemale,
    isBack,
    isShiny,
    setSexVariation,
    setPositionVariation,
  } = useSelectedPokemon()

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
  )
}
