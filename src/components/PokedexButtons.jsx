import cn from "classnames"
import s from "./PokedexButtons.module.css"
import {
  INFOS_VARIATION,
  SPRITE_VARIATIONS,
} from "../context/SelectedPokemonProvider"
import { useSelectedPokemon } from "../hooks/useSelectedPokemon"

export function PokedexButtons() {
  const {
    selectedPokemon,
    setSelectedPokemon,
    speciesInfo,
    spriteVariation,
    setSpriteVariation,
    isFemale,
    isBack,
    setInfoScreenContent,
    isLoadingScreen,
  } = useSelectedPokemon()

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

  return (
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
  )
}
