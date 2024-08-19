import cn from "classnames"
import { Spinner } from "../UI/Spinner"
import { useSelectedPokemon } from "../../hooks/useSelectedPokemon"
import { INFOS_VARIATION } from "../../context/SelectedPokemonProvider"
import { FormsScreen } from "./FormsScreen"
import { EvolutionLineScreen } from "./EvolutionLineScreen"
import { AbilitiesScreen } from "./AbilitiesScreen"
import { RadarChart } from "./RadarChart"
import { MovesScreen } from "./MovesScreen"
import { DefaultScreen } from "./DefaultScreen"

import s from "./PokedexInfoScreen.module.css"

export function PokedexInfoScreen() {
  const { selectedPokemon, infoScreenContent, isLoadingScreen } =
    useSelectedPokemon()

  function renderInfoScreen() {
    switch (infoScreenContent) {
      case INFOS_VARIATION.FORMS:
        return <FormsScreen />
      case INFOS_VARIATION.EVOLUTION_LINE:
        return <EvolutionLineScreen />
      case INFOS_VARIATION.ABILITIES:
        return <AbilitiesScreen />
      case INFOS_VARIATION.STATS:
        return <RadarChart />
      case INFOS_VARIATION.MOVES:
        return <MovesScreen />
      default:
        return <DefaultScreen />
    }
  }

  return (
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
  )
}
